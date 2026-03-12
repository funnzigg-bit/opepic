export type WidgetLayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
};

export type WidgetConfig = {
  title?: string;
  topics?: string[];
  layers?: string[];
  metric?: string;
};

export type FeedItem = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string | Date;
  source: { id: string; name: string };
  topics: string[];
  regionTags: string[];
  confidence: string;
  sentiment: string;
};
