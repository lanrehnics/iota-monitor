<script lang="ts">
    import {currentUnit} from '../stores/store';
    import {unitFormatter} from '../utils/helper';
    import Fa from 'svelte-fa/src/fa.svelte'
    import {faRemove, faStroopwafel} from '@fortawesome/free-solid-svg-icons'
    import {deleteAddress} from '../stores/eventsStore';

    export let address;
    export let balance: number | Promise<number>;

    function handleDeleteAddress() {
        deleteAddress.update(add => address);
    }
</script>

<li>
    {#await balance}
        <p>{address}</p>
        <Fa icon={faStroopwafel} size="lg" spin />
    {:then balanceValue}
        <p>{address}</p>
        <span>
            {unitFormatter(balanceValue, $currentUnit)}
            {$currentUnit}
        </span>
    {:catch error}
        <p>{address}</p>
        <span>{error.message}</span>
    {/await}
    <button type="button" class="btn btn-outline-secondary" on:click={() =>handleDeleteAddress()}>
        <Fa icon={faRemove} size="lg" color="red"/>
    </button>
</li>

<style>
    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1em 5rem;
        font-size: 0.875rem;
        margin: 1em 0;
        border-radius: 5px;
        background: #e0e0e0;
    }

    p {
        display: inline;
    }

    span {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 1em;
        min-width: 13em;
    }

    button {
        font-size: 1em;
        cursor: pointer;
        border: none;
        background-color: transparent;
        text-decoration: underline;
        min-width: 2.5em;
    }
</style>
