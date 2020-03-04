/// <reference types="node" />
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
    getMinerNonce(): Buffer;
    getMinerAddress(): Buffer;
    toObject(): {
        signature: string;
        minerPubKey: string;
        time: string;
        minerNonce: string;
        minerAddress: string;
    };
    toHex(): string;
    static fromHex(asm: string): BoostPowJobProofModel;
    toASM(): string;
    static fromASM(str: string): BoostPowJobProofModel;
    toString(): string;
    static fromString(str: string): BoostPowJobProofModel;
}
