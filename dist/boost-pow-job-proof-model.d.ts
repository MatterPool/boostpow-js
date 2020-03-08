/// <reference types="node" />
import * as bsv from 'bsv';
/**
 * Responsible for redeem script proof that work was done.
 * This gets combined with BoostPowJobModel
 */
export declare class BoostPowJobProofModel {
    private signature;
    private minerPubKey;
    private time;
    private minerNonce;
    private minerAddress;
    private txid?;
    private vout?;
    private value?;
    private constructor();
    static fromObject(params: {
        signature: string;
        minerPubKey: string;
        time: string;
        minerNonce: string;
        minerAddress: string;
    }): BoostPowJobProofModel;
    getSignature(): Buffer;
    getMinerPubKey(): Buffer;
    getTime(): Buffer;
    getTimeNumber(): number;
    getTimeBuffer(): Buffer;
    setTime(time: string): void;
    getMinerNonceNumber(): number;
    getMinerNonce(): Buffer;
    setMinerNonce(minerNonce: string): void;
    getMinerAddress(): Buffer;
    toObject(): {
        signature: string;
        minerPubKey: string;
        time: string;
        minerNonce: string;
        minerAddress: string;
    };
    toHex(): string;
    static fromTransaction(tx: bsv.Transaction): BoostPowJobProofModel | undefined;
    static fromRawTransaction(rawtx: string): BoostPowJobProofModel | undefined;
    static fromScript(script: bsv.Script, txid?: string, vout?: number, value?: number): BoostPowJobProofModel;
    static fromHex(asm: string, txid?: string, vout?: number, value?: number): BoostPowJobProofModel;
    getTxOutpoint(): {
        txid?: string;
        vout?: number;
        value?: number;
    };
    getTxid(): string | undefined;
    getVout(): number | undefined;
    getValue(): number | undefined;
    toASM(): string;
    static fromASM(str: string, txid?: string, vout?: number, value?: number): BoostPowJobProofModel;
    toString(): string;
    static fromString(str: string, txid?: string, vout?: number, value?: number): BoostPowJobProofModel;
}
