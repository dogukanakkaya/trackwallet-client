import { Solana } from './solana';

export interface Driver {
    getBalance: (address: string) => Promise<number>;
}

export const drivers: Record<string, Driver> = {
    'SOL': new Solana()
}