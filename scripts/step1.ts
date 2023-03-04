import { TonController } from './ton-controller';

// read wallet address via mnemonic
export class Step1 extends TonController {
    constructor() {
        super();
    }

    async main() {
        await this.getWallet();
        console.log(`workchain: ${this.wallet.address.workChain}`);
        console.log(this.keyPair.publicKey.toString('hex'));
    }
}

new Step1().main();
