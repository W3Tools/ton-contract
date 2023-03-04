import { Address, Cell, contractAddress, beginCell, ContractProvider, Sender } from 'ton-core';
import BasicContract from './base_contract';

export default class NFT extends BasicContract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {
        super(address, init);
    }

    static createForDeploy(code: Cell, data: Cell): NFT {
        const workchain = 0; // deploy to workchain 0
        const address = contractAddress(workchain, { code, data });
        return new NFT(address, { code, data });
    }

    // step6: send transaction
    async sendIncrement(provider: ContractProvider, sender: Sender) {
        const messageBody = beginCell()
            .storeUint(OperationCodes.incr2, 32) // op (op #1 = increment)
            .storeUint(0, 64) // query id
            .endCell();
        await this.send(provider, sender, { message: messageBody });
    }

    async deploy(contract: ContractProvider, sender: Sender, msgCell: Cell) {
        // Contracts need to be paid on an ongoing basis, otherwise there is a risk of deletion
        await this.send(contract, sender, { message: msgCell });
    }
}

export const OperationCodes = {
    incr: 1,
    incr2: 2,
    incr10: 0x01,
};
