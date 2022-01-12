const fs = require('fs');
const { Conflux, Drip, format } = require('js-conflux-sdk');

const ENDPOINT = 'http://47.104.89.179:12537';
const NETWORK_ID = 1030;
const CROSS_SPACE_ADDRESS = '0x0888000000000000000000000000000000000006';

// sender (Conflux space) private key
const PRIVKEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

// receiver (EVM space)
const RECEIVER = '0x04bb7da5702b6992d072bc327763c9751ec5567c';

// transfer amount denominated in CFX
const TRANSFER_AMOUNT_CFX = 1;

async function main() {
    const conflux = new Conflux({ url: ENDPOINT, networkId: NETWORK_ID });
    const sender = conflux.wallet.addPrivateKey(PRIVKEY);

    const abi = JSON.parse(fs.readFileSync('./abi/CrossSpaceCall.json'));
    const address = format.address(CROSS_SPACE_ADDRESS, NETWORK_ID);
    const contract = conflux.Contract({ abi, address });

    console.log(`Transferring ${TRANSFER_AMOUNT_CFX} CFX from ${sender.address} to ${RECEIVER}...`);

    const tx = contract
        .transferEVM(RECEIVER)
        .sendTransaction({ from: sender, value: Drip.fromCFX(TRANSFER_AMOUNT_CFX) })

    const hash = await tx;
    console.log(hash);

    await tx.executed();
    console.log('Done.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

