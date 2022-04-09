import {writable} from "svelte/store";
import {Keys} from "../utils/enums";
import type {Units} from "@iota/iota.js";
import type {Networks} from "../utils/enums";


export const currentNetwork = writable<Networks>(
    JSON.parse(window.localStorage.getItem(Keys.Network) ? window.localStorage.getItem(Keys.Network) : '"mainnet"')
);

export const currentUnit = writable<Units>(JSON.parse(window.localStorage.getItem(Keys.Unit) || '"i"'));
