import { Contract, Address, Cell, contractAddress, beginCell, ContractProvider, Sender, TupleReader, SendMode } from 'ton-core';

export default class BasicContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    // static createForDeploy(code: Cell, initialCounterValue: any): BasicContract {
    //     // const data = beginCell().storeUint(initialCounterValue, 64).endCell();
    //     const workchain = 0; // deploy to workchain 0
    //     const address = contractAddress(workchain, { code, data });
    //     return new BasicContract(address, { code, data });
    // }
    static createForDeploy(code: Cell, data: Cell): BasicContract {
        const workchain = 0; // deploy to workchain 0
        //     let contractSource: ContractSource = {
        //     initialCode: sourceCell,
        //     initialData: dataCell,
        //     workchain: 0,
        //     type: '',
        //     backup: () => '',
        //     describe: () => 'nft'
        // }
        const address = contractAddress(workchain, { code: code, data: data });
        return new BasicContract(address, { code, data });
    }

    async sendDeploy(contract: ContractProvider, sender: Sender, msgCell?: Cell) {
        // Contracts need to be paid on an ongoing basis, otherwise there is a risk of deletion
        let args: SendArgs = {
            message: new Cell(),
        };
        if (msgCell) args['message'] = msgCell;
        await this.send(contract, sender, args);
    }

    // send transaction
    async send(contract: ContractProvider, sender: Sender, sendArgs: SendArgs) {
        let args: any = {
            value: '0.01', // gas price?
        };

        if (sendArgs.bounce) args['bounce'] = sendArgs.bounce;
        if (sendArgs.message) args['body'] = sendArgs.message;

        await contract.internal(sender, args);
        // await contract.external(sendArgs.message);
    }

    // calling read only methods
    async get(contract: ContractProvider, methodId: string, args?: any[]): Promise<TupleReader> {
        if (!args) args = [];

        const result = await contract.get(methodId, args);
        return result.stack;
    }
}

interface SendArgs {
    bounce?: boolean;
    message: Cell;
}
