import * as bsv from 'bsv';

export class BoostHeaderModel {
    private _blockheader;

    private constructor(blockheader: bsv.BlockHeader) {
        this._blockheader = blockheader;

        if (!this._blockheader.validProofOfWork()) {
            throw new Error('INVALID_POW');
        }
    }

    hash(): string {
        return this._blockheader.hash;
    }

    validProofOfWork(): boolean {
        return this._blockheader.validProofOfWork();
    }

    static fromBuffer (buf) {
        return new BoostHeaderModel(bsv.BlockHeader.fromBuffer(buf));
    }

    static fromString(str) {
        var buf = Buffer.from(str, 'hex')
        return new BoostHeaderModel(bsv.BlockHeader.fromBuffer(buf));
    }

    static fromObject(obj) {
        const spoofedObj = {
            prevHash: obj.content,
            bits: obj.bits,
            version: obj.version,
            merkleRoot: obj.abstract,
            time: obj.time,
            nonce: obj.nonce,
        }
        return new BoostHeaderModel(bsv.BlockHeader.fromObject(spoofedObj));
    }

    toBuffer () {
        return this._blockheader.toBufferWriter().concat()
    }

    toString () {
        return this._blockheader.toBuffer().toString('hex');
    }

    toObject () {

        const blockheaderObj = this._blockheader.toObject();
        const boostheaderObj = {
            hash: blockheaderObj.hash,
            content: blockheaderObj.prevHash,
            bits: blockheaderObj.bits,
            version: blockheaderObj.version,
            abstract: blockheaderObj.merkleRoot,
            time: blockheaderObj.time,
            nonce: blockheaderObj.nonce,
        };
        return boostheaderObj;
    }
}