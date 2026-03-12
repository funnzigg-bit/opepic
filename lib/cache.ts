import crypto from "node:crypto";
import { prisma } from "@/lib/db";

export async function getCacheEntry(key: string) {
  return prisma.cacheEntry.findUnique({ where: { key } });
}

export async function setCacheEntry(key: string, payload: { etag?: string; lastModified?: string; bodyText?: string; json?: unknown }) {
  return prisma.cacheEntry.upsert({
    where: { key },
    update: {
      etag: payload.etag,
      lastModified: payload.lastModified,
      bodyText: payload.bodyText,
      json: payload.json ? JSON.stringify(payload.json) : undefined
    },
    create: {
      key,
      etag: payload.etag,
      lastModified: payload.lastModified,
      bodyText: payload.bodyText,
      json: payload.json ? JSON.stringify(payload.json) : undefined
    }
  });
}

export function createHash(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
