import { fromNano, internal } from 'ton';
import { TonController } from './ton-controller';

// transfer
export class Step3 extends TonController {
    constructor() {
        super();
    }

    async main() {
        await this.getWallet();

        const walletC = this.ton.open(this.wallet);
        const seqno = await walletC.getSeqno();
        console.log(`seqno: ${seqno}`);

        await walletC.sendTransfer({
            secretKey: this.keyPair.secretKey,
            seqno: seqno,
            messages: [
                internal({
                    to: 'EQDsYZVC7dmrEznSMqG5rcMWDqrOZ6Nd8el423GBTRM3exuI',
                    value: '0.51',
                    body: 'gift',
                    bounce: false,
                }),
            ],
        });

        await this.awaitTransaction(walletC, seqno);
        console.log('transaction confirmed!');
    }
}

new Step3().main();
