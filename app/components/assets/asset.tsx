import { Asset as AssetType } from './types';
import { Wallet } from './wallet';

export const Asset = ({ asset, passiveAccordions, handleAccordionActivation }: Props) => {
    return (
        <div className='mb-3 transition-colors hover:bg-zinc-900'>
            <div
                className='px-4 py-2 mb-2 flex justify-between items-center shadow rounded border transition duration-300 ease-in-out cursor-pointer border-gray-800'
                onClick={() => handleAccordionActivation(asset.id)}
            >
                <span>{asset.name} {asset.name !== asset.nativeCurrency ? `(${asset.nativeCurrency})` : null}</span> <span><i className='bi bi-chevron-down'></i></span>
            </div>
            <div className={`flex flex-col justify-center overflow-hidden shadow-lg transition-[max-height] ease-in-out duration-300 ${passiveAccordions.includes(asset.id) ? 'max-h-0' : 'max-h-80'}`}>
                <div className='m-4'>
                    {
                        asset.wallets ? asset.wallets.map(wallet => <Wallet key={wallet.id} asset={asset} wallet={wallet} />) : null
                    }
                </div>
            </div>
        </div>
    )
}

interface Props {
    asset: AssetType;
    passiveAccordions: string[];
    handleAccordionActivation: (id: string) => void;
}