export interface UserIdentity {
  address: string;
  ensName?: string | null;
  avatar?: string | null;
  hasBurnedNft: boolean;
}

export interface TreasuryStat {
  label: string;
  value: string;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}

export enum TransactionStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}
