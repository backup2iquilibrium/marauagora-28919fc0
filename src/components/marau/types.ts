export type TickerItem = {
  label: string;
  value: string;
};

export type NavItem = {
  label: string;
  href: string;
  accent?: boolean;
};

export type HeroSlide = {
  tag: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  tagTone?: "secondary" | "primary" | "muted";
};

export type NewsItem = {
  category: string;
  time: string;
  title: string;
  excerpt: string;
  imageUrl: string;
};

export type JobItem = {
  title: string;
  company: string;
  location?: string;
  typeLabel: string;
};

export type CityGuideItem = {
  label: string;
  imageUrl: string;
};
