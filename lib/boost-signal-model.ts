import { Int32Little } from './fields/int32Little';
import { UInt32Little } from './fields/uint32Little';
import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
import * as bsv from 'bsv';

export class BoostSignalModel {
    private constructor(
        private boostPowString: BoostPowStringModel,
        private boostPowMetadata: BoostPowMetadataModel,
        private boostJobId?: string,
        private boostJobProofId?: string
    ) {
        if (!boostPowMetadata) {
            // No metadata, that's OKAY! We just have a valid Pow String but know nothing of tag, userNonce, additionalData, etc
            // But that's okay and this is still a valid signal, but missing the metadata
            return;
        }
        // On the other hand if the metadata is provided, then we will strictly check that they belong together!
        // Validate the proof of work here matches the metadataHash because we trust no one!
        //
        if (boostPowString.metadataHash() !==
            bsv.crypto.Hash.sha256sha256(boostPowMetadata.toBuffer()).reverse().toString('hex')) {
            throw new Error('Fatal: Invalid metadata for the pow string');
        }
    };

    public getBoostJobId(): string | undefined {
        return this.boostJobId;
    }

    public getBoostJobProofId(): string | undefined {
        return this.boostJobProofId;
    }

    public getBoostPowString(): BoostPowStringModel {
        return this.boostPowString;
    }

    public getBoostMetadata(): BoostPowMetadataModel {
        return this.boostPowMetadata;
    }

    public hash(): string {
        return this.boostPowString.hash();
    }

    public difficulty(): number {
        return this.boostPowString.difficulty();
    }

    public energy(): number {
        return this.difficulty();
    }

    public content(hex?: boolean): string {
        if (hex) {
            return this.boostPowString.contentHex();
        }
        return this.boostPowString.contentString();
    }

    public category(hex?: boolean): Int32Little {
        return this.boostPowString.category();
    }

    public metadataHash(): string {
        return this.boostPowString.metadataHash();
    }

    public time(): UInt32Little {
        return this.boostPowString.time();
    }
    public nonce(): UInt32Little {
        return this.boostPowString.nonce();
    }

    public tag(hex?: boolean): string | null {
        if (!this.boostPowMetadata) {
            return null;
        }
        if (hex) {
            return this.boostPowMetadata.getTag().toString('hex');
        }
        return this.boostPowMetadata.getTagUtf8();
    }

    public userNonce(hex?: boolean): string | null {
        if (!this.boostPowMetadata) {
            return null;
        }
        if (hex) {
            return this.boostPowMetadata.getUserNonce().toString('hex');
        }
        return this.boostPowMetadata.getUserNonceUtf8();
    }

    public additionalData(hex?: boolean): string | null {
        if (!this.boostPowMetadata) {
            return null;
        }
        if (hex) {
            return this.boostPowMetadata.getAdditionalData().toString('hex');
        }
        return this.boostPowMetadata.getAdditionalDataUtf8();
    }

    public minerPubKeyHash(): string | null {
        if (!this.boostPowMetadata) {
            return null;
        }
        return this.boostPowMetadata.getMinerPubKeyHash().toString('hex');
    }

    public toString(): string {
        let str = this.boostPowString.toString();
        if (this.boostPowMetadata) {
            str += this.boostPowMetadata
        }
        return str;
    }

    public toObject(): any {
        return {
            boostJobId: this.boostJobId,
            boostJobProofId: this.boostJobProofId,
            boostPowString: this.boostPowString.toString(),
            boostPowMetadata: this.boostPowMetadata ? this.boostPowMetadata.toString() : null,
            /*"boostData": {
                "additionaldata": this.boostPowMetadata.getAdditionalData(),
                "additionaldatautf8": this.boostPowMetadata.getAdditionalDataUtf8(),
                "category": this.boostPowString.category(),
                "content": this.boostPowString.contentHex(),
                "contentutf8": this.boostPowString.contentString(),
                "tag": this.boostPowMetadata.getTag(),
                "tagutf8": this.boostPowMetadata.getTagUtf8(),
                "usernonce": this.boostPowMetadata.getUserNonceUtf8(),
             },*/
        };
    }

}
