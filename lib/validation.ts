import { z } from "zod";

export const sourceSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["rss", "api", "manual", "video_embed", "page_monitor", "twitter", "x", "webcam", "market", "weather", "aviation", "cyber"]),
  url: z.string().url(),
  regionTags: z.array(z.string()).default([]),
  reliability: z.enum(["official", "reputable", "unverified"]),
  mode: z.enum(["full_ingest", "metadata_only"]),
  enabled: z.boolean().default(true),
  allowEmbed: z.boolean().default(false),
  tosNotes: z.string().default("")
});

export const alertRuleSchema = z.object({
  name: z.string().min(2),
  keywords: z.array(z.string()).default([]),
  topicFilter: z.array(z.string()).default([]),
  regionFilter: z.array(z.string()).default([]),
  confidenceFilter: z.enum(["confirmed", "reported", "unverified"]).nullable().optional(),
  enabled: z.boolean().default(true),
  notifyMode: z.enum(["in_app", "email", "sms"])
});

export const analyzeSchema = z.object({
  prompt: z.string().min(8),
  itemIds: z.array(z.string()).default([])
});

export const layoutSchema = z.object({
  userId: z.string().default("demo-user"),
  name: z.string().min(2),
  widgets: z.array(
    z.object({
      i: z.string(),
      x: z.number(),
      y: z.number(),
      w: z.number(),
      h: z.number(),
      type: z.string()
    })
  )
});
