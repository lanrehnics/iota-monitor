<!--suppress CssUnknownTarget -->
<script lang="ts">
    import {onMount} from 'svelte';
    import Fa from 'svelte-fa/src/fa.svelte'
    import {faStroopwafel} from '@fortawesome/free-solid-svg-icons'
    import AddressList from './components/AddressList.svelte';
    import AddressAdder from './components/AddressAdder.svelte';
    import {addressStore} from './stores/addressStore';
    import { currentUnit, currentNetwork} from './stores/store';
    import {Keys, Networks} from './utils/enums';
    import type {Address} from './utils/interface';
    import bg from './bg.svg';
    import Nav from "./components/Nav.svelte";

    let promise: Promise<void>;

    onMount(async () => {
        promise = addressStore.initialize();
        window.api.receive('activityOnAddress', ({network, bechAddress}) =>
            addressStore.refreshBalance(network, bechAddress),
        );
    });

    $: window.localStorage.setItem(Keys.Unit, JSON.stringify($currentUnit));
    $: window.localStorage.setItem(Keys.Network, JSON.stringify($currentNetwork)) ;
    $: saveBechAddresses($addressStore[Networks.Devnet], Keys.Devnet);
    $: saveBechAddresses($addressStore[Networks.Mainnet], Keys.Mainnet);

    function saveBechAddresses(addresses: Address[], storageKey: Keys) {
        const addressList: string[] = addresses.map((address: Address) => address.address);
        window.localStorage.setItem(storageKey, JSON.stringify(addressList));
    }
</script>

<div class="container justify-content-center d-flex">

    <div class="two container2 mt-5 justify-content-center d-flex">
        <img src={bg} alt="Powered By IOTA logo"/>
    </div>
    <div class="container card border-0 d-flex mt-5 one">
        <header>
            <Nav/>

        </header>
        {#await promise}
            <Fa icon={faStroopwafel} size="3x" spin/>
        {:then _}
            <AddressAdder/>
            <AddressList/>
        {:catch error}
            <h1>{error.message}</h1>
        {/await}
    </div>


</div>


<style>
    header {
        height: 200px;
        width: 100%;
    }

    .container {
        max-width: 1000px;
        min-width: 800px;
        width: 1060px;
        height: 800px;
    }

    .container2 {
        max-width: 800px;
        min-width: 300px;
        width: 800px;
    }

    .one {
        position: absolute;
        z-index: 2;
        background: rgba(255, 255, 255, 0.192);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        border: 1px solid rgba(43, 43, 43, 0.568);
    }

    .two {
        position: absolute;
        z-index: 1;
    }

    .card {
        background-color: transparent;
    }
</style>
