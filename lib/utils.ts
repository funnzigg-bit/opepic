import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJsonArray<T>(value: string | null | undefined, fallback: T[] = []): T[] {
  if (!value) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function formatThreatcon(score: number) {
  if (score >= 85) return "DELTA-1";
  if (score >= 70) return "DELTA-2";
  if (score >= 55) return "DELTA-3";
  if (score >= 35) return "DELTA-4";
  return "DELTA-5";
}

export function scenarioClock() {
  const scenarioStart = new Date("2026-03-01T00:00:00.000Z").getTime();
  const diffMs = Date.now() - scenarioStart;
  const hours = Math.floor(diffMs / 3_600_000);
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000);
  return `T+${hours.toString().padStart(3, "0")}:${minutes.toString().padStart(2, "0")}`;
}
