import * as bsv from 'bsv';
import { UInt32Little } from './fields/uint32Little';
import { UInt32Big } from './fields/uint32Big';
import { UInt64Big } from './fields/uint64Big';
import { Digest20 } from './fields/digest20';
import { Bytes } from './fields/bytes';
/**
 * Responsible for redeem script proof that work was done.
 * This gets combined with BoostPowJobModel
 */
export declare class BoostPowJobProofModel {
    private Signature;
    private MinerPubKey;
    private Time;
    private ExtraNonce1;
    private ExtraNonce2;
    private Nonce;
    private MinerPubKeyHash;
    private GeneralPurposeBits?;
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
        generalPurposeBits?: string;
    }): BoostPowJobProofModel;
    time(): UInt32Little;
    generalPurposeBits(): UInt32Little | undefined;
    extraNonce1(): UInt32Big;
    extraNonce2(): UInt64Big;
    nonce(): UInt32Little;
    minerPubKeyHash(): Digest20;
    signature(): Bytes;
    minerPubKey(): Bytes;
    toObject(): {
        signature: string;
        minerPubKey: string;
        time: string;
        nonce: string;
        extraNonce1: string;
        extraNonce2: string;
        generalPurposeBits: string;
        minerPubKeyHash: string;
    } | {
        signature: string;
        minerPubKey: string;
        time: string;
        nonce: string;
        extraNonce1: string;
        extraNonce2: string;
        minerPubKeyHash: string;
        generalPurposeBits?: undefined;
    };
    toScript(): bsv.Script;
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
    static fromASM2(str: string, txid?: string, vin?: number): BoostPowJobProofModel;
    toString(): string;
    toBuffer(): string;
    static fromString(str: string, txid?: string, vin?: number): BoostPowJobProofModel;
}
