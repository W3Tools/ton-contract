import { TonController } from './ton-controller';
import { Cell, Builder } from 'ton-core';
import NFT from './nft';

export class DeployNFT extends TonController {
    constructor() {
        super();
    }

    stringToCell(str: string) {
        let cell = new Builder();
        cell.storeBuffer(Buffer.from(str));
        return cell.endCell();
    }

    buildDataCell(name: string, symbol: string, content: string): Cell {
        const dataCell = new Builder();
        dataCell.storeUint(1, 32);
        dataCell.storeRef(this.stringToCell(name)); // name
        dataCell.storeRef(this.stringToCell(symbol)); // symbol
        dataCell.storeAddress(this.wallet.address); // creator
        dataCell.storeAddress(this.wallet.address); // owner
        dataCell.storeRef(this.stringToCell(content)); // content
        dataCell.storeUint(0, 32); // seq

        return dataCell.endCell();
    }

    async main() {
        await this.getWallet();
        const dtime = Date.now();
        let dataCell = this.buildDataCell(`W3Tools NFT #${dtime}`, 'W3NFT', 'https://file-8sgle4kt.w3tools.app/ton/nft.json');
        const deployer = await this.getContract<NFT>('nft.cell', dataCell);

        // wallet to contract
        const walletC = this.ton.open(this.wallet);
        const seqno = await walletC.getSeqno();
        console.log(`seqno: ${seqno}`);

        const sender = walletC.sender(this.keyPair.secretKey);
        const contract = this.ton.open(deployer);
        let msgCell = new Builder();
        msgCell.storeUint(0, 1);
        await contract.sendDeploy(sender, dataCell);

        await this.awaitTransaction(walletC, seqno);
        console.log('transaction confirmed!');
    }
}

new DeployNFT().main();
