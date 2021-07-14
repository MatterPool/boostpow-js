import * as bsv from 'bsv';
import { BoostUtils } from './boost-utils';

/**
 * Responsible for redeem script proof that work was done.
 * This gets combined with BoostPowJobModel
 */
export class BoostPowJobProofModel {

    private constructor(
        private signature: Buffer,
        private minerPubKey: Buffer,
        private time: Buffer,
        private extraNonce1: Buffer,
        private extraNonce2: Buffer,
        private nonce: Buffer,
        private minerPubKeyHash: Buffer,
        // Optional tx information attached or not
        private txid?: string,
        private vin?: number,
        private spentTxid?: string,
        private spentVout?: number
    ) {
    }

    static fromObject(params: {
        signature: string,
        minerPubKey: string,
        time: string,
        nonce: string,
        extraNonce1: string,
        extraNonce2: string,
        minerPubKeyHash?: string
    }): BoostPowJobProofModel {

        if (params.signature.length > 166) {
            throw new Error('signature too large. Max 83 bytes.')
        }

        if (params.minerPubKey.length != 66 && params.minerPubKey.length != 130) {
            throw new Error('minerPubKey too large. Max 65 bytes.');
        }

        if (params.nonce.length > 8) {
            throw new Error('nonce too large. Max 4 bytes.')
        }

        if (params.extraNonce1.length > 8) {
            throw new Error('extraNonce1 too large. Max 4 bytes.')
        }

        if (params.extraNonce2.length > 16) {
            throw new Error('extraNonce2 too large. Max 8 bytes.')
        }

        let minerPubKey = Buffer.from(params.minerPubKey, 'hex');
        let minerPubKeyHash: string;
        if (params.minerPubKeyHash) {
            if (params.minerPubKeyHash.length != 40) {
               throw new Error('minerPubKeyHash too large. Max 20 bytes.');
            }
            minerPubKeyHash = params.minerPubKeyHash;
        } else {
            minerPubKeyHash = bsv.crypto.hash.sha256ripemd160(minerPubKey).toString('hex');
        }

        return new BoostPowJobProofModel(
            Buffer.from(params.signature, 'hex'),
            minerPubKey,
            BoostUtils.createBufferAndPad(params.time, 4, false),
            BoostUtils.createBufferAndPad(params.extraNonce1, 4,false),
            BoostUtils.createBufferAndPad(params.extraNonce2, 8, false),
            BoostUtils.createBufferAndPad(params.nonce, 4, false),
            Buffer.from(minerPubKeyHash, 'hex'),
        );
    }

    getTime(): Buffer {
        return this.time;
    }

    getTimeNumber(): number {
        return this.time.readUInt32LE();
    }

    getTimeBuffer(): Buffer {
        return this.time;
    }

    getExtraNonce1Number(): number {
        return parseInt(this.extraNonce1.toString('hex'), 16);
    }

    getExtraNonce1(): Buffer {
        return this.extraNonce1;
    }

    getExtraNonce2Number(): number {
        return parseInt(this.extraNonce2.toString('hex'), 16);
    }

    getExtraNonce2(): Buffer {
        return this.extraNonce2;
    }

    getNonceNumber(): number {
        return this.nonce.readUInt32LE();
    }

    getNonce(): Buffer {
        return this.nonce;
    }

    // Should add bsv.Address version and string version too
    getMinerPubKeyHash(): Buffer {
        return this.minerPubKeyHash;
    }

    getMinerPubKeyHashHex(): string {
        return this.minerPubKeyHash.toString('hex');
    }

    getSignature(): Buffer {
        return this.signature;
    }

    getSignatureHex(): string {
        return this.signature.toString('hex');
    }

    getMinerPubKey(): Buffer {
        return this.minerPubKey;
    }

    getMinerPubKeyHex(): string {
        return this.minerPubKey.toString('hex');
    }

    toObject () {
        return {
            // Output to string first, then flip endianness so we do not accidentally modify underlying buffer
            signature: this.signature.toString('hex'),
            minerPubKey: this.minerPubKey.toString('hex'),
            time: this.time.toString('hex'),
            nonce: this.nonce.toString('hex'),
            extraNonce1: this.extraNonce1.toString('hex'),
            extraNonce2: this.extraNonce2.toString('hex'),
            minerPubKeyHash: this.minerPubKeyHash.toString('hex'),
        };
    }

    toHex(): string {

        let buildOut = bsv.Script();
        // Add signature
     buildOut.add(this.signature);
       /* Buffer.concat([
            this.signature.toBuffer(),
            Buffer.from([sigtype & 0xff])
          ]*/

        // Add miner pub key
        buildOut.add(this.minerPubKey);

        // Add miner nonce
        buildOut.add(Buffer.from(this.nonce));

        // Add time
        buildOut.add(Buffer.from(this.time));

        // Add extra nonce2
        buildOut.add(this.extraNonce2);

        // Add extra nonce 1
        buildOut.add(this.extraNonce1);

        // Add miner address
        buildOut.add(this.minerPubKeyHash);

        for (let i = 0; i < buildOut.chunks.length ; i++) {
            if (!buildOut.checkMinimalPush(i)) {
                throw new Error('not min push');
            }
        }


        const hex = buildOut.toHex();
        const fromhex = bsv.Script.fromHex(hex);
        const hexIso = fromhex.toHex();
        if (hex != hexIso) {
            throw new Error('Not isomorphic');
        }
        return hexIso;
    }

    static fromTransaction(tx: bsv.Transaction): BoostPowJobProofModel | undefined {
        if (!tx) {
            return undefined;
        }
        let inp = 0;
        for (const input of tx.inputs) {
            try {
                return BoostPowJobProofModel.fromScript(input.script, tx.hash, inp, input.prevTxId.toString('hex'), input.outputIndex); // spentTx, spentVout);
            } catch (ex) {
                // Skip and try another output
            }
            inp++;
        }
        return undefined;
    }

    static fromRawTransaction(rawtx: string): BoostPowJobProofModel | undefined {
        if (!rawtx || rawtx === '') {
            return undefined;
        }
        const tx = new bsv.Transaction(rawtx);
        return BoostPowJobProofModel.fromTransaction(tx);
    }

    static fromScript(script: bsv.Script, txid?: string, vin?: number, spentTxid?: string, spentVout?: number): BoostPowJobProofModel {
        return BoostPowJobProofModel.fromHex(script, txid, vin, spentTxid, spentVout);
    }

    static fromHex(asm: string, txid?: string, vin?: number, spentTxid?: string, spentVout?: number): BoostPowJobProofModel {
        const script = new bsv.Script(asm);
        let signature;
        let minerPubKey;
        let time;
        let nonce;
        let extraNonce1;
        let extraNonce2;
        let minerPubKeyHash;

        if (
            7 === script.chunks.length &&

            // signature
            script.chunks[0].len &&

            // minerPubKey
            script.chunks[1].len &&

            // nonce
            script.chunks[2].len &&

            // time
            script.chunks[3].len &&

            // extra Nonce 2
            script.chunks[4].len &&

            // extra Nonce 1
            script.chunks[5].len &&

            // minerPubKeyHash
            script.chunks[6].len

        ) {
            signature = script.chunks[0].buf;
            minerPubKey = script.chunks[1].buf;
            nonce = script.chunks[2].buf;
            time = script.chunks[3].buf;

            extraNonce2 = script.chunks[4].buf;
            extraNonce1 = script.chunks[5].buf;
            minerPubKeyHash = script.chunks[6].buf;

            return new BoostPowJobProofModel(
                signature,
                minerPubKey,
                time,
                extraNonce1,
                extraNonce2,
                nonce,
                minerPubKeyHash,
                txid,
                vin,
                spentTxid,
                spentVout,
            );
        }
        throw new Error('Not valid Boost Proof');
    }


    static fromASM(asm: string, txid?: string, vin?: number, spentTxid?: string, spentVout?: number): BoostPowJobProofModel {
        const script = new bsv.Script.fromASM(asm);
        let signature;
        let minerPubKey;
        let time;
        let nonce;
        let extraNonce1;
        let extraNonce2;
        let minerPubKeyHash;

        if (
            7 === script.chunks.length &&

            // signature
            script.chunks[0].len &&

            // minerPubKey
            script.chunks[1].len &&

            // nonce
            script.chunks[2].len &&

            // time
            script.chunks[3].len &&

            // extra Nonce 2
            script.chunks[4].len &&

            // extra Nonce 1
            script.chunks[5].len &&

            // minerPubKeyHash
            script.chunks[6].len

        ) {
            signature = script.chunks[0].buf;
            minerPubKey = script.chunks[1].buf;
            nonce = script.chunks[2].buf;
            time = script.chunks[3].buf;

            extraNonce2 = script.chunks[4].buf;
            extraNonce1 = script.chunks[5].buf;
            minerPubKeyHash = script.chunks[6].buf;

            return new BoostPowJobProofModel(
                signature,
                minerPubKey,
                time,
                extraNonce1,
                extraNonce2,
                nonce,
                minerPubKeyHash,
                txid,
                vin,
                spentTxid,
                spentVout,
            );
        }
        throw new Error('Not valid Boost Proof');
    }

    // Optional attached information if available
    getTxInpoint(): {txid?: string, vin?: number} {
        return {
            txid: this.txid,
            vin: this.vin,
        }
    }
    // Optional attached information if available
    getTxid(): string | undefined {
        return this.txid;
    }

    // Optional attached information if available
    getVin(): number | undefined {
        return this.vin;
    }

    getSpentTxid(): string | undefined {
        return this.spentTxid;
    }

    // Optional attached information if available
    getSpentVout(): number | undefined {
        return this.spentVout;
    }

    toASM(): string {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toASM();
    }

    static fromASM2(str: string, txid?: string, vin?: number): BoostPowJobProofModel {
        return BoostPowJobProofModel.fromHex(str, txid, vin);
    }

    toString(): string {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toString();
    }

    toBuffer(): string {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toBuffer();
    }

    static fromString(str: string, txid?: string, vin?: number): BoostPowJobProofModel {
        return BoostPowJobProofModel.fromHex(str, txid, vin);
    }
}
