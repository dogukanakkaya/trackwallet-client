import { Avalanche } from './avalanche';
import { IOTA } from './iota';
import { Polkadot } from './polkadot';
import { Solana } from './solana';

// todo: move drivers to another service (Node-Nest or Deno)
export interface Driver {
    getBalance: (address: string) => Promise<number>;
}

export const getDrivers = async (): Promise<Record<string, Driver>> => ({
    'SOL': new Solana(),
    'AVAX': new Avalanche(),
    'MIOTA': new IOTA(),
    'DOT': await Polkadot.getInstance()
})