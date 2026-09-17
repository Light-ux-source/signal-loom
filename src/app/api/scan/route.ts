import { NextResponse } from 'next/server';
import { scoreWithOpenRouter, searchX } from '@/lib/providers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const keyword = typeof body.keyword === 'string' ? body.keyword.trim() : '';
    if (!keyword) return NextResponse.json({ error: 'keyword is required' }, { status: 400 });

    const posts = await searchX(keyword);
    const signals = await scoreWithOpenRouter(posts);
    const hasXKey = process.env.X_API_KEY ?? process.env.X_BEARER_TOKEN;
    return NextResponse.json({ keyword, mode: hasXKey && process.env.OPENROUTER_API_KEY ? 'live' : 'demo', signals });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'scan failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
