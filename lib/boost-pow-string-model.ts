import * as bsv from 'bsv';

export class BoostPowStringModel {
    private _blockheader;

    constructor(blockheader: bsv.BlockHeader) {
        this._blockheader = blockheader;

        if (!this._blockheader.validProofOfWork()) {
            throw new Error('INVALID_POW');
        }
    }
    // Use boosthash(), hash() and id() to all be equal to the string
    // remember, the string itself is the data and proof of work identity.
    boosthash(): string {
        return this._blockheader.hash;
    }

    hash(): string {
        return this._blockheader.hash;
    }

    id(): string {
        return this._blockheader.hash;
    }

    contentHex(): string {
        return this.toObject().content;
    }

    contentBuffer(): string {
        return this.toObject().content;
    }

    private trimBufferString(str: string, trimLeadingNulls = true): string {
        const content = Buffer.from(str, 'hex').toString('utf8');
        if (trimLeadingNulls) {
            return content.replace(/\0/g, '');
        } else {
            return content;
        }
    }

    contentString(trimLeadingNulls = true): string {
        return this.trimBufferString(this.toObject().content, trimLeadingNulls);
    }

    bits(): number {
        return this.toObject().bits;
    }

    metadataHash(): string {
        return this.toObject().metadataHash;
    }

    nonce(): number {
        return this.toObject().nonce;
    }

    time(): number {
        return this.toObject().time;
    }

    category(): number {
        return this.toObject().category;
    }

    static validProofOfWorkFromBuffer(buf): boolean {
        const blockheader = bsv.BlockHeader.fromBuffer(buf);

        if (blockheader.validProofOfWork()) {
            return true;
        }
        return false;
    }

    static validProofOfWorkFromString(str): boolean {
        const blockheader = bsv.BlockHeader.fromString(str);

        if (blockheader.validProofOfWork()) {
            return true;
        }
        return false;
    }

    static validProofOfWorkFromObject(obj): boolean {
        const spoofedObj = {
            prevHash: obj.content,
            bits: obj.bits,
            version: obj.category,
            merkleRoot: obj.metadataHash,
            time: obj.time,
            nonce: obj.nonce,
        }
        const blockheader = bsv.BlockHeader.fromObject(spoofedObj);

        if (blockheader.validProofOfWork()) {
            return true;
        }
        return false;
    }

    static fromBuffer (buf) {
        return new BoostPowStringModel(bsv.BlockHeader.fromBuffer(buf));
    }

    static fromString(str) {
        var buf = Buffer.from(str, 'hex')
        return new BoostPowStringModel(bsv.BlockHeader.fromBuffer(buf));
    }

    static fromHex(str) {
        var buf = Buffer.from(str, 'hex')
        return new BoostPowStringModel(bsv.BlockHeader.fromBuffer(buf));
    }

    static fromObject(obj) {
        const spoofedObj = {
            prevHash: obj.content,
            bits: obj.bits,
            version: obj.category,
            merkleRoot: obj.metadataHash,
            time: obj.time,
            nonce: obj.nonce,
        }
        return new BoostPowStringModel(bsv.BlockHeader.fromObject(spoofedObj));
    }

    toBuffer () {
        return this._blockheader.toBufferWriter().concat()
    }

    toString () {
        return this._blockheader.toBuffer().toString('hex');
    }

    toHex () {
        return this._blockheader.toBuffer().toString('hex');
    }

    toObject () {

        const blockheaderObj = this._blockheader.toObject();
        const boostheaderObj = {
            hash: blockheaderObj.hash,
            content: blockheaderObj.prevHash,
            bits: blockheaderObj.bits,
            difficulty: this.difficulty(),
            category: blockheaderObj.version,
            metadataHash: blockheaderObj.merkleRoot,
            time: blockheaderObj.time,
            nonce: blockheaderObj.nonce,
        };
        return boostheaderObj;
    }

    difficulty() : number {
        return this._blockheader.getDifficulty();
    }
    targetDifficulty(bits?: number) {
        return this._blockheader.getTargetDifficulty(bits);
    }

}