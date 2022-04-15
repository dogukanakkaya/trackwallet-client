export interface Wallet {
    id: string;
    address: string;
    balance: Record<string, number>;
}

export interface Asset {
    id: string;
    wallets: Wallet[];
    name: string;
    slug: string;
    currency: string;
    createdAt: Date;
}