import * as fs from 'fs';
import { Cell, OpenedContract, WalletContractV3R2 } from 'ton';
import { KeyPair, mnemonicToWalletKey } from 'ton-crypto';
import { TonClient, TonClientParameters } from 'ton/dist/client/TonClient';

import dotenv from 'dotenv';
import BasicContract from './base_contract';
dotenv.config({ path: '.env' });

export class TonController {
    ton: TonClient;
    keyPair!: KeyPair;
    wallet!: WalletContractV3R2;
    scanUri: string;

    constructor() {
        this.ton = this.getClient();
        this.scanUri = this.getTonScanUri();
    }

    getAddress() {
        const envAddress = process.env.CONTRACT;
        if (!envAddress) throw Error('Please Provide Contract Address');
        return envAddress;
    }

    getTonScanUri() {
        let uri = 'https://testnet.tonscan.org/address/';
        if (!uri.endsWith('/')) uri = `${uri}/`;
        return uri;
    }

    sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    getClient() {
        let apiKey = process.env.API_KEY;
        if (!apiKey) throw Error('Please Provide API Key For RPC');
        let param: TonClientParameters = {
            endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
            apiKey: apiKey,
        };
        return new TonClient(param);
    }

    async awaitTransaction(contract: OpenedContract<WalletContractV3R2>, seqno: number) {
        console.log('waiting for deploy transaction to confirm...');
        let currentSeqno = seqno;
        while (currentSeqno == seqno) {
            await this.sleep(1500);
            currentSeqno = await contract.getSeqno();
        }
    }

    async getWallet() {
        const mnemonic = process.env.MNEMONIC;
        if (!mnemonic || mnemonic == undefined) throw Error('Please Provide Mnemonic');
        this.keyPair = await mnemonicToWalletKey(mnemonic.split(' '));
        this.wallet = WalletContractV3R2.create({ publicKey: this.keyPair.publicKey, workchain: 0 });
        console.log(`wallet address: ${this.scanUri}${this.wallet.address.toString()}`);
        const isDeployed = await this.ton.isContractDeployed(this.wallet.address);
        if (!isDeployed) {
            throw Error('Wallet Address Not Found!');
        }
    }

    async getContract<T extends BasicContract>(cellName: string, initialData: any): Promise<T> {
        const code = Cell.fromBoc(fs.readFileSync(`output/${cellName}`))[0]; // compilation output from step 6
        const contract = BasicContract.createForDeploy(code, initialData) as T;
        console.log(`contract address: ${this.scanUri}${contract.address.toString()}`);
        const isDeployed = await this.ton.isContractDeployed(contract.address);
        if (isDeployed) throw Error('Contract Already Deployed');
        return contract;
    }
}
