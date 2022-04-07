import React from 'react'
import { Asset as AssetType } from './types';

export const Asset = ({ asset, activeAccordions, handleAccordionActivation }: Props) => {
    return (
        <div className='mb-3 transition-colors hover:bg-zinc-900'>
            <div
                className='px-4 py-2 mb-2 flex justify-between items-center shadow rounded border transition duration-300 ease-in-out cursor-pointer border-gray-800'
                onClick={() => handleAccordionActivation(asset.id)}
            >
                <span>{asset.name}</span> <span><i className='bi bi-chevron-down'></i></span>
            </div>
            <div className={`flex flex-col justify-center overflow-hidden transition-[max-height] ease-in-out duration-300 ${!activeAccordions.includes(asset.id) ? 'max-h-0' : 'max-h-80'}`}>
                <div className='m-4'>
                    {
                        asset.wallets.map(wallet => <>{wallet.id}</>)
                    }
                </div>
            </div>
        </div>
    )
}

interface Props {
    asset: AssetType;
    activeAccordions: string[];
    handleAccordionActivation: (id: string) => void;
}