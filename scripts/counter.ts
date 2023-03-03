import { Address, Cell, contractAddress, beginCell, ContractProvider, Sender } from 'ton-core';
import BasicContract from './base_contract';

export default class Counter extends BasicContract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {
        super(address, init);
    }

    static createForDeploy(code: Cell, initialCounterValue: any): Counter {
        const data = beginCell().storeUint(initialCounterValue, 64).endCell();
        const workchain = 0; // deploy to workchain 0
        const address = contractAddress(workchain, { code, data });
        return new Counter(address, { code, data });
    }

    // step6: send transaction
    async sendIncrement(provider: ContractProvider, sender: Sender) {
        const messageBody = beginCell()
            .storeUint(1, 32) // op (op #1 = increment)
            .storeUint(0, 64) // query id
            .endCell();
        await this.send(provider, sender, { message: messageBody });
    }
}
