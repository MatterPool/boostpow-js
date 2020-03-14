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
    private extraNonce1;
    private extraNonce2;
    private nonce;
    private minerPubKeyHash;
    private txid?;
    private vout?;
    private value?;
    private constructor();
    static fromObject(params: {
        signature: string;
        minerPubKey: string;
        time: string;
        nonce: string;
        extraNonce1: string;
        extraNonce2: string;
        minerPubKeyHash: string;
    }): BoostPowJobProofModel;
    getSignature(): Buffer;
    getMinerPubKey(): Buffer;
    getTime(): Buffer;
    getTimeNumber(): number;
    getTimeBuffer(): Buffer;
    setTime(time: string): void;
    getExtraNonce1Number(): number;
    getExtraNonce1(): Buffer;
    getExtraNonce2Number(): number;
    getExtraNonce2(): Buffer;
    getNonceNumber(): number;
    getNonce(): Buffer;
    setNonce(nonce: string): void;
    setExtraNonce1(nonce: string): void;
    setExtraNonce2(nonce: string): void;
    getMinerPubKeyHash(): Buffer;
    toObject(): {
        signature: string;
        minerPubKey: string;
        time: string;
        nonce: string;
        extraNonce1: string;
        extraNonce2: string;
        minerPubKeyHash: string;
    };
    toHex(): string;
    static fromTransaction(tx: bsv.Transaction): BoostPowJobProofModel | undefined;
    static fromRawTransaction(rawtx: string): BoostPowJobProofModel | undefined;
    static fromScript(script: bsv.Script, txid?: string, vout?: number, value?: number): BoostPowJobProofModel;
    static fromHex(asm: string, txid?: string, vout?: number, value?: number): BoostPowJobProofModel;
    static fromASM(asm: string, txid?: string, vout?: number, value?: number): BoostPowJobProofModel;
    getTxOutpoint(): {
        txid?: string;
        vout?: number;
        value?: number;
    };
    getTxid(): string | undefined;
    getVout(): number | undefined;
    getValue(): number | undefined;
    toASM(): string;
    static fromASM2(str: string, txid?: string, vout?: number, value?: number): BoostPowJobProofModel;
    toString(): string;
    static fromString(str: string, txid?: string, vout?: number, value?: number): BoostPowJobProofModel;
}
