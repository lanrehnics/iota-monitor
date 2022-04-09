# Firefly App Developer Technical Task

The task is to develop an application to monitor IOTA addresses for their latest balances
Your code will be written in Svelte and Typescript.

### Task Requirements

• Allow users to enter IOTA addresses;
• Maintain a list of these addresses and their current balance and diplay the list in the UI;
• Use an IOTA node (through ZMQ feed or polling) to continuously check for the addresses' balance;
• You can use any IOTA library but the easiest will be [iota.js](https://github.com/iotaledger/iota.js);
• Allow the user to remove an address from the list;
• Allow the user to search for an address by the address or balance;
• Use git for versioning;
• Choose your own UI design and feel free to use existing component libraries if you want to;
• IOTA [docs](https://docs.iota.org/) will be a helpful resource.

The task should test your Javascript and Typescript experience, ability to pick up new tooling, cleanness of code, your ability to follow instructions, and your attention to detail in the UI.


### Solution

Clone the repo and install the dependencies and run...
```bash
cd iota-monitor
npm i
npm run build
npm run start
```
