export interface Host {
  id: string;
  name: string;
  address: string;
}

export interface HostInput {
  name?: string;
  address?: string;
}
