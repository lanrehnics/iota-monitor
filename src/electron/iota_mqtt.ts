import { MqttClient } from '@iota/mqtt.js';

const subscriptions = {
    mainnet: new Map<string, string>(),
    devnet: new Map<string, string>(),
};

const mqttClients = {
    mainnet: new MqttClient('https://chrysalis-nodes.iota.org/'),
    devnet: new MqttClient('https://api.lb-1.h.chrysalis-devnet.iota.cafe/'),
};

export function mSubscribe(
    network: 'mainnet' | 'devnet',
    bechAddress: string,
    callback: (topic: any, data: any) => void,
) {
    if (subscriptions[network].has(bechAddress)) return;
    const subscriptionId = mqttClients[network].addressOutputs(bechAddress, callback);
    subscriptions[network].set(bechAddress, subscriptionId);
}

export function mUnSubscribe(network: 'mainnet' | 'devnet', bechAddress: string) {
    const subscriptionId = subscriptions[network].get(bechAddress);
    if (!subscriptionId) return;
    mqttClients[network].unsubscribe(subscriptionId);
}

export function mUnSubscribeAll() {
    for (const subscriptionId of subscriptions.mainnet.values()) {
        mqttClients.mainnet.unsubscribe(subscriptionId);
    }
    for (const subscriptionId of subscriptions.devnet.values()) {
        mqttClients.devnet.unsubscribe(subscriptionId);
    }
}
