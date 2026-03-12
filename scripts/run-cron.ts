import cron from "node-cron";
import { ingestSources } from "@/lib/server/ingest";

cron.schedule("*/5 * * * *", async () => {
  const result = await ingestSources();
  console.log(`[cron] processed=${result.processed} inserted=${result.inserted}`);
});

console.log("IranSignal Pro cron started on */5 schedule.");
