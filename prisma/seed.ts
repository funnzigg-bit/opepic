import "dotenv/config";
import { PrismaClient, Confidence, NotifyMode, Reliability, Sentiment, SourceMode, SourceType, WidgetType } from "@prisma/client";

const prisma = new PrismaClient();

const sourceSeeds = [
  ["UN Press", "rss", "https://press.un.org/en/rss.xml", ["iran", "un"], "official"],
  ["UN Geneva", "rss", "https://www.ungeneva.org/en/main-search?f%5B0%5D=content_type%3Anews&format=feed&type=rss", ["iran", "un"], "official"],
  ["ReliefWeb Iran", "api", "https://api.reliefweb.int/v1/reports?appname=iran-signal&query[value]=Iran", ["iran", "humanitarian"], "reputable"],
  ["US Treasury", "rss", "https://home.treasury.gov/news/press-releases/rss.xml", ["sanctions", "us"], "official"],
  ["OFAC Updates", "page_monitor", "https://ofac.treasury.gov/recent-actions", ["sanctions", "us"], "official"],
  ["FCDO GovWire", "rss", "https://www.gov.uk/search/news-and-communications.atom?organisations%5B%5D=foreign-commonwealth-development-office", ["uk", "travel"], "official"],
  ["IAEA News", "rss", "https://www.iaea.org/newscenter/rss", ["nuclear", "iran"], "official"],
  ["Iran Nuclear X Search", "x", "https://x.com/search?q=iran%20nuclear", ["nuclear", "social"], "unverified"],
  ["IRGC Strike X Search", "x", "https://x.com/search?q=IRGC%20strikes", ["military", "social"], "unverified"],
  ["OpenSky Iran Airspace", "aviation", "https://opensky-network.org/api/flights/all", ["aviation", "iran"], "reputable"],
  ["MarineTraffic Hormuz", "api", "https://www.marinetraffic.com", ["shipping", "hormuz"], "reputable"],
  ["OilPriceAPI Brent", "market", "https://api.oilpriceapi.com/v1/prices/latest?by_code=BRENT_CRUDE_USD", ["markets", "oil"], "reputable"],
  ["OilPriceAPI WTI", "market", "https://api.oilpriceapi.com/v1/prices/latest?by_code=WTI_CRUDE_USD", ["markets", "oil"], "reputable"],
  ["Defense Stocks LMT", "market", "https://query1.finance.yahoo.com/v8/finance/chart/LMT", ["markets", "defense"], "reputable"],
  ["Defense Stocks RTX", "market", "https://query1.finance.yahoo.com/v8/finance/chart/RTX", ["markets", "defense"], "reputable"],
  ["OpenWeather Tehran", "weather", "https://api.openweathermap.org/data/2.5/weather?q=Tehran", ["weather", "tehran"], "reputable"],
  ["OpenWeather Isfahan", "weather", "https://api.openweathermap.org/data/2.5/weather?q=Isfahan", ["weather", "isfahan"], "reputable"],
  ["OpenWeather Bandar Abbas", "weather", "https://api.openweathermap.org/data/2.5/weather?q=Bandar Abbas", ["weather", "bandar-abbas"], "reputable"],
  ["AlienVault OTX", "cyber", "https://otx.alienvault.com/otxapi/indicators/export", ["cyber", "threats"], "reputable"],
  ["Tehran Traffic Live", "webcam", "https://www.youtube.com/embed/live_stream?channel=UC16niRr50-MSBwiO3YDb3RA", ["tehran", "webcam"], "unverified"],
  ["Hormuz Live", "webcam", "https://www.youtube.com/embed/live_stream?channel=UCI4m2dMZbYgS2yfD2N-V0vw", ["hormuz", "webcam"], "unverified"],
  ["USGS Earthquakes", "api", "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson", ["earthquake", "middle-east"], "official"],
  ["Sentinel Hub EO", "api", "https://services.sentinel-hub.com/ogc/wms", ["satellite", "bda"], "reputable"],
  ["FlightRadar24 Tehran", "video_embed", "https://www.flightradar24.com/35.69,51.39/7", ["aviation", "tehran"], "reputable"],
  ["FlightRadar24 Gulf", "video_embed", "https://www.flightradar24.com/26.21,56.25/7", ["aviation", "hormuz"], "reputable"],
  ["Lloyd's List", "rss", "https://lloydslist.maritimeintelligence.informa.com/rss", ["shipping", "maritime"], "reputable"],
  ["Reuters Middle East", "rss", "https://feeds.reuters.com/reuters/worldNews", ["middle-east", "news"], "reputable"],
  ["AP World", "rss", "https://apnews.com/hub/ap-top-news?output=amp", ["world", "news"], "reputable"],
  ["BBC World", "rss", "https://feeds.bbci.co.uk/news/world/rss.xml", ["world", "news"], "reputable"],
  ["Al Jazeera Middle East", "rss", "https://www.aljazeera.com/xml/rss/all.xml", ["middle-east", "news"], "reputable"],
  ["CFR Iran", "page_monitor", "https://www.cfr.org/middle-east-and-north-africa/iran", ["analysis", "iran"], "reputable"],
  ["CSIS Missile Threat", "page_monitor", "https://missilethreat.csis.org/country/iran", ["missiles", "iran"], "reputable"],
  ["Institute for Science and International Security", "rss", "https://isis-online.org/feeds/posts/default", ["nuclear", "analysis"], "reputable"],
  ["Naval News", "rss", "https://www.navalnews.com/feed/", ["shipping", "naval"], "reputable"],
  ["Bellingcat", "rss", "https://www.bellingcat.com/feed/", ["osint", "analysis"], "reputable"],
  ["War on the Rocks", "rss", "https://warontherocks.com/feed/", ["analysis", "military"], "reputable"],
  ["The Maritime Executive", "rss", "https://www.maritime-executive.com/rss", ["shipping", "maritime"], "reputable"],
  ["UKMTO Advisories", "page_monitor", "https://www.ukmto.org/indian-ocean", ["shipping", "advisories"], "official"],
  ["CENTCOM Releases", "rss", "https://www.centcom.mil/RSS/", ["military", "us"], "official"],
  ["US State Dept Travel", "rss", "https://travel.state.gov/content/travel/en/News/rss.xml", ["travel", "us"], "official"],
  ["EU Sanctions", "page_monitor", "https://finance.ec.europa.eu/eu-and-world/sanctions-restrictive-measures_en", ["sanctions", "eu"], "official"],
  ["NCSC Advisories", "rss", "https://www.ncsc.gov.uk/api/1/services/v1/report-rss-feed.xml", ["cyber", "uk"], "official"],
  ["CISA Alerts", "rss", "https://www.cisa.gov/cybersecurity-advisories/all.xml", ["cyber", "us"], "official"],
  ["IntelCrab X", "x", "https://x.com/IntelCrab", ["social", "osint"], "unverified"],
  ["Aurora Intel X", "x", "https://x.com/AuroraIntel", ["social", "osint"], "unverified"],
  ["OSINT Defender X", "x", "https://x.com/sentdefender", ["social", "osint"], "unverified"],
  ["LiveUAmap Middle East", "page_monitor", "https://middleeast.liveuamap.com/", ["map", "conflict"], "reputable"],
  ["NASA FIRMS", "api", "https://firms.modaps.eosdis.nasa.gov/api/area/csv", ["fires", "satellite"], "official"],
  ["ACLED MENA", "api", "https://api.acleddata.com/acled/read/", ["conflict", "mena"], "reputable"],
  ["OCHA MENA", "rss", "https://www.unocha.org/feeds/mena.xml", ["humanitarian", "mena"], "official"],
  ["WHO Emergencies", "rss", "https://www.who.int/feeds/entity/emergencies-news/rss.xml", ["humanitarian", "health"], "official"],
  ["Trading Economics LNG", "api", "https://api.tradingeconomics.com/commodities", ["markets", "energy"], "reputable"],
  ["Red Sea Shipping X Search", "x", "https://x.com/search?q=red%20sea%20shipping", ["shipping", "social"], "unverified"],
  ["Hormuz Tanker Search", "x", "https://x.com/search?q=hormuz%20tanker", ["shipping", "social"], "unverified"],
  ["Iran Protest Tracker", "page_monitor", "https://www.amnesty.org/en/location/middle-east-and-north-africa/iran/report-iran/", ["protests", "rights"], "reputable"],
  ["NetBlocks", "rss", "https://netblocks.org/feed/", ["cyber", "internet"], "reputable"],
  ["Cloudflare Radar", "page_monitor", "https://radar.cloudflare.com/ir", ["cyber", "internet"], "reputable"],
  ["Janes Headlines", "page_monitor", "https://www.janes.com/defence-news", ["military", "analysis"], "reputable"]
] as const;

