import { useState } from 'react';
import { json, LoaderFunction, useLoaderData } from 'remix';
import { Asset } from '../../components/assets/asset';
import { firestore } from '../../lib/firebase/firebase.server';
import { Asset as AssetType } from '../../components/assets/types';
import { getDrivers } from '../../lib/chain/driver/driver';
import { Coinmarketcap, Listing } from '../../lib/chain/coinmarketcap.server';
import { withCache } from '../../lib/cache/helper';
import { getUserFromRequest } from '../../lib/auth/user.server';

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUserFromRequest(request);

    const drivers = await getDrivers();

    const coinmarketcap = Coinmarketcap.getInstance();

    const assets = await firestore.collection(`users/${user.uid}/assets`).get();

    const listings = await withCache<Listing[]>('cryptocurrency_listings', () => coinmarketcap.getListings(), { EX: 60 * 60 * 1 });

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
