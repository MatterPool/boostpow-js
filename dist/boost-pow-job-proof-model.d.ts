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
    private vin?;
    private spentTxid?;
    private spentVout?;
    private constructor();
    static fromObject(params: {
        signature: string;
        minerPubKey: string;
        time: string;
        nonce: string;
        extraNonce1: string;
        extraNonce2: string;
        minerPubKeyHash?: string;
    }): BoostPowJobProofModel;
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
    getMinerPubKeyHashHex(): string;
    setSignature(signature: string): void;
    setSignatureBuffer(signature: Buffer): void;
    getSignature(): Buffer;
    getSignatureHex(): string;
    getMinerPubKey(): Buffer;
    getMinerPubKeyHex(): string;
    /**
     *
     * @param publicKey The publicKey key string to use to redeem the Boost output
     */
    setMinerPubKeyAndHash(publicKey: string): void;
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
    static fromScript(script: bsv.Script, txid?: string, vin?: number, spentTxid?: string, spentVout?: number): BoostPowJobProofModel;
    static fromHex(asm: string, txid?: string, vin?: number, spentTxid?: string, spentVout?: number): BoostPowJobProofModel;
    static fromASM(asm: string, txid?: string, vin?: number, spentTxid?: string, spentVout?: number): BoostPowJobProofModel;
    getTxInpoint(): {
        txid?: string;
        vin?: number;
    };
    getTxid(): string | undefined;
    getVin(): number | undefined;
    getSpentTxid(): string | undefined;
    getSpentVout(): number | undefined;
    toASM(): string;
    static fromASM2(str: string, txid?: string, vin?: number): BoostPowJobProofModel;
    toString(): string;
    toBuffer(): string;
    static fromString(str: string, txid?: string, vin?: number): BoostPowJobProofModel;
}
