declare module "feedparser" {
  import { Transform } from "node:stream";

  export default class FeedParser extends Transform {
    constructor(options?: Record<string, unknown>);
  }
}
