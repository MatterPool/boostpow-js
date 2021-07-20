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
    private Txid?;
    private Vin?;
    private SpentTxid?;
    private SpentVout?;
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
    get time(): UInt32Little;
    get generalPurposeBits(): UInt32Little | undefined;
    get extraNonce1(): UInt32Big;
    get extraNonce2(): UInt64Big;
    get nonce(): UInt32Little;
    get minerPubKeyHash(): Digest20;
    get signature(): Bytes;
    get minerPubKey(): Bytes;
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
    get txInpoint(): {
        txid?: string;
        vin?: number;
    };
    get txid(): string | undefined;
    get vin(): number | undefined;
    get spentTxid(): string | undefined;
    get spentVout(): number | undefined;
    static fromASM2(str: string, txid?: string, vin?: number): BoostPowJobProofModel;
    toString(): string;
    toBuffer(): string;
    static fromString(str: string, txid?: string, vin?: number): BoostPowJobProofModel;
}
