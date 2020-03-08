/// <reference types="node" />
import * as bsv from 'bsv';
import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
/**
 * Responsible for a Boost Job Proof.
 *
 * The Boost Pow String (also known as Boost Header) is derived from the locking and redeem transactions
 * BoostPowString = combined(BoostJob + BoostJobProof)
 *
 */
export declare class BoostPowJobModel {
    private content;
    private difficulty;
    private category;
    private tag;
    private metadata;
    private unique;
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
    getCategoryHex(): string;
    getCategoryString(trimLeadingNulls?: boolean): string;
    getTagString(trimLeadingNulls?: boolean): string;
    getTagHex(): string;
    getTagBuffer(): Buffer;
    getMetadataString(trimLeadingNulls?: boolean): string;
    getMetadataHex(): string;
    getMetadataBuffer(): Buffer;
    getUnique(): number;
    getUniqueBuffer(): Buffer;
    getUniqueHex(): string;
    static fromObject(params: {
        content: string;
        diff: number;
        category?: string;
        tag?: string;
        metadata?: string;
        unique?: string;
    }): BoostPowJobModel;
    toObject(): {
        content: string;
        diff: number;
        category: string;
        tag: string;
        metadata: string;
        unique: string;
    };
    private static difficulty2bits;
    getTargetAsNumberBuffer(): any;
    toHex(): string;
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
    static remainingOperationsMatchExactly(remainingChunks: any): boolean;
    static fromHex(asm: string, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    toASM(): string;
    static fromASM(str: string, txid?: string, vout?: number, value?: number): BoostPowJobModel;
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
    static tryValidateJobProof(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel, debug?: boolean): BoostPowStringModel | null;
    static operations: any[];
}
