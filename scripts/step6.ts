import { Address } from 'ton-core';
import Counter from './counter';
import { TonController } from './ton-controller';

// sending transactions to contracts
export class Step6 extends TonController {
    constructor() {
        super();
    }

    async main() {
        await this.getWallet();

        const walletC = this.ton.open(this.wallet);
        const seqno = await walletC.getSeqno();
        console.log(`seqno: ${seqno}`);

        const sender = walletC.sender(this.keyPair.secretKey);

        // contract address comes from the address deployed by step4, this.getAddress()
        const address = Address.parse(this.getAddress());
        const counter = new Counter(address);

        const contract = this.ton.open(counter);
        await contract.sendIncrement(sender);

        await this.awaitTransaction(walletC, seqno);
        console.log('transaction confirmed!');
    }
}

new Step6().main();
