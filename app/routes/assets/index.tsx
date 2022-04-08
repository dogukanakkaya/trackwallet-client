import { useState } from 'react';
import { json, LoaderFunction, useLoaderData } from 'remix';
import { Asset } from '../../components/assets/asset';
import { firestore } from '../../lib/firebase/firebase.server';
import { Asset as AssetType } from '../../components/assets/types';
import { drivers } from '../../lib/chain/driver/driver';

export const loader: LoaderFunction = async ({ request }) => {
    const assets = await firestore.collection('assets').get();

    const mappedAssets = assets.docs.map(async assetDoc => {
        const asset = assetDoc.data();

        const wallets = await assetDoc.ref.collection('wallets').get();

        const mappedWallets = await Promise.all(
            wallets.docs.map(async walletDoc => {
                const wallet = walletDoc.data();

                let balance = 0;

                if (asset.nativeCurrency in drivers) {
                    balance = await drivers[asset.nativeCurrency].getBalance(wallet.address);
                }

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

    const [activeAccordions, setActiveAccordions] = useState<string[]>([]);

    const handleAccordionActivation = (id: string) => {
        if (activeAccordions.includes(id)) {
            setActiveAccordions(activeAccordions.filter(accordionId => accordionId !== id));
        } else {
            setActiveAccordions([...activeAccordions, id]);
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
                            activeAccordions={activeAccordions}
                            handleAccordionActivation={handleAccordionActivation}
                        />
                    )
                })
            }
        </div>
    )
}
