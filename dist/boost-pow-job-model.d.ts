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
    private metadata;
    private unique;
    private txid?;
    private vout?;
    private constructor();
    private trimBufferString;
    getContentBuffer(): Buffer;
    getContentString(trimLeadingNulls?: boolean): string;
    getDiff(): number;
    getCategoryBuffer(): Buffer;
    getCategoryString(trimLeadingNulls?: boolean): string;
    getTagString(trimLeadingNulls?: boolean): string;
    getTagBuffer(): Buffer;
    getMetadataString(trimLeadingNulls?: boolean): string;
    getMetadataBuffer(): Buffer;
    getUnique(): number;
    getUniqueBuffer(): Buffer;
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
    static fromHex(asm: string, txid?: string, vout?: number): BoostPowJobModel;
    toASM(): string;
    static fromASM(str: string, txid?: string, vout?: number): BoostPowJobModel;
    toString(): string;
    static fromString(str: string, txid?: string, vout?: number): BoostPowJobModel;
    static fromScript(script: bsv.Script, txid?: string, vout?: number): BoostPowJobModel;
    getTxOutpoint(): {
        txid?: string;
        vout?: number;
    };
    getTxid(): string | undefined;
    getVout(): number | undefined;
    static fromTransaction(tx: bsv.Transaction): BoostPowJobModel | undefined;
    static fromRawTransaction(rawtx: string): BoostPowJobModel | undefined;
    static createBoostPowMetadata(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel): BoostPowMetadataModel;
    static tryValidateJobProof(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel, debug?: boolean): BoostPowStringModel | null;
    static operations: any[];
}
