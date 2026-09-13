import { NextResponse, type NextRequest } from 'next/server';
import { fetchMarketQuote } from '@/lib/external-quotes';
import { requireSession } from '@/lib/session';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  await requireSession();
  const { symbol } = await params;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const quote = await fetchMarketQuote(symbol, controller.signal);
    return NextResponse.json(quote);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown quote error';
    return NextResponse.json({ message }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
