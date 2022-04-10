import { Wallet as WalletType, Asset as AssetType } from './types';

export const Wallet = ({ asset, wallet }: { asset: AssetType, wallet: WalletType }) => {
    return (
        <div className='py-2'>
            <h1 className='flex items-center'>
                <span className='text-lg font-semibold mr-5'>{wallet.balance[asset.nativeCurrency].toFixed(2)} (${wallet.balance.USD.toFixed(2)})</span>
                <span>{wallet.address}</span>
            </h1>
        </div>
    )
}
