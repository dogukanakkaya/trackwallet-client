import { request } from '../../request';
import { Driver } from './driver';

export class Solana implements Driver {
    readonly #url = 'https://api.mainnet-beta.solana.com';

    async getBalance(address: string): Promise<number> {
        const lamport = await this.getBalanceAsLamport(address);

        return lamport * 0.000000001;
    }

    async getBalanceAsLamport(address: string): Promise<number> {
        const { data } = await request.post(this.#url, [
            {
                jsonrpc: '2.0',
                id: 1,
                method: 'getBalance',
                params: [
                    address
                ]
            }
        ]);

        return data[0].result.value;
    }
}