import { useState } from 'react';
import { json, LoaderFunction, useLoaderData } from 'remix';
import { Asset } from '../../components/assets/asset';
import { firestore } from '../../lib/firebase/firebase.server';
import { Asset as AssetType } from '../../components/assets/types';

export const loader: LoaderFunction = async ({ request }) => {
    const assets = await firestore.collection('assets').get();

    const mappedAssets = assets.docs.map(async asset => {
        const wallets = await asset.ref.collection('wallets').get();

        return {
            id: asset.id,
            ...asset.data(),
            wallets: wallets.docs.map(wallet => ({ id: wallet.id, ...wallet.data() }))
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
