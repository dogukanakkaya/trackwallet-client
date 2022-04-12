import { useState } from 'react';
import { json, LoaderFunction, redirect, useLoaderData } from 'remix';
import { Asset } from '../../components/assets/asset';
import { firestore } from '../../lib/firebase/firebase.server';
import { Asset as AssetType } from '../../components/assets/types';
import { getDrivers } from '../../lib/chain/driver/driver';
import { getUserFromRequest } from '../../lib/auth/user.server';
import { api, SuccessResponse } from '../../lib/axios';

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUserFromRequest(request);

    if (!user) {
        return redirect("/");
    }

    const drivers = await getDrivers();

    const assets = await firestore.collection(`users/${user.uid}/assets`).get();

    const { data: { data: listings } } = await api.get<SuccessResponse<Listing[]>>('/market/listings', {
        headers: {
            'Cookie': request.headers.get('Cookie') || '',
        }
    });

    let totalBalance: Record<string, number> = {
        USD: 0
    };

    const mappedAssets = assets.docs.map(async assetDoc => {
        const asset = assetDoc.data();

        const wallets = await assetDoc.ref.collection('wallets').get();

        const mappedWallets = await Promise.all(
            wallets.docs.map(async walletDoc => {
                const wallet = walletDoc.data();

                let balance: Record<string, number> = {
                    // start each request in parallel for more perf
                    [asset.currency]: await drivers[asset.currency]?.getBalance(wallet.address) || 0
                };
                balance.USD = balance[asset.currency] * (listings.find(listing => listing.symbol === asset.currency)?.quote?.USD.price || 0)
                totalBalance.USD += balance.USD;

                return {
                    id: walletDoc.id,
                    ...wallet,
                    balance
                }
            })
        );

        return {
            id: assetDoc.id,
            ...asset,
            wallets: mappedWallets
        };
    });

    return json({
        assets: await Promise.all(mappedAssets),
        totalBalance
    });
}

export default function Assets() {
    const { assets, totalBalance } = useLoaderData();

    const [passiveAccordions, setPassiveAccordions] = useState<string[]>([]);

    const handleAccordionActivation = (id: string) => {
        if (passiveAccordions.includes(id)) {
            setPassiveAccordions(passiveAccordions.filter(accordionId => accordionId !== id));
        } else {
            setPassiveAccordions([...passiveAccordions, id]);
        }
    }

    return (
        <>
            <h1 className='text-2xl font-semibold mb-5'>Assets (${totalBalance.USD.toFixed(2)})</h1>
            <div>
                {
                    assets.map((asset: AssetType) => {
                        return (
                            <Asset
                                key={asset.id}
                                asset={asset}
                                passiveAccordions={passiveAccordions}
                                handleAccordionActivation={handleAccordionActivation}
                            />
                        )
                    })
                }
            </div>
        </>
    )
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