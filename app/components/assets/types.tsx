export interface Wallet {
    id: string;
    address: string;
}

export interface Asset {
    id: string;
    name: string;
    nativeCurrency: string;
    wallets: Wallet[];
}