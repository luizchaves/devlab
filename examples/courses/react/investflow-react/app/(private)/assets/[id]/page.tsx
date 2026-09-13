import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { AssetDetail } from '@/features/asset/asset-detail';
import { getAssetEvolution } from '@/server/analytics';
import { getAsset } from '@/server/assets';
import { auth } from '@/server/auth';
import { requirePageSession } from '@/server/session';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const session = await auth();
  const asset = session?.user ? await getAsset(session.user.id, (await params).id) : null;
  return { title: asset?.ticker ?? 'Ativo' };
}

// #region page
/**
 * `/assets/<id>` ou `/assets/<ticker>`. Ativo de outra conta cai no mesmo
 * "não encontrado" de um id inexistente: a página não confirma que ele existe (CA03.10).
 */
export default async function AssetPage({ params }: Props) {
  const { id } = await params;
  const session = await requirePageSession(`/assets/${id}`);
  const asset = await getAsset(session.user.id, id);

  if (!asset) {
    return (
      <section className="grid justify-items-center gap-4 py-16 text-center" data-not-found>
        <h1 className="text-2xl font-bold">Investimento não encontrado</h1>
        <p className="text-slate-500">Ele não existe ou não pertence à sua carteira.</p>
        <Link href="/dashboard" className={buttonVariants({ variant: 'secondary' })}>
          Voltar para a carteira
        </Link>
      </section>
    );
  }

  const evolution = (await getAssetEvolution(session.user.id, asset.id)) ?? { evolution: [], evolutionNative: [], movementMonths: [] };
  return <AssetDetail initialAsset={asset} evolution={evolution} />;
}
// #endregion
