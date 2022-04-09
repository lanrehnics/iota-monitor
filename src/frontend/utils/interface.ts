import type {Networks} from "./enums";

declare global {
    interface Window {
        api: {
            send: (channel: string, [network, address]: [Networks, string]) => void;
            receive: (channel: string, func: (arg0: any) => void) => void;
        };
    }
}

export interface Address {
    address: string;
    balance: Promise<number> | number;
}
