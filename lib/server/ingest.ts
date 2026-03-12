import axios from "axios";
import * as cheerio from "cheerio";
import Parser from "feedparser";
import { Readable } from "node:stream";
import { Sentiment } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createHash, getCacheEntry, setCacheEntry } from "@/lib/cache";
import { parseJsonArray } from "@/lib/utils";

type NormalizedItem = {
  title: string;
  summary: string;
  url: string;
  publishedAt: Date;
  rawJson?: unknown;
  metadataOnly?: boolean;
  regionTags?: string[];
  topics?: string[];
  sentiment?: Sentiment;
};

async function fetchWithCache(url: string) {
  const cached = await getCacheEntry(url);
  const response = await axios.get(url, {
    headers: {
      ...(cached?.etag ? { "If-None-Match": cached.etag } : {}),
      ...(cached?.lastModified ? { "If-Modified-Since": cached.lastModified } : {})
    },
    validateStatus: (status) => status < 500
  });

  if (response.status === 304 && cached) {
    return {
      body: cached.bodyText ?? cached.json ?? "",
      fromCache: true
    };
  }

  await setCacheEntry(url, {
    etag: response.headers.etag,
    lastModified: response.headers["last-modified"],
    bodyText: typeof response.data === "string" ? response.data : undefined,
    json: typeof response.data === "object" ? response.data : undefined
  });

  return {
    body: response.data,
    fromCache: false
  };
}

async function parseRss(url: string): Promise<NormalizedItem[]> {
  const { body } = await fetchWithCache(url);
  const parser = new Parser();
  const stream = new Readable();
  stream.push(typeof body === "string" ? body : JSON.stringify(body));
  stream.push(null);
  const items: NormalizedItem[] = [];

  await new Promise<void>((resolve, reject) => {
    stream
      .pipe(parser)
      .on("data", (entry) => {
        items.push({
          title: entry.title ?? "Untitled feed item",
          summary: entry.summary ?? entry.description ?? "No summary available.",
          url: entry.link ?? url,
          publishedAt: entry.pubDate ? new Date(entry.pubDate) : new Date(),
          rawJson: entry
        });
      })
      .on("end", () => resolve())
      .on("error", reject);
  });

  return items.slice(0, 10);
}

async function parsePage(url: string): Promise<NormalizedItem[]> {
  const { body } = await fetchWithCache(url);
  const $ = cheerio.load(typeof body === "string" ? body : "");
  const title = $("title").first().text() || "Page monitor update";
  const summary =
    $('meta[name="description"]').attr("content") ||
    $("p").slice(0, 3).text().slice(0, 420) ||
    "Metadata-only page update.";

  return [
    {
      title,
      summary,
      url,
      publishedAt: new Date(),
      metadataOnly: true,
      rawJson: { htmlCaptured: true }
    }
  ];
}

async function parseApi(url: string): Promise<NormalizedItem[]> {
  const { body } = await fetchWithCache(url);
  const payload = typeof body === "string" ? { value: body } : body;

  return [
    {
      title: `API snapshot: ${new URL(url).hostname}`,
      summary: "Structured API snapshot ingested into IranSignal Pro.",
      url,
      publishedAt: new Date(),
      rawJson: payload
    }
  ];
}

export async function ingestSources(sourceIds?: string[]) {
  const sources = await prisma.source.findMany({
    where: {
      enabled: true,
      ...(sourceIds?.length ? { id: { in: sourceIds } } : {})
    }
  });

  let inserted = 0;

  for (const source of sources) {
    let normalized: NormalizedItem[] = [];
    try {
      if (source.type === "rss") normalized = await parseRss(source.url);
      else if (source.type === "page_monitor") normalized = await parsePage(source.url);
      else normalized = await parseApi(source.url);
    } catch {
      normalized = [
        {
          title: `Fallback ingest: ${source.name}`,
          summary: "Connector fell back to synthetic metadata capture during local development.",
          url: source.url,
          publishedAt: new Date(),
          metadataOnly: true
        }
      ];
    }

    for (const item of normalized) {
      const hash = createHash(`${source.id}:${item.url}:${item.title}`);
      const existing = await prisma.item.findUnique({ where: { hash } });
      if (existing) continue;

      await prisma.item.create({
        data: {
          sourceId: source.id,
          title: item.title,
          summary: item.summary,
          url: item.url,
          publishedAt: item.publishedAt,
          fetchedAt: new Date(),
          regionTags: JSON.stringify(item.regionTags ?? parseJsonArray<string>(source.regionTags)),
          topics: JSON.stringify(item.topics ?? inferTopics(`${item.title} ${item.summary}`)),
          confidence: "reported",
          hash,
          rawJson: item.rawJson ? JSON.stringify(item.rawJson) : null,
          metadataOnly: item.metadataOnly ?? source.mode === "metadata_only",
          sentiment: item.sentiment ?? inferSentiment(item.summary)
        }
      });

      inserted += 1;
    }
  }

  await prisma.auditLog.create({
    data: {
      action: "ingest.run",
      actor: "system",
      detailsJson: JSON.stringify({ sourceIds: sourceIds ?? "all", inserted })
    }
  });

  await evaluateAlerts();

  return { inserted, processed: sources.length };
}

function inferTopics(text: string) {
  const value = text.toLowerCase();
  const matches = [];
  if (value.includes("sanction")) matches.push("sanctions");
  if (value.includes("nuclear") || value.includes("iaea") || value.includes("uranium")) matches.push("nuclear");
  if (value.includes("ship") || value.includes("hormuz") || value.includes("tanker")) matches.push("shipping");
  if (value.includes("humanitarian") || value.includes("refugee")) matches.push("humanitarian");
  if (value.includes("protest")) matches.push("protests");
  if (value.includes("travel")) matches.push("travel_advisory");
  if (value.includes("cyber") || value.includes("outage")) matches.push("cyber");
  if (value.includes("flight") || value.includes("airspace")) matches.push("aviation");
  if (value.includes("missile") || value.includes("strike") || value.includes("irgc")) matches.push("military");
  if (!matches.includes("diplomacy")) matches.push("diplomacy");
  return Array.from(new Set(matches)).slice(0, 4);
}

function inferSentiment(summary: string) {
  const value = summary.toLowerCase();
  if (/(strike|warning|sanction|disrupt|attack|threat|surge)/.test(value)) return Sentiment.negative;
  if (/(deal|talks|relief|resume|stability)/.test(value)) return Sentiment.positive;
  return Sentiment.neutral;
}

async function evaluateAlerts() {
  const [rules, items] = await Promise.all([
    prisma.alertRule.findMany({ where: { enabled: true } }),
    prisma.item.findMany({
      take: 50,
      orderBy: { publishedAt: "desc" }
    })
  ]);

  for (const rule of rules) {
    const keywords = parseJsonArray<string>(rule.keywords).map((keyword) => keyword.toLowerCase());
    const topicFilter = parseJsonArray<string>(rule.topicFilter);
    const regionFilter = parseJsonArray<string>(rule.regionFilter);

    for (const item of items) {
      const itemTopics = parseJsonArray<string>(item.topics);
      const itemRegions = parseJsonArray<string>(item.regionTags);
      const text = `${item.title} ${item.summary}`.toLowerCase();

      const keywordMatch = keywords.length === 0 || keywords.some((keyword) => text.includes(keyword));
      const topicMatch = topicFilter.length === 0 || topicFilter.some((topic) => itemTopics.includes(topic));
      const regionMatch = regionFilter.length === 0 || regionFilter.some((region) => itemRegions.includes(region));
      const confidenceMatch = !rule.confidenceFilter || item.confidence === rule.confidenceFilter;

      if (keywordMatch && topicMatch && regionMatch && confidenceMatch) {
        await prisma.alertHit.upsert({
          where: {
            alertRuleId_itemId: {
              alertRuleId: rule.id,
              itemId: item.id
            }
          },
          update: {},
          create: {
            alertRuleId: rule.id,
            itemId: item.id
          }
        });
      }
    }
  }
}
