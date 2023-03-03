import { fromNano } from 'ton';
import { TonController } from './ton-controller';

// get wallet information on chain
export class Step2 extends TonController {
    constructor() {
        super();
    }

    async main() {
        await this.getWallet();

        const balance = await this.ton.getBalance(this.wallet.address);
        console.log(`balance: ${fromNano(balance)}`);

        const contract = this.ton.open(this.wallet);
        const seqno = await contract.getSeqno();
        console.log(`seqno: ${seqno}`);
    }
}

new Step2().main();
