import * as bsv from 'bsv';
import { Int32Little } from './fields/int32Little';
import { UInt32Little } from './fields/uint32Little';
import { UInt16Little } from './fields/uint16Little';
import { Digest32 } from './fields/digest32';
import { Digest20 } from './fields/digest20';
import { Bytes } from './fields/bytes';
import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
export declare class BoostPowJobModel {
    private Content;
    private Difficulty;
    private Category;
    private Tag;
    private AdditionalData;
    private UserNonce;
    private useGeneralPurposeBits;
    private MinerPubKeyHash?;
    private Txid?;
    private Vout?;
    private Value?;
    private constructor();
    get category(): Int32Little;
    get magicNumber(): UInt16Little;
    get content(): Digest32;
    get tag(): Bytes;
    get additionalData(): Bytes;
    get userNonce(): UInt32Little;
    get difficulty(): number;
    get bits(): UInt32Little;
    get minerPubKeyHash(): Digest20 | undefined;
    get id(): string;
    isContract(): boolean;
    isBounty(): boolean;
    static fromObject(params: {
        content: string;
        diff: number;
        category?: string;
        tag?: string;
        additionalData?: string;
        userNonce?: string;
        minerPubKeyHash?: string;
        useGeneralPurposeBits?: boolean;
    }): BoostPowJobModel;
    toObject(): {
        content: string;
        diff: number;
        category: string;
        tag: string;
        additionalData: string;
        userNonce: string;
        minerPubKeyHash: string;
        useGeneralPurposeBits: boolean;
    } | {
        content: string;
        diff: number;
        category: string;
        tag: string;
        additionalData: string;
        userNonce: string;
        useGeneralPurposeBits: boolean;
        minerPubKeyHash?: undefined;
    };
    toHex(): string;
    private toOpCode;
    toScript(): bsv.Script;
    static remainingOperationsMatchExactly(remainingChunks: any, start: number, expectedOps: any): boolean;
    static readScript(script: any, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    static fromHex(asm: string, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    static fromASM(asm: string, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    toASM(): string;
    static fromASM4(str: string, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    static fromASM2(str: string, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    toString(): string;
    static fromString(str: string, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    static fromScript(script: bsv.Script, txid?: string, vout?: number, value?: number): BoostPowJobModel;
    get txOutpoint(): {
        txid?: string;
        vout?: number;
        value?: number;
    };
    get txid(): string | undefined;
    get vout(): number | undefined;
    get value(): number | undefined;
    get scriptHash(): string;
    static fromTransaction(tx: bsv.Transaction, vout?: number): BoostPowJobModel | undefined;
    static fromTransactionGetAllOutputs(tx: bsv.Transaction): BoostPowJobModel[];
    static fromRawTransaction(rawtx: string, vout?: number): BoostPowJobModel | undefined;
    /**
     * Create a transaction fragment that can be modified to redeem the boost job
     *
     * @param boostPowJob Boost Job to redeem
     * @param boostPowJobProof Boost job proof to use to redeem
     * @param privateKey The private key string of the minerPubKeyHash
     */
    static createRedeemTransaction(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel, privateKeyStr: string, receiveAddressStr: string): bsv.Transaction | null;
    static createBoostPowMetadata(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel): BoostPowMetadataModel;
    static tryValidateJobProof(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel): null | {
        boostPowString: BoostPowStringModel | null;
        boostPowMetadata: BoostPowMetadataModel | null;
    };
    static loopOperation(loopIterations: number, generateFragmentInvoker: Function): never[];
    static scriptOperations(useGeneralPurposeBits: boolean): any[];
    static scriptOperationsV1NoASICBoost(): any[];
    static scriptOperationsV2ASICBoost(): any[];
    static expand_target(): any[];
    static ensure_positive(): any[];
    static reverse32(): any[];
}