const topicCycle = ["sanctions", "diplomacy", "nuclear", "shipping", "humanitarian", "protests", "travel_advisory", "cyber", "aviation", "military"] as const;
const regions = ["tehran", "isfahan", "bandar-abbas", "hormuz", "iraq", "syria", "gulf", "israel", "mena"] as const;
const sentiments = [Sentiment.negative, Sentiment.neutral, Sentiment.positive];
const confidences = [Confidence.confirmed, Confidence.reported, Confidence.unverified];

async function main() {
  await prisma.alertHit.deleteMany();
  await prisma.alertRule.deleteMany();
  await prisma.item.deleteMany();
  await prisma.source.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.cacheEntry.deleteMany();
  await prisma.dashboardLayout.deleteMany();
  await prisma.widget.deleteMany();

  const createdSources = await Promise.all(
    sourceSeeds.map(([name, type, url, regionTags, reliability], index) =>
      prisma.source.create({
        data: {
          name,
          type: type as SourceType,
          url,
          regionTags: JSON.stringify(regionTags),
          reliability: reliability as Reliability,
          mode: index % 3 === 0 ? SourceMode.full_ingest : SourceMode.metadata_only,
          allowEmbed: type === "video_embed" || type === "webcam",
          tosNotes: "Respect provider terms and rate limits. Embed only when explicitly permitted."
        }
      })
    )
  );

  const now = new Date("2026-03-12T12:00:00.000Z");

  for (let index = 0; index < 100; index += 1) {
    const source = createdSources[index % createdSources.length];
    const topic = topicCycle[index % topicCycle.length];
    const region = regions[index % regions.length];
    await prisma.item.create({
      data: {
        sourceId: source.id,
        title: `IranSignal update ${index + 1}: ${topic.replace("_", " ")} watchpoint`,
        summary: `Demo OSINT item ${index + 1} tracking ${topic.replace("_", " ")} activity around ${region}. Generated for the March 2026 command center scenario.`,
        url: `${source.url}#item-${index + 1}`,
        publishedAt: new Date(now.getTime() - index * 18 * 60 * 1000),
        fetchedAt: new Date(now.getTime() - index * 15 * 60 * 1000),
        regionTags: JSON.stringify([region, "iran"]),
        topics: JSON.stringify([topic]),
        confidence: confidences[index % confidences.length],
        hash: `seed-${index + 1}`,
        rawJson: JSON.stringify({ demo: true, index, region, topic }),
        metadataOnly: index % 4 !== 0,
        sentiment: sentiments[index % sentiments.length]
      }
    });
  }

  const rules = await Promise.all([
    prisma.alertRule.create({
      data: {
        name: "Hormuz Escalation",
        keywords: JSON.stringify(["hormuz", "tanker", "strait", "mine"]),
        topicFilter: JSON.stringify(["shipping", "military"]),
        regionFilter: JSON.stringify(["hormuz", "gulf"]),
        confidenceFilter: Confidence.reported,
        enabled: true,
        notifyMode: NotifyMode.in_app
      }
    }),
    prisma.alertRule.create({
      data: {
        name: "Iran Nuclear Threshold",
        keywords: JSON.stringify(["iaea", "enrichment", "centrifuge"]),
        topicFilter: JSON.stringify(["nuclear"]),
        regionFilter: JSON.stringify(["iran", "isfahan"]),
        confidenceFilter: Confidence.confirmed,
        enabled: true,
        notifyMode: NotifyMode.email
      }
    })
  ]);

  const seededItems = await prisma.item.findMany({ take: 12, orderBy: { publishedAt: "desc" } });
  for (const item of seededItems) {
    const rule = item.title.toLowerCase().includes("nuclear") ? rules[1] : rules[0];
    await prisma.alertHit.create({
      data: {
        alertRuleId: rule.id,
        itemId: item.id
      }
    });
  }

  const widgets = [
    { type: WidgetType.kpi, config: { title: "Threatcon", metric: "DELTA-3" }, sourceIds: [] },
    { type: WidgetType.feed, config: { title: "Latest Feed", topics: ["military", "nuclear"] }, sourceIds: createdSources.slice(0, 8).map((source) => source.id) },
    { type: WidgetType.map, config: { title: "Gulf Map", layers: ["shipping", "aviation", "weather"] }, sourceIds: createdSources.slice(8, 20).map((source) => source.id) },
    { type: WidgetType.ai_brief, config: { title: "AI Morning Brief" }, sourceIds: [] },
    { type: WidgetType.orbat, config: { title: "Order of Battle" }, sourceIds: [] },
    { type: WidgetType.bda, config: { title: "Damage Assessment" }, sourceIds: [] }
  ];

  const createdWidgets = await Promise.all(
    widgets.map((widget) =>
      prisma.widget.create({
        data: {
          type: widget.type,
          config: JSON.stringify(widget.config),
          sourceIds: JSON.stringify(widget.sourceIds)
        }
      })
    )
  );

  await prisma.dashboardLayout.create({
    data: {
      userId: "demo-user",
      name: "Command Center",
      widgets: JSON.stringify(
        createdWidgets.map((widget, index) => ({
          i: widget.id,
          x: (index * 2) % 12,
          y: Math.floor(index / 3) * 3,
          w: index === 2 ? 6 : 4,
          h: index === 2 ? 5 : 3,
          type: widget.type
        }))
      )
    }
  });

  await prisma.dashboardLayout.create({
    data: {
      userId: "demo-user",
      name: "Conflict Monitor",
      widgets: JSON.stringify([
        { i: createdWidgets[2].id, x: 0, y: 0, w: 8, h: 6, type: createdWidgets[2].type },
        { i: createdWidgets[1].id, x: 8, y: 0, w: 4, h: 6, type: createdWidgets[1].type },
        { i: createdWidgets[4].id, x: 0, y: 6, w: 6, h: 4, type: createdWidgets[4].type },
        { i: createdWidgets[5].id, x: 6, y: 6, w: 6, h: 4, type: createdWidgets[5].type }
      ])
    }
  });

  await prisma.auditLog.createMany({
    data: [
      {
        action: "seed.bootstrap",
        actor: "system",
        detailsJson: JSON.stringify({ sources: createdSources.length, items: 100, scenarioDate: "2026-03-12" })
      },
      {
        action: "layout.create",
        actor: "system",
        detailsJson: JSON.stringify({ layouts: ["Command Center", "Conflict Monitor"] })
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
