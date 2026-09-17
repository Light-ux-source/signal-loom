export type RawPost = {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  url: string;
};

export type ScoredSignal = RawPost & {
  title: string;
  summary: string;
  confidence: number;
  momentum: string;
  risk: 'low' | 'medium' | 'high';
  reason: string;
};
