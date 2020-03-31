import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
import * as bsv from 'bsv';

export class BoostSignalModel {
    private constructor(
        private boostPowString: BoostPowStringModel,
        private boostPowMetadata: BoostPowMetadataModel,
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
    public category(hex?: boolean): string {
        const category = this.boostPowString.category();
        const cat = Buffer.allocUnsafe(4);
        cat.writeUInt32LE(category, 0);
        if (hex) {
            return cat.toString('hex');
        }
        return cat.toString('utf8');
    }

    public metadataHash(): string {
        return this.boostPowString.metadataHash();
    }
    public time(): number {
        return this.boostPowString.time();
    }
    public nonce(): number {
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
        return this.toObject().toString();
    }
    public toObject(): any {
        return {
            boostPowString: this.boostPowString.toString(),
            boostPowMetadata: this.boostPowMetadata ? this.boostPowMetadata.toString() : null,
        };
    }

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
    static fromHex(powStringAndOptionalMetadata: string, powMetadata?: string) {
        if (!powStringAndOptionalMetadata) {
            throw new Error('invalid argument');
        }
        if (powStringAndOptionalMetadata.length < 160) {
            throw new Error('minimum 80 bytes hex');
        }

        if (powStringAndOptionalMetadata.length > 5000) {
            throw new Error('too large');
        }

        const boostPowString = BoostPowStringModel.fromHex(powStringAndOptionalMetadata.slice(0, 160));
        let boostPowMetadata;
        // Now get the powMetadata from the 2nd argument if provided
        if (powMetadata) {
            if (powMetadata.length > 5000) {
                throw new Error('too large metadata');
            }
            boostPowMetadata = BoostPowMetadataModel.fromHex(powMetadata);
        } else {
            // Just in case check the end of powStringAndOptionalMetadata
            if (powStringAndOptionalMetadata.length > 160) {
                boostPowMetadata = BoostPowMetadataModel.fromHex(powStringAndOptionalMetadata.slice(160));
            }
        }

        return new BoostSignalModel(boostPowString, boostPowMetadata);
    }

}