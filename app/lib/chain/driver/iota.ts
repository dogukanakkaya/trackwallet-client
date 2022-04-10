import { request } from '../../request';
import { Driver } from './driver';

export class IOTA implements Driver {
    readonly #url = 'https://chrysalis-nodes.iota.org/api/v1';

    async getBalance(address: string): Promise<number> {
        const balance = await this.getBalanceAsIota(address);

        return balance * 0.000001;
    }

    async getBalanceAsIota(address: string): Promise<number> {
        const { data } = await request.get(`${this.#url}/addresses/${address}`);

        return data.data.balance;
    }
}