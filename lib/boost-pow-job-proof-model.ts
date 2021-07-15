import * as bsv from 'bsv';
import { BoostUtils } from './boost-utils';
import { UInt32Little } from './fields/uint32Little';
import { UInt32Big } from './fields/uint32Big';
import { UInt64Big } from './fields/uint64Big';
import { Digest20 } from './fields/digest20';
import { Bytes } from './fields/bytes';

/**
 * Responsible for redeem script proof that work was done.
 * This gets combined with BoostPowJobModel
 */
export class BoostPowJobProofModel {

    private constructor(
        private Signature: Bytes,
        private MinerPubKey: Bytes,
        private Time: UInt32Little,
        private ExtraNonce1: UInt32Big,
        private ExtraNonce2: UInt64Big,
        private Nonce: UInt32Little,
        private MinerPubKeyHash: Digest20,
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
            new Bytes(Buffer.from(params.signature, 'hex')),
            new Bytes(minerPubKey),
            new UInt32Little(BoostUtils.createBufferAndPad(params.time, 4, false)),
            new UInt32Big(BoostUtils.createBufferAndPad(params.extraNonce1, 4,false)),
            new UInt64Big(BoostUtils.createBufferAndPad(params.extraNonce2, 8, false)),
            new UInt32Little(BoostUtils.createBufferAndPad(params.nonce, 4, false)),
            new Digest20(Buffer.from(minerPubKeyHash, 'hex')),
        );
    }

    time(): UInt32Little {
        return this.Time;
    }

    extraNonce1(): UInt32Big {
        return this.ExtraNonce1;
    }

    extraNonce2(): UInt64Big {
        return this.ExtraNonce2;
    }

    nonce(): UInt32Little {
        return this.Nonce;
    }

    // Should add bsv.Address version and string version too
    minerPubKeyHash(): Digest20 {
        return this.MinerPubKeyHash;
    }

    signature(): Bytes {
        return this.Signature;
    }

    minerPubKey(): Bytes {
        return this.MinerPubKey;
    }

    toObject () {
        return {
            // Output to string first, then flip endianness so we do not accidentally modify underlying buffer
            signature: this.Signature.hex(),
            minerPubKey: this.MinerPubKey.hex(),
            time: this.Time.hex(),
            nonce: this.Nonce.hex(),
            extraNonce1: this.ExtraNonce1.hex(),
            extraNonce2: this.ExtraNonce2.hex(),
            minerPubKeyHash: this.MinerPubKeyHash.hex(),
        };
    }

    toHex(): string {

        let buildOut = bsv.Script();
        // Add signature
     buildOut.add(this.Signature.buffer());
       /* Buffer.concat([
            this.signature.toBuffer(),
            Buffer.from([sigtype & 0xff])
          ]*/

        // Add miner pub key
        buildOut.add(this.MinerPubKey.buffer());

        // Add miner nonce
        buildOut.add(this.Nonce.buffer());

        // Add time
        buildOut.add(this.Time.buffer());

        // Add extra nonce2
        buildOut.add(this.ExtraNonce2.buffer());

        // Add extra nonce 1
        buildOut.add(this.ExtraNonce1.buffer());

        // Add miner address
        buildOut.add(this.MinerPubKeyHash.buffer());

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
            signature = new Bytes(script.chunks[0].buf);
            minerPubKey = new Bytes(script.chunks[1].buf);
            nonce = new UInt32Little(script.chunks[2].buf);
            time = new UInt32Little(script.chunks[3].buf);

            extraNonce2 = new UInt32Big(script.chunks[4].buf);
            extraNonce1 = new UInt64Big(script.chunks[5].buf);
            minerPubKeyHash = new Digest20(script.chunks[6].buf);

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
            signature = new Bytes(script.chunks[0].buf);
            minerPubKey = new Bytes(script.chunks[1].buf);
            nonce = new UInt32Little(script.chunks[2].buf);
            time = new UInt32Little(script.chunks[3].buf);

            extraNonce2 = new UInt32Big(script.chunks[4].buf);
            extraNonce1 = new UInt64Big(script.chunks[5].buf);
            minerPubKeyHash = new Digest20(script.chunks[6].buf);

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
