import { request } from '../../request';
import { Driver } from './driver';

export class Avalanche implements Driver {
    readonly #urls = {
        c: 'https://api.avax.network/ext/bc/C/rpc'
    }

    async getBalance(address: string): Promise<number> {
        console.log(address);

        const { data } = await request.post(this.#urls.c, {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_getBalance',
            params: [
                address,
                'latest'
            ]
        });

        return parseInt(data.result, 16) / Math.pow(10, 18);
    }
}