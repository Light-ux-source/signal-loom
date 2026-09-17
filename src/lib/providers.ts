import type { RawPost, ScoredSignal } from '@/lib/signal-types';

const demoPosts: RawPost[] = [
  {
    id: 'demo-1',
    text: '中文演示：智能体正在从聊天窗口进入人们已经使用的工具，真正的变化是交互方式而不是模型本身。',
    author: 'signal_loom_demo',
    createdAt: new Date().toISOString(),
    url: 'https://x.com/swyx',
  },
  {
    id: 'demo-2',
    text: '中文演示：模型路由正在成为产品能力，团队需要在一个地方观察质量、延迟和成本。',
    author: 'signal_loom_demo',
    createdAt: new Date().toISOString(),
    url: 'https://x.com/OpenRouterAI',
  },
];

export async function searchX(keyword: string): Promise<RawPost[]> {
  const token = process.env.X_API_KEY ?? process.env.X_BEARER_TOKEN;
  if (!token) return demoPosts.map((post) => ({ ...post, text: `【演示：${keyword}】${post.text}` }));

  const params = new URLSearchParams({
    query: `${keyword} lang:zh -is:retweet`,
    queryType: 'Latest',
  });
  const response = await fetch(`https://api.twitterapi.io/twitter/tweet/advanced_search?${params}`, {
    headers: { 'X-API-Key': token },
    next: { revalidate: 0 },
  });
  if (!response.ok) throw new Error(`TwitterAPI.io request failed: ${response.status}`);
  const payload = await response.json();
  return (payload.tweets ?? []).filter((tweet: { text: string }) => /[\u4e00-\u9fff]/.test(tweet.text)).map((tweet: { id: string; text: string; author?: { userName?: string; name?: string }; createdAt: string; url?: string }) => ({
    id: tweet.id,
    text: tweet.text,
    author: tweet.author?.userName ?? tweet.author?.name ?? 'unknown',
    createdAt: tweet.createdAt,
    url: tweet.url ?? `https://x.com/i/web/status/${tweet.id}`,
  }));
}

export async function scoreWithOpenRouter(posts: RawPost[]): Promise<ScoredSignal[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return posts.map((post, index) => ({
      ...post,
      title: post.text.split('. ')[0],
      summary: post.text,
      confidence: index === 0 ? 92 : 84,
      momentum: index === 0 ? '+184%' : '+72%',
      risk: 'low',
      reason: 'Demo mode: configure OPENROUTER_API_KEY for live scoring.',
    }));
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL ?? 'http://localhost:3000',
      'X-Title': 'Signal Loom',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL ?? 'nex-agi/nex-n2.5-mini:free',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: '你是严谨的中文热点分析员。只保留正文主要为简体中文的内容，过滤广告、重复、无证据和煽动性内容。不要声称事实绝对为真。只返回 JSON，格式为 {"signals":[]}。每项必须包含 postId、中文 title、中文 summary、confidence（0-100）、momentum、risk（low|medium|high）和中文 reason。所有可见文字字段必须是简体中文。' },
        { role: 'user', content: JSON.stringify(posts) },
      ],
    }),
  });
  if (!response.ok) throw new Error(`OpenRouter request failed: ${response.status}`);
  const payload = await response.json();
  const results = JSON.parse(payload.choices?.[0]?.message?.content ?? '{"signals":[]}').signals as Array<Omit<ScoredSignal, keyof RawPost> & { postId: string }>;
  return results
    .filter((result) => /[\u4e00-\u9fff]/.test(`${result.title}${result.summary}`))
    .map((result) => ({ ...posts.find((post) => post.id === result.postId)!, ...result }));
}
