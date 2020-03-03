import * as bsv from 'bsv';
import { BoostHeaderModel } from './boost-header-model';

export class BoostMagicStringModel {
    private _boostheader;

    private constructor(boostheader: BoostHeaderModel) {
        // If a BoostHeaderModel can be constructed, then the POW is valid (it was already validated at constructor)
        this._boostheader = boostheader;

        // But let's check the Pow again, because we can.
        if (!this._boostheader.validProofOfWork()) {
            throw new Error('INVALID_POW');
        }
    }

    hash(): string {
        return this._boostheader.hash();
    }

    static validProofOfWorkFromBuffer(buf): boolean {
        const blockheader = bsv.BlockHeader.fromBuffer(buf);

        if (blockheader.validProofOfWork()) {
            return true;
        }
        return false;
    }

    static validProofOfWorkFromString(str): boolean {
        const blockheader = bsv.BlockHeader.fromString(str);

        if (blockheader.validProofOfWork()) {
            return true;
        }
        return false;
    }

    static validProofOfWorkFromObject(obj): boolean {
        const spoofedObj = {
            prevHash: obj.content,
            bits: obj.bits,
            version: obj.version,
            merkleRoot: obj.abstract,
            time: obj.time,
            nonce: obj.nonce,
        }
        const blockheader = bsv.BlockHeader.fromObject(spoofedObj);

        if (blockheader.validProofOfWork()) {
            return true;
        }
        return false;
    }

    static fromBuffer (buf) {
        return new BoostMagicStringModel(BoostHeaderModel.fromBuffer(buf));
    }

    static fromString(str) {
        return new BoostMagicStringModel(BoostHeaderModel.fromString(str));
    }

    static fromObject(obj) {
        return new BoostMagicStringModel(BoostHeaderModel.fromObject(obj));
    }

    toBuffer () {
        return this._boostheader.toBuffer();
    }

    toString () {
        return this._boostheader.toString();
    }

    toObject () {
        return this._boostheader.toObject();
    }
}