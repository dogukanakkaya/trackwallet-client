import { ApiPromise, HttpProvider } from '@polkadot/api';
import { request } from '../../request';
import { Driver } from './driver';

export class Polkadot implements Driver {
    static #instance: Polkadot | null = null;

    private constructor(private api: ApiPromise) { }

    static async getInstance() {
        if (!this.#instance) {
            const httpProvider = new HttpProvider('https://rpc.polkadot.io');
            const api = await ApiPromise.create({ provider: httpProvider });

            this.#instance = new Polkadot(api);
        }

        return this.#instance;
    }

    async getBalance(address: string): Promise<number> {
        const planck = await this.getBalanceAsPlanck(address);

        return planck * 0.0000000001;
    }

    async getBalanceAsPlanck(address: string): Promise<number> {
        const response = await this.api.query.system.account(address);
        const { data } = response.toJSON() as unknown as { data: { free: number } };

        return data.free;
    }
}

