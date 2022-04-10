import { request } from '../../request';
import { Driver } from './driver';

export class Polkadot implements Driver {
    readonly #url = 'https://rpc.polkadot.io'

    async getBalance(address: string): Promise<number> {
        const { data } = await request.post(this.#url, {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_getBalance',
            params: [
                address
            ]
        });

        return parseInt(data.result, 16) / Math.pow(10, 18);
    }
}