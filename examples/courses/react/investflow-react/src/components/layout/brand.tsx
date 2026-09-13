import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function Brand({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-extrabold tracking-tight text-slate-900 dark:text-white">
      <span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white">
        <TrendingUp className="size-5" aria-hidden />
      </span>
      InvestFlow
    </Link>
  );
}
