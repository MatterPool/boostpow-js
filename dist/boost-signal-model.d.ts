import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
export declare class BoostSignalModel {
    private boostPowString;
    private boostPowMetadata;
    private constructor();
    getBoostPowString(): BoostPowStringModel;
    getBoostMetadata(): BoostPowMetadataModel;
    hash(): string;
    difficulty(): number;
    energy(): number;
    content(hex?: boolean): string;
    category(hex?: boolean): string;
    metadataHash(): string;
    time(): number;
    nonce(): number;
    tag(hex?: boolean): string | null;
    userNonce(hex?: boolean): string | null;
    additionalData(hex?: boolean): string | null;
    minerPubKeyHash(): string | null;
    toString(): string;
    toObject(): any;
    /**
     * Construct the BoostSignal from pow hex string.
     * Optionally the 80 byte Boost Header can have the trailing bytes become the powMetadata
     *
     * If the metadata portion is ommitted (ie: not in the first param) and it is not the 2nd argument
     * Then it is not possible to get access to:
     *  this.tag,
        this.minerPubKeyHash,
        this.extraNonce1,
        this.extraNonce2,
        this.userNonce,
        this.additionalData

       Technically if the metadata is not set, it is still a valid Boost Signal
     * @param powStringAndOptionalMetadata 80 bytes minimum or also added the powMetadata
     * @param powMetadata Optionally provided in 2nd argument
     */
    static fromHex(powStringAndOptionalMetadata: string, powMetadata?: string): BoostSignalModel;
}
