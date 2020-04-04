"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boost_pow_string_model_1 = require("./boost-pow-string-model");
const boost_pow_metadata_model_1 = require("./boost-pow-metadata-model");
const bsv = require("bsv");
class BoostSignalModel {
    constructor(boostPowString, boostPowMetadata, boostJobId, boostJobProofId) {
        this.boostPowString = boostPowString;
        this.boostPowMetadata = boostPowMetadata;
        this.boostJobId = boostJobId;
        this.boostJobProofId = boostJobProofId;
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
    }
    ;
    getBoostJobId() {
        return this.boostJobId;
    }
    getBoostJobProofId() {
        return this.boostJobProofId;
    }
    getBoostPowString() {
        return this.boostPowString;
    }
    getBoostMetadata() {
        return this.boostPowMetadata;
    }
    hash() {
        return this.boostPowString.hash();
    }
    difficulty() {
        return this.boostPowString.difficulty();
    }
    energy() {
        return this.difficulty();
    }
    content(hex) {
        if (hex) {
            return this.boostPowString.contentHex();
        }
        return this.boostPowString.contentString();
    }
    category(hex) {
        const category = this.boostPowString.category();
        const cat = Buffer.allocUnsafe(4);
        cat.writeUInt32BE(category, 0);
        if (hex) {
            return cat.toString('hex');
        }
        return cat.toString('utf8');
    }
    metadataHash() {
        return this.boostPowString.metadataHash();
    }
    time() {
        return this.boostPowString.time();
    }
    nonce() {
        return this.boostPowString.nonce();
    }
    tag(hex) {
        if (!this.boostPowMetadata) {
            return null;
        }
        if (hex) {
            return this.boostPowMetadata.getTag().toString('hex');
        }
        return this.boostPowMetadata.getTagUtf8();
    }
    userNonce(hex) {
        if (!this.boostPowMetadata) {
            return null;
        }
        if (hex) {
            return this.boostPowMetadata.getUserNonce().toString('hex');
        }
        return this.boostPowMetadata.getUserNonceUtf8();
    }
    additionalData(hex) {
        if (!this.boostPowMetadata) {
            return null;
        }
        if (hex) {
            return this.boostPowMetadata.getAdditionalData().toString('hex');
        }
        return this.boostPowMetadata.getAdditionalDataUtf8();
    }
    minerPubKeyHash() {
        if (!this.boostPowMetadata) {
            return null;
        }
        return this.boostPowMetadata.getMinerPubKeyHash().toString('hex');
    }
    toString() {
        let str = this.boostPowString.toString();
        if (this.boostPowMetadata) {
            str += this.boostPowMetadata;
        }
        return str;
    }
    toObject() {
        return {
            boostJobId: this.boostJobId,
            boostJobProofId: this.boostJobProofId,
            boostPowString: this.boostPowString.toString(),
            boostPowMetadata: this.boostPowMetadata ? this.boostPowMetadata.toString() : null,
            "boostData": {
                "additionaldata": this.boostPowMetadata.getAdditionalData(),
                "additionaldatautf8": this.boostPowMetadata.getAdditionalDataUtf8(),
                "category": this.boostPowString.category(),
                "content": this.boostPowString.contentHex(),
                "contentutf8": this.boostPowString.contentString(),
                "tag": this.boostPowMetadata.getTag(),
                "tagutf8": this.boostPowMetadata.getTagUtf8(),
                "usernonce": this.boostPowMetadata.getUserNonceUtf8(),
            },
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
    static fromHex(powStringAndOptionalMetadata, powMetadata, boostJobId, boostJobProofId) {
        if (!powStringAndOptionalMetadata) {
            throw new Error('invalid argument');
        }
        if (powStringAndOptionalMetadata.length < 160) {
            throw new Error('minimum 80 bytes hex');
        }
        if (powStringAndOptionalMetadata.length > 5000) {
            throw new Error('too large');
        }
        const boostPowString = boost_pow_string_model_1.BoostPowStringModel.fromHex(powStringAndOptionalMetadata.slice(0, 160));
        let boostPowMetadata;
        // Now get the powMetadata from the 2nd argument if provided
        if (powMetadata) {
            if (powMetadata.length > 5000) {
                throw new Error('too large metadata');
            }
            boostPowMetadata = boost_pow_metadata_model_1.BoostPowMetadataModel.fromHex(powMetadata);
        }
        else {
            // Just in case check the end of powStringAndOptionalMetadata
            if (powStringAndOptionalMetadata.length > 160) {
                boostPowMetadata = boost_pow_metadata_model_1.BoostPowMetadataModel.fromHex(powStringAndOptionalMetadata.slice(160));
            }
        }
        return new BoostSignalModel(boostPowString, boostPowMetadata, boostJobId, boostJobProofId);
    }
}
exports.BoostSignalModel = BoostSignalModel;
