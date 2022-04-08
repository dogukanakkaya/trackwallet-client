import { Wallet as WalletType } from './types';

export const Wallet = ({ wallet }: { wallet: WalletType }) => {
    return (
        <div className='py-2'>
            <h1 className='flex items-center'><span className='text-lg font-semibold mr-5'>{wallet.balance}</span> <span>{wallet.address}</span></h1>
        </div>
    )
}
