<script lang="ts">
    import {isAddressValid} from '../utils/helper';
    import {addressStore} from '../stores/addressStore';
    import {currentNetwork} from '../stores/store';
    import type {Address} from '../utils/interface';
    import Fa from 'svelte-fa/src/fa.svelte'
    import {faAdd, faRefresh} from '@fortawesome/free-solid-svg-icons'

    let address = '';

    function addAddress() {
        if (isAddressValid(address, $currentNetwork)) {
            if ($addressStore[$currentNetwork].find(({bechAddress}: Address) => bechAddress === address)) {
                console.log(`${address} already present`);
            } else {
                addressStore.addAddress($currentNetwork, address);
            }
            address = '';
        }
    }
</script>

<form on:submit|preventDefault={addAddress}>
    <input
            style="width: 80%;"
            spellcheck="false"
            class="form-control me-2" type="text"
            maxlength="64"
            placeholder="Enter a valid iota address to monitor"
            bind:value={address}
    />
    <button class="btn btn-primary" type="submit" disabled={!isAddressValid(address, $currentNetwork)} style='margin-right:10px'>
        <Fa icon={faAdd}/>
    </button>
    <button type="button" class="btn btn-primary" on:click={() => window.api.send('refresh', null)}>
        <Fa icon={faRefresh}/>
    </button>
</form>

<style>
    form {
        display: flex;
        justify-content: center;
        margin-bottom: 0.5em;
    }

    input {
        backdrop-filter: blur(10px);
        border-radius: 5px;
        background: #e0e0e0;
        box-shadow: inset 5px 5px 10px #b5b5b5,
        inset -5px -5px 10px #ffffff;
    }

</style>
