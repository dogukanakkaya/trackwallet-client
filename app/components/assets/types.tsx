export interface Wallet {
    id: string;
    address: string;
    balance: Record<string, number>;
}

export interface Asset {
    id: string;
    name: string;
    slug: string;
    currency: string;
    wallets?: Wallet[];
}