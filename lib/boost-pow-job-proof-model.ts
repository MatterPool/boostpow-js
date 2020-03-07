import * as bsv from 'bsv';
import { BoostPowJobModel } from './boost-pow-job-model';

/**
 * Responsible for redeem script proof that work was done.
 * This gets combined with BoostPowJobModel
 */
export class BoostPowJobProofModel {

    private constructor(
        private signature: Buffer,
        private minerPubKey: Buffer,
        private time: Buffer,
        private minerNonce: Buffer,
        private minerAddress: Buffer
    ) {
    }

    static fromObject(params: {
        signature: string,
        minerPubKey: string,
        time: string,
        minerNonce: string,
        minerAddress: string
    }): BoostPowJobProofModel {
        return new BoostPowJobProofModel(
            BoostPowJobModel.createBufferAndPad(params.signature, 32),
            BoostPowJobModel.createBufferAndPad(params.minerPubKey, 32),
            BoostPowJobModel.createBufferAndPad(params.time, 4),
            BoostPowJobModel.createBufferAndPad(params.minerNonce, 8),
            BoostPowJobModel.createBufferAndPad(params.minerAddress, 20),
        );
    }

    getSignature(): Buffer {
        return this.signature;
    }
    getMinerPubKey(): Buffer {
        return this.minerPubKey;
    }
    getTime(): Buffer {
        return this.time;
    }
    getMinerNonce(): Buffer {
        return this.minerNonce;
    }
    getMinerAddress(): Buffer {
        return this.minerAddress;
    }

    toObject () {
        return {
            // Output to string first, then flip endianness so we do not accidentally modify underlying buffer
            signature: (this.signature.toString('hex').match(/../g) || []).reverse().join(''),
            minerPubKey: (this.minerPubKey.toString('hex').match(/../g) || []).reverse().join(''),
            time: (this.time.toString('hex').match(/../g) || []).reverse().join(''),
            minerNonce: (this.minerNonce.toString('hex').match(/../g) || []).reverse().join(''),
            minerAddress: (this.minerAddress.toString('hex').match(/../g) || []).reverse().join(''),
        };
    }

    toHex(): string {
        let buildOut = bsv.Script();
        // Add signature
        buildOut.add(this.signature);

        // Add miner pub key
        buildOut.add(this.minerPubKey);

        // Add time
        buildOut.add(this.time);

        // Add miner nonce
        buildOut.add(this.minerNonce);

        // Add miner address
        buildOut.add(this.minerAddress);

        const hex = buildOut.toHex();
        const fromhex = bsv.Script.fromHex(hex);
        const hexIso = fromhex.toHex();
        if (hex != hexIso) {
            throw new Error('Not isomorphic');
        }
        return hexIso;
    }

    static fromHex(asm: string): BoostPowJobProofModel {
        const script = new bsv.Script(asm);
        let signature;
        let minerPubKey;
        let time;
        let minerNonce;
        let minerAddress;

        if (
            5 === script.chunks.length &&

            // signature
            script.chunks[0].len &&
            // script.chunks[0].opcodenum === 4 &&

            // minerPubKey
            script.chunks[1].len &&
            // script.chunks[1].len === 32 &&

            // time
            script.chunks[2].len &&
            // script.chunks[2].len === 4 &&

            // minerNonce
            script.chunks[3].len &&
            // script.chunks[3].len === 20 &&

            // minerAddress
            script.chunks[4].len
            // script.chunks[4].len === 8
        ) {
            signature = script.chunks[0].buf;
            minerPubKey = script.chunks[1].buf;
            time = script.chunks[2].buf;
            minerNonce = script.chunks[3].buf;
            minerAddress = script.chunks[4].buf;

            return new BoostPowJobProofModel(
                signature,
                minerPubKey,
                time,
                minerNonce,
                minerAddress
            );
        }
        throw new Error('Not valid Boost Proof');
    }

    toASM(): string {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toASM();
    }

    static fromASM(str: string): BoostPowJobProofModel {
        return BoostPowJobProofModel.fromHex(str);
    }

    toString(): string {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toString();
    }

    static fromString(str: string): BoostPowJobProofModel {
        return BoostPowJobProofModel.fromHex(str);
    }
}