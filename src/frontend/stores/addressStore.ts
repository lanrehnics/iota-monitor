import { writable } from 'svelte/store';
import type { Address } from '../utils/interface';
import { Keys, Networks } from '../utils/enums';
import { fetchAddressBalance } from '../utils/helper';

const { subscribe, set, update } = writable<{ devnet: Address[]; mainnet: Address[] }>({
    devnet: fetchAddressListFromLocalStorage(Keys.Devnet),
    mainnet: fetchAddressListFromLocalStorage(Keys.Mainnet),
});
export const addressStore = {
    subscribe,
    initialize: async () => {
        const devnetAddressInfo = await getBalancesAndMqttSubscribe(Networks.Devnet, Keys.Devnet);
        const mainnetAddressInfo = await getBalancesAndMqttSubscribe(Networks.Mainnet, Keys.Mainnet);
        update((self) => {
            self.devnet = devnetAddressInfo;
            self.mainnet = mainnetAddressInfo;
            return self;
        });
        new Promise<void>(function (resolve) {
            setTimeout(() => resolve(), 1000);
        });
    },
    addAddress: async (network: Networks, newAddress: string) => {
        const newAddressBalancePromise: Promise<number> = fetchAddressBalance(network, newAddress);
        update((self) => {
            self[network] = [...self[network], { address: newAddress, balance: newAddressBalancePromise }];
            window.api.send('subscribe', [network, newAddress]);
            return self;
        });
    },
    removeAddress: (network: Networks, addressToRemove: string) =>
        update((self) => {
            self[network] = self[network].filter(({ address }) => addressToRemove !== address);
            window.api.send('unsubscribe', [network, addressToRemove]);
            return self;
        }),
    refreshBalance: async (network: Networks, addressToRefresh: string) => {
        const refreshedAddressBalancePromise: Promise<number> = fetchAddressBalance(network, addressToRefresh);
        update((self) => {
            self[network] = self[network].map(({ address, balance }) => {
                if (address === addressToRefresh) {
                    balance = refreshedAddressBalancePromise;
                }
                return { address, balance };
            });
            return self;
        });
    },
    set,
    update,
};
function fetchAddressListFromLocalStorage(storageKey: Keys): Address[] {
    const addressList: string[] = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    return addressList.map((address) => ({ address, balance: 0 }));
}
async function getBalancesAndMqttSubscribe(network: Networks, storageKey: Keys): Promise<Address[]> {
    return Promise.all(
        fetchAddressListFromLocalStorage(storageKey).map(async ({ address, balance }: Address) => {
            balance = await fetchAddressBalance(network, address);
            window.api.send('subscribe', [network, address]);
            return {
                address,
                balance,
            };
        }),
    );
}
