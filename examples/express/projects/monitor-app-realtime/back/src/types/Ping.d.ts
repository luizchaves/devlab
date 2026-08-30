export interface Ping {
  id: string;
  latency: number | null;
  success: boolean;
  createdAt: Date;
  hostId: string;
}
