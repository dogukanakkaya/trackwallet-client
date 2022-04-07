import { useState } from 'react'
import { Asset } from './asset';

export const Assets = () => {
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
            <Asset
                asset={{
                    id: 'iota',
                    name: 'IOTA',
                    nativeCurrency: 'IOTA',
                    wallets: [
                        {
                            id: 'iota-wallet-1',
                            address: 'IOTA-ADDRESS-1'
                        },
                        {
                            id: 'iota-wallet-2',
                            address: 'IOTA-ADDRESS-2'
                        }
                    ]
                }}
                activeAccordions={activeAccordions}
                handleAccordionActivation={handleAccordionActivation}
            />
            <Asset
                asset={{
                    id: 'sol',
                    name: 'Solana',
                    nativeCurrency: 'SOL',
                    wallets: [
                        {
                            id: 'sol-wallet-1',
                            address: 'sol-ADDRESS-1'
                        },
                        {
                            id: 'sol-wallet-2',
                            address: 'sol-ADDRESS-2'
                        }
                    ]
                }}
                activeAccordions={activeAccordions}
                handleAccordionActivation={handleAccordionActivation}
            />
        </div>
    )
}
