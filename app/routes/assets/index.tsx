import { useState } from 'react';
import { json, LoaderFunction, useLoaderData } from 'remix';
import { Asset } from '../../components/assets/asset';
import { firestore } from '../../lib/firebase/firebase.server';
import { Asset as AssetType } from '../../components/assets/types';
import { getDrivers } from '../../lib/chain/driver/driver';
import { Coinmarketcap, Listing } from '../../lib/chain/coinmarketcap.server';
import { withCache } from '../../lib/cache/helper';

export const loader: LoaderFunction = async () => {
    const drivers = await getDrivers();

    const coinmarketcap = Coinmarketcap.getInstance();

    const assets = await firestore.collection('assets').get();

    const listings = await withCache<Listing[]>('cryptocurrency_listings', () => coinmarketcap.getListings(), { EX: 60 * 60 * 1 });

    const mappedAssets = assets.docs.map(async assetDoc => {
        const asset = assetDoc.data();

        const wallets = await assetDoc.ref.collection('wallets').get();

        const mappedWallets = await Promise.all(
            wallets.docs.map(async walletDoc => {
                const wallet = walletDoc.data();

                let balance: Record<string, number> = {};

                if (asset.nativeCurrency in drivers) {
                    balance[asset.nativeCurrency] = await drivers[asset.nativeCurrency].getBalance(wallet.address);
                }

                balance.USD = balance[asset.nativeCurrency] * (listings.find(listing => listing.symbol === asset.nativeCurrency)?.quote?.USD.price || 0);

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
        assets: await Promise.all(mappedAssets)
    });
}

export default function Assets() {
    const { assets } = useLoaderData();

    const [passiveAccordions, setPassiveAccordions] = useState<string[]>([]);

    const handleAccordionActivation = (id: string) => {
        if (passiveAccordions.includes(id)) {
            setPassiveAccordions(passiveAccordions.filter(accordionId => accordionId !== id));
        } else {
            setPassiveAccordions([...passiveAccordions, id]);
        }
    }

    return (
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
    )
}
