import * as bsv from 'bsv';
import { Int32Little } from './fields/int32Little';
import { UInt32Little } from './fields/uint32Little';
import { BoostPowJobModel } from './boost-pow-job-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
import { BoostUtils } from './boost-utils';

export class BoostPowStringModel {
    private _blockheader;
    private _metadata;
    
    constructor(blockheader: bsv.BlockHeader, metadata?: BoostPowMetadataModel) {
        this._blockheader = blockheader;
        if (!this._blockheader.validProofOfWork()) {
            throw new Error('INVALID_POW');
        }

        if (metadata) {
            if (!this._blockheader.merkleRoot !== metadata.hash()) {
                throw new Error('INVALID_METADATA');
            }
            this._metadata = metadata;
        }
    }

    // Use boosthash(), hash() and id() to all be equal to the string
    // remember, the string itself is the data and proof of work identity.
    boosthash(): string {
        return this._blockheader.hash;
    }

    hashBuffer() : Buffer {
        // todo: IS THIS THE RIGHT PLACE???
        return Buffer.from(this._blockheader.hash,"hex").reverse();
    }

    hash(): string {
        return this._blockheader.hash;
    }

    id(): string {
        return this._blockheader.hash;
    }

    category(): Int32Little {
      return Int32Little.fromNumber(this._blockheader.version);
    }

    contentHex(): string {
        return this.toObject().content;
    }

    contentBuffer(): Buffer {
        return new Buffer(this.toObject().content,'hex').reverse();
    }

    contentString(trimLeadingNulls = true): string {
        var content = new Buffer(this._blockheader.toObject().prevHash, 'hex');
        return BoostUtils.trimBufferString(content.reverse(), trimLeadingNulls);
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

    static nBitsHexToDifficultyNumber(nbits: string): number {
        return BoostUtils.getTargetDifficulty(parseInt(nbits, 16));
    }

    getTargetAsNumberBuffer(): any {
        const i = BoostUtils.difficulty2bits(this.difficulty());
        return Buffer.from(i.toString(16), 'hex').reverse();
    }

    static difficultyNumberToNBitsHex(diff: number): string {
        const bitsInt32 = BoostUtils.difficulty2bits(diff);
        return bitsInt32.toString(16);
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
    /**
     * Check whether each element is a valid BoostPowString (POW!)
     *
     * If even a single entry is not valid, then an exception will be thrown and parsing of everything fails.
     *
     * Initially we can be strict because we should expect careful usage and passing of data.
     *
     * @param arrayOfPotentialBoostPowStrings Array of objects that have toString() defined
     */
    static fromStringArray(arrayOfPotentialBoostPowStrings: any[]): Array<BoostPowStringModel> {
        // How cool is that!?
        const boostPowStrings: BoostPowStringModel[] = [];
        for (const candidate of arrayOfPotentialBoostPowStrings) {
            boostPowStrings.push(BoostPowStringModel.fromString(candidate));
        }
        return boostPowStrings;
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

    static from(str) {
        var buf = Buffer.from(str, 'hex')
        return new BoostPowStringModel(bsv.BlockHeader.fromBuffer(buf));
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
