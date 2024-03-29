import { Int32Little } from './fields/int32Little';
import { UInt32Little } from './fields/uint32Little';
import { Digest32 } from './fields/digest32';
import { Digest20 } from './fields/digest20';
import { Bytes } from './fields/bytes';
import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
export declare class BoostSignalModel {
    private boostPowString;
    private boostPowMetadata;
    private boostJobId?;
    private boostJobProofId?;
    private constructor();
    get jobId(): string | undefined;
    get jobProofId(): string | undefined;
    get powString(): BoostPowStringModel;
    get metadata(): BoostPowMetadataModel;
    get hash(): Digest32;
    get difficulty(): number;
    get content(): Digest32;
    get category(): Int32Little;
    get metadataHash(): Digest32;
    get time(): UInt32Little;
    get nonce(): UInt32Little;
    get tag(): Bytes | null;
    get userNonce(): UInt32Little | null;
    get additionalData(): Bytes | null;
    get minerPubKeyHash(): Digest20 | null;
    toString(): string;
    toObject(): any;
}
