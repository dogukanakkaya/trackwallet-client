import axios, { AxiosInstance } from 'axios';
import { COINMARKETCAP_API_KEY } from '../../config.server';

export class Coinmarketcap {
    static #instance: Coinmarketcap | null = null;
    #request: AxiosInstance;

    private constructor() {
        let baseURL = 'https://sandbox-api.coinmarketcap.com';
        let apiKey = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c';

        if (true || process.env.NODE_ENV === 'production') {
            baseURL = 'https://pro-api.coinmarketcap.com';
            apiKey = COINMARKETCAP_API_KEY!;
        }

        this.#request = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CMC_PRO_API_KEY': apiKey
            }
        });
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new Coinmarketcap();
        }

        return this.#instance;
    }

    async getListings(): Promise<Listing[]> {
        const { data } = await this.#request.get(`/v1/cryptocurrency/listings/latest`)

        return data.data;
    }
}

export interface Listing {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    num_market_pairs: number;
    date_added: Date;
    tags: string[];
    max_supply?: number;
    circulating_supply: number;
    total_supply: number;
    platform: {
        id: number;
        name: string;
        symbol: string;
        slug: string;
        token_address: string;
    };
    cmc_rank: number;
    self_reported_circulating_supply?: number;
    self_reported_market_cap?: number;
    last_updated: Date;
    quote: Record<string, {
        price: number;
        volume_24h: number;
        volume_change_24h: number;
        percent_change_1h: number;
        percent_change_24h: number;
        percent_change_7d: number;
        percent_change_30d: number;
        percent_change_60d: number;
        percent_change_90d: number;
        market_cap: number;
        market_cap_dominance: number;
        fully_diluted_market_cap: number;
        last_updated: Date;
    }>
}