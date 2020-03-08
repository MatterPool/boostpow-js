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
        private minerNonce: Buffer,
        private minerAddress: Buffer,
        // Optional tx information attached or not
        private txid?: string,
        private vout?: number,
        private value?: number,
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
            BoostUtils.createBufferAndPad(params.signature, 32),
            BoostUtils.createBufferAndPad(params.minerPubKey, 32),
            BoostUtils.createBufferAndPad(params.time, 4),
            BoostUtils.createBufferAndPad(params.minerNonce, 8),
            BoostUtils.createBufferAndPad(params.minerAddress, 20),
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
    setTime(time: string) {
        this.time = BoostUtils.createBufferAndPad(time, 4)
    }
    getMinerNonce(): Buffer {
        return this.minerNonce;
    }
    setMinerNonce(minerNonce: string) {
        this.minerNonce = BoostUtils.createBufferAndPad(minerNonce, 8)
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

    static fromTransaction(tx: bsv.Transaction): BoostPowJobProofModel | undefined {
        if (!tx) {
            return undefined;
        }
        let o = 0;
        for (const out of tx.outputs) {
            try {
                console.log('out proof', out);
                return BoostPowJobProofModel.fromScript(out.script, tx.hash, o, out.value);
            } catch (ex) {
                // Skip and try another output
            }
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

    static fromScript(script: bsv.Script, txid?: string, vout?: number, value?: number): BoostPowJobProofModel {
        return BoostPowJobProofModel.fromHex(script, txid, vout, value);
    }

    static fromHex(asm: string, txid?: string, vout?: number, value?: number): BoostPowJobProofModel {
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
                minerAddress,
                txid,
                vout,
                value
            );
        }
        throw new Error('Not valid Boost Proof');
    }

    // Optional attached information if available
    getTxOutpoint(): {txid?: string, vout?: number, value?: number} {
        return {
            txid: this.txid,
            vout: this.vout,
            value: this.value,
        }
    }
    // Optional attached information if available
    getTxid(): string | undefined {
        return this.txid;
    }
    // Optional attached information if available
    getVout(): number | undefined {
        return this.vout;
    }

    // Optional attached information if available
    getValue(): number | undefined {
        return this.value;
    }

    toASM(): string {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toASM();
    }

    static fromASM(str: string, txid?: string, vout?: number, value?: number): BoostPowJobProofModel {
        return BoostPowJobProofModel.fromHex(str, txid, vout, value);
    }

    toString(): string {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toString();
    }

    static fromString(str: string, txid?: string, vout?: number, value?: number): BoostPowJobProofModel {
        return BoostPowJobProofModel.fromHex(str, txid, vout, value);
    }
}