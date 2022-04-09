<script lang="ts">
    import AddressItem from './AddressItem.svelte';
    import {addressStore} from '../stores/addressStore';
    import {deleteAddress, searchAddress} from '../stores/eventsStore';
    import {currentNetwork} from '../stores/store';
    import type {Address} from '../utils/interface';

    let search = '';

    $: addressList = $addressStore[$currentNetwork];

    $: filteredAddressList = search ? addressList.filter(({address, balance}: Address) => {
            return address.includes(search) || balance.toString().includes(search);
        })
        : addressList;

    searchAddress.subscribe(address => {
        search = address;
    });

    deleteAddress.subscribe(address => {
        addressStore.removeAddress($currentNetwork, address);
    })

</script>

<div>
    <ul>
        {#each filteredAddressList as eachAddressInfo (eachAddressInfo.address)}
            <AddressItem {...eachAddressInfo}/>
        {/each}
    </ul>
</div>
