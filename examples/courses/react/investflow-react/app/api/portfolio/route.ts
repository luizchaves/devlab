import { NextResponse } from 'next/server';
import { calculateCategoryAllocation, calculatePortfolioTotal, type AssetPosition } from '@/core/portfolio';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';

const demoAssets: AssetPosition[] = [
  {
    id: 'demo-bbas3',
    symbol: 'BBAS3',
    name: 'Banco do Brasil',
    category: 'Ações',
    quantity: 100,
    price: 28.45,
    currency: 'BRL',
  },
  {
    id: 'demo-tesouro',
    symbol: 'TESOURO-IPCA',
    name: 'Tesouro IPCA+ 2035',
    category: 'Renda fixa',
    quantity: 2,
    price: 4320.1,
    currency: 'BRL',
  },
  {
    id: 'demo-ivvb11',
    symbol: 'IVVB11',
    name: 'ETF S&P 500',
    category: 'Exterior',
    quantity: 12,
    price: 328.9,
    currency: 'BRL',
  },
];

export async function GET() {
  const session = await requireSession();
  const storedAssets = await prisma.asset.findMany({
    where: { ownerId: session.user.id },
    orderBy: { symbol: 'asc' },
  });
  const assets =
    storedAssets.length > 0
      ? storedAssets.map((asset) => ({
          id: asset.id,
          symbol: asset.symbol,
          name: asset.name,
          category: asset.category,
          quantity: Number(asset.quantity),
          price: Number(asset.price),
          currency: asset.currency,
        }))
      : demoAssets;

  return NextResponse.json({
    assets,
    total: calculatePortfolioTotal(assets),
    allocation: calculateCategoryAllocation(assets),
  });
}
