import Counter from './counter';
import { Address } from 'ton-core';
import { TonController } from './ton-controller';

// calling the read only method of a contract
export class Step5 extends TonController {
    constructor() {
        super();
    }

    async main() {
        // contract address comes from the address deployed by step4, this.getAddress()
        const address = Address.parse(this.getAddress());
        const counter = new Counter(address);

        const contract = this.ton.open(counter);
        const result = await contract.get('counters');
        console.log(`result: ${result.readBigNumber()}`);

        const result_one = await contract.get('counter_one');
        console.log(`result: ${result_one.readBigNumber()}`);
    }
}

new Step5().main();
