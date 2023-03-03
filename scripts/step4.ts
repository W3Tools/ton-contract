import Counter from './counter';
import { TonController } from './ton-controller';

// deploy contract
export class Step4 extends TonController {
    constructor() {
        super();
    }

    async main() {
        await this.getWallet();

        const initialData = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value
        const deployer = await this.getContract<Counter>('contract.cell', initialData);

        const walletC = this.ton.open(this.wallet);
        const seqno = await walletC.getSeqno();
        console.log(`seqno: ${seqno}`);

        console.log('deploy...');
        const sender = walletC.sender(this.keyPair.secretKey);
        const contract = this.ton.open(deployer);
        await contract.sendDeploy(sender);

        await this.awaitTransaction(walletC, seqno);
        console.log('transaction confirmed!');
    }
}

new Step4().main();
