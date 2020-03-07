import * as bsv from 'bsv';
import { BoostUtils } from './boost-utils';

export class BoostPowMetadataModel {

    private constructor(
        private tag: Buffer,
        private minerAddress: Buffer,
        private unique: Buffer,
        private minerNonce: Buffer,
        private metadata: Buffer
    ) {
    }

    static fromObject(params: {
        tag: string,
        minerAddress: string,
        unique: string,
        minerNonce: string,
        metadata: string
    }): BoostPowMetadataModel {

        return new BoostPowMetadataModel(
            BoostUtils.createBufferAndPad(params.tag, 20),
            BoostUtils.createBufferAndPad(params.minerAddress, 20),
            BoostUtils.createBufferAndPad(params.unique, 8),
            BoostUtils.createBufferAndPad(params.minerNonce, 8),
            BoostUtils.createBufferAndPad(params.metadata, 32),
        );
    }

    static fromBuffer(params: {
        tag: Buffer,
        minerAddress: Buffer,
        unique: Buffer,
        minerNonce: Buffer,
        metadata: Buffer
    }): BoostPowMetadataModel {

        return new BoostPowMetadataModel(
            params.tag,
            params.minerAddress,
            params.unique,
            params.minerNonce,
            params.metadata,
        );
    }

    getTag(): Buffer {
        return this.tag;
    }
    getMinerAddress(): Buffer {
        return this.minerAddress;
    }
    getUnique(): Buffer {
        return this.unique;
    }
    getMinerNonce(): Buffer {
        return this.minerNonce;
    }
    getMetadata(): Buffer {
        return this.metadata;
    }

    hash() {
        return bsv.crypto.Hash.sha256(this.toBuffer()).toString('hex');
    }

    hashAsBuffer() {
        return bsv.crypto.Hash.sha256(this.toBuffer());
    }

    toObject () {
        return {
            tag: (this.tag.toString('hex').match(/../g) || []).reverse().join(''),
            minerAddress: (this.minerAddress.toString('hex').match(/../g) || []).reverse().join(''),
            unique: (this.unique.toString('hex').match(/../g) || []).reverse().join(''),
            minerNonce: (this.minerNonce.toString('hex').match(/../g) || []).reverse().join(''),
            metadata: (this.metadata.toString('hex').match(/../g) || []).reverse().join(''),
        };
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.tag,
            this.minerAddress,
            this.unique,
            this.minerNonce,
            this.metadata
        ]);
    }

    toHex(): string {
        return Buffer.concat([
            this.tag,
            this.minerAddress,
            this.unique,
            this.minerNonce,
            this.metadata,
        ]).toString('hex');
    }

    static fromHex(str: string): BoostPowMetadataModel | null {
        if ((str.length / 2)< 56 || (str.length / 2) > 88) {
            throw new Error('Invalid Boost Meta');
        }
        return new BoostPowMetadataModel(
            Buffer.from(str.substr(0, 40), 'hex'),
            Buffer.from(str.substr(40, 40), 'hex'),
            Buffer.from(str.substr(80, 16), 'hex'),
            Buffer.from(str.substr(96, 16), 'hex'),
            Buffer.from(str.substr(112, 64), 'hex'),
        );
    }

}