import {Bech32Helper, SingleNodeClient, UnitsHelper} from '@iota/iota.js';
import {Networks, Nodes} from './enums';
import type {Units} from '@iota/iota.js';

const client = {
    devnet: new SingleNodeClient(Networks.Devnet),
    mainnet: new SingleNodeClient(Nodes.Mainnet),
};

export function unitFormatter(balance: number, unit: Units) {
    const formattedString = UnitsHelper.formatUnits(balance, unit, 2);
    const [formattedNumber, unitSuffix] = formattedString.split(' ');
    return formattedNumber;
}

export function isAddressValid(addressBech32: string, network: Networks): boolean {
    try {
        const humanReadablePart = network === Networks.Devnet ? Bech32Helper.BECH32_DEFAULT_HRP_DEV : Bech32Helper.BECH32_DEFAULT_HRP_MAIN;
        return !!Bech32Helper.fromBech32(addressBech32, humanReadablePart);
    } catch (e) {
        return false;
    }
}

export async function fetchAddressBalance(network: Networks, addressBech32: string): Promise<number> {
    const addressInfo = await client[network].address(addressBech32);
    return addressInfo.balance;
}
