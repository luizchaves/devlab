import type { Ping } from '@/types/Ping.d.ts';
import type { Tag } from '@/types/Tag.d.ts';

export interface Host {
  id: string;
  name: string;
  address: string;
  createdAt: Date;
  tags: Tag[];
  pings: Ping[];
}

export interface HostInput {
  name?: string;
  address?: string;
  /** Nomes das tags. Uma tag que nao existe e criada na hora. */
  tags?: string[];
}
