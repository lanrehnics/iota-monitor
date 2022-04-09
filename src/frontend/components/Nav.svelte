<script lang="ts">
    import logo from '../logo.svg';
    import Fa from 'svelte-fa/src/fa.svelte'
    import {faSearch, faCancel} from '@fortawesome/free-solid-svg-icons'
    import {searchAddress} from '../stores/eventsStore';
    import {currentNetwork, currentUnit} from "../stores/store";
    import {Networks} from "../utils/enums";
    import {Units} from "@iota/iota.js";


    let searchString = '';
    let searchIsEmpty = true;
    let selectedNetwork = Networks.Mainnet;

    const units: Units[] = ['i', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi'];

    let selectedUnit = $currentUnit ?? units[0];

    function performSearch() {
        if (searchString !== '') {
            searchAddress.update(address => searchString);
            searchIsEmpty = searchString === '';
        }
    }

    function clearSearch() {
        searchString = '';
        searchAddress.update(address => searchString);
        searchIsEmpty = searchString === '';
    }

</script>

<nav class="navbar navbar-expand-sm navbar-dark bg-dark">
    <div class="d-flex container-fluid ">

        <div class="d-flex justify-content-center">
            <img height="30" src={logo} class="filter-white center" alt="logo">
            <div style='margin-right:10px; margin-left:10px '>
                <select bind:value={selectedNetwork} on:change="{() => $currentNetwork = selectedNetwork}"
                        class="form-select form-select-md" aria-label=".form-select-sm">
                    <option value={Networks.Mainnet}>Mainnet</option>
                    <option value={Networks.Mainnet}>Devnet</option>
                </select>

            </div>
            <div>

                <select bind:value={selectedUnit} on:change="{()=> $currentUnit = selectedUnit}"
                        class="form-select form-select-md" aria-label=".form-select-sm">
                    {#each units as value}
                        <option {value}>Unit - {value}</option>
                    {/each}
                </select>

            </div>
        </div>

        <form class="d-flex">
            <input class="form-control me-2" type="text" placeholder="Search for address or balance" maxlength="64"
                   bind:value={searchString} style="width: 400px;">
            {#if searchIsEmpty}
                <button class="btn btn-primary" type="button" on:click={() => performSearch()}>
                    <Fa icon={faSearch}/>
                </button>
            {:else}
                <button class="btn btn-primary" type="button" on:click={() => clearSearch()}>
                    <Fa icon={faCancel}/>
                </button>
            {/if}
        </form>
    </div>
</nav>

<style>

    .filter-white {
        filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(305deg) brightness(105%) contrast(100%);
    }

    input {
        backdrop-filter: blur(10px);
        border-radius: 5px;
        background: #e0e0e0;
        box-shadow: inset 5px 5px 10px #b5b5b5,
        inset -5px -5px 10px #ffffff;
    }

    .center {
        display: block;
        margin-top: auto;
        margin-bottom: auto;
    }
</style>