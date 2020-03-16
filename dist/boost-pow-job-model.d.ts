/// <reference types="node" />
import * as bsv from 'bsv';
import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
export declare class BoostPowJobModel {
    private content;
    private difficulty;
    private category;
    private tag;
    private additionalData;
    private userNonce;
    private txid?;
    private vout?;
    private value?;
    private constructor();
    private trimBufferString;
    getContentBuffer(): Buffer;
    getContentString(trimLeadingNulls?: boolean): string;
    getContentHex(): string;
    getDiff(): number;
    getCategoryBuffer(): Buffer;
    getCategoryNumber(): number;
    getCategoryHex(): string;
    getCategoryString(trimLeadingNulls?: boolean): string;
    getTagString(trimLeadingNulls?: boolean): string;
    getTagHex(): string;
    getTagBuffer(): Buffer;
    getAdditionalDataString(trimLeadingNulls?: boolean): string;
    getAdditionalDataHex(): string;
    getAdditionalDataBuffer(): Buffer;
    getUserNonce(): number;
    getUserNonceNumber(): number;
    getUserNonceBuffer(): Buffer;
    getUserNonceHex(): string;
    static fromObject(params: {
        content: string;
        diff: number;
        category?: string;
        tag?: string;
        additionalData?: string;
        userNonce?: string;
    }): BoostPowJobModel;
    getBits(): number;
    bits(): number;
    static hexBitsToDifficulty(hexBits: string): number;
    getBitsHex(): string;
    toObject(): {
        content: string;
        diff: number;
        category: string;
        tag: string;
        additionalData: string;
        userNonce: string;
    };
    static difficulty2bits(difficulty: any): number;
    getTargetAsNumberHex(): any;
    getTargetAsNumberBuffer(): any;
    getId(): string;
    toHex(): string;
    toScript(isHex?: boolean): bsv.Script;
    /**
     * Returns the target difficulty for this block
     * @param {Number} bits
     * @returns {BN} An instance of BN with the decoded difficulty bits
     */
    static getTargetDifficulty(bits: any): any;
    /**
     * @link https://en.bitcoin.it/wiki/Difficulty
     * @return {Number}
     */
    static getDifficulty(bits: any): number;
    getDifficulty(): number;
    static remainingOperationsMatchExactly(remainingChunks: any, start: number): boolean;
    static fromHex(asm: string, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    static fromASM(asm: string, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    toASM(): string;
    static fromASM4(str: string, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    static fromASM2(str: string, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    toString(): string;
    static fromString(str: string, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    static fromScript(script: bsv.Script, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    getTxOutpoint(): {
        txid?: string;
        vout?: number;
        value?: number;
    };
    getTxid(): string | undefined;
    getVout(): number | undefined;
    getValue(): number | undefined;
    getScriptHash(): string;
    static fromTransaction(tx: bsv.Transaction): BoostPowJobModel | undefined;
    static fromRawTransaction(rawtx: string): BoostPowJobModel | undefined;
    static createBoostPowMetadata(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel): BoostPowMetadataModel;
    static createRedeemTx(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel, privateKey: string): bsv.Transaction | null;
    static tryValidateJobProof(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel, debug?: boolean): BoostPowStringModel | null;
    static operations: any[];
}
