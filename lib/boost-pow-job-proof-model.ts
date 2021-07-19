import * as bsv from 'bsv';
import { BoostUtils } from './boost-utils';
import { UInt32Little } from './fields/uint32Little';
import { UInt32Big } from './fields/uint32Big';
import { UInt64Big } from './fields/uint64Big';
import { Digest20 } from './fields/digest20';
import { Bytes } from './fields/bytes';

/**
 * Responsible for redeem script proof that work was done.
 * This gets combined with BoostPowJobModel
 */
export class BoostPowJobProofModel {

    private constructor(
        private Signature: Bytes,
        private MinerPubKey: Bytes,
        private Time: UInt32Little,
        private ExtraNonce1: UInt32Big,
        private ExtraNonce2: UInt64Big,
        private Nonce: UInt32Little,
        private MinerPubKeyHash: Digest20,
        private GeneralPurposeBits?: UInt32Little,
        // Optional tx information attached or not
        private txid?: string,
        private vin?: number,
        private spentTxid?: string,
        private spentVout?: number
    ) {
    }

    static fromObject(params: {
        signature: string,
        minerPubKey: string,
        time: string,
        nonce: string,
        extraNonce1: string,
        extraNonce2: string,
        minerPubKeyHash?: string,
        generalPurposeBits?: string
    }): BoostPowJobProofModel {

        if (params.signature.length > 166) {
            throw new Error('signature too large. Max 83 bytes.')
        }

        if (params.minerPubKey.length != 66 && params.minerPubKey.length != 130) {
            throw new Error('minerPubKey too large. Max 65 bytes.');
        }

        if (params.nonce.length > 8) {
            throw new Error('nonce too large. Max 4 bytes.')
        }

        if (params.extraNonce1.length > 8) {
            throw new Error('extraNonce1 too large. Max 4 bytes.')
        }

        if (params.extraNonce2.length > 16) {
            throw new Error('extraNonce2 too large. Max 8 bytes.')
        }

        let minerPubKey = Buffer.from(params.minerPubKey, 'hex');
        let minerPubKeyHash: string;
        if (params.minerPubKeyHash) {
            if (params.minerPubKeyHash.length != 40) {
               throw new Error('minerPubKeyHash too large. Max 20 bytes.');
            }
            minerPubKeyHash = params.minerPubKeyHash;
        } else {
            minerPubKeyHash = bsv.crypto.hash.sha256ripemd160(minerPubKey).toString('hex');
        }

        let generalPurposeBits;
        if (params.generalPurposeBits) {
            if (params.generalPurposeBits.length > 8) {
              throw new Error('generalPurposeBits too large. Max 8 bytes.');
            }
            generalPurposeBits = new UInt32Little(BoostUtils.createBufferAndPad(params.generalPurposeBits, 4, false));
        }

        return new BoostPowJobProofModel(
            new Bytes(Buffer.from(params.signature, 'hex')),
            new Bytes(minerPubKey),
            new UInt32Little(BoostUtils.createBufferAndPad(params.time, 4, false)),
            new UInt32Big(BoostUtils.createBufferAndPad(params.extraNonce1, 4,false)),
            new UInt64Big(BoostUtils.createBufferAndPad(params.extraNonce2, 8, false)),
            new UInt32Little(BoostUtils.createBufferAndPad(params.nonce, 4, false)),
            new Digest20(Buffer.from(minerPubKeyHash, 'hex')),
            generalPurposeBits
        );
    }

    time(): UInt32Little {
        return this.Time;
    }

    generalPurposeBits(): UInt32Little | undefined {
        return this.GeneralPurposeBits;
    }

    extraNonce1(): UInt32Big {
        return this.ExtraNonce1;
    }

    extraNonce2(): UInt64Big {
        return this.ExtraNonce2;
    }

    nonce(): UInt32Little {
        return this.Nonce;
    }

    // Should add bsv.Address version and string version too
    minerPubKeyHash(): Digest20 {
        return this.MinerPubKeyHash;
    }

    signature(): Bytes {
        return this.Signature;
    }

    minerPubKey(): Bytes {
        return this.MinerPubKey;
    }

    toObject () {
        if (this.GeneralPurposeBits) {
          return {
              // Output to string first, then flip endianness so we do not accidentally modify underlying buffer
              signature: this.Signature.hex(),
              minerPubKey: this.MinerPubKey.hex(),
              time: this.Time.hex(),
              nonce: this.Nonce.hex(),
              extraNonce1: this.ExtraNonce1.hex(),
              extraNonce2: this.ExtraNonce2.hex(),
              generalPurposeBits: this.GeneralPurposeBits.hex(),
              minerPubKeyHash: this.MinerPubKeyHash.hex(),
          };
        } else {
          return {
              // Output to string first, then flip endianness so we do not accidentally modify underlying buffer
              signature: this.Signature.hex(),
              minerPubKey: this.MinerPubKey.hex(),
              time: this.Time.hex(),
              nonce: this.Nonce.hex(),
              extraNonce1: this.ExtraNonce1.hex(),
              extraNonce2: this.ExtraNonce2.hex(),
              minerPubKeyHash: this.MinerPubKeyHash.hex(),
          };
        }
    }

    toScript(): bsv.Script {

        let buildOut = bsv.Script();
        // Add signature
     buildOut.add(this.Signature.buffer());
       /* Buffer.concat([
            this.signature.toBuffer(),
            Buffer.from([sigtype & 0xff])
          ]*/

        // Add miner pub key
        buildOut.add(this.MinerPubKey.buffer());

        // Add miner nonce
        buildOut.add(this.Nonce.buffer());

        // Add time
        buildOut.add(this.Time.buffer());

        // Add extra nonce2
        buildOut.add(this.ExtraNonce2.buffer());

        // Add extra nonce 1
        buildOut.add(this.ExtraNonce1.buffer());

        if (this.GeneralPurposeBits) {
          buildOut.add(this.GeneralPurposeBits.buffer());
        }

        // Add miner address
        buildOut.add(this.MinerPubKeyHash.buffer());

        return buildOut;
    }

    static fromTransaction(tx: bsv.Transaction): BoostPowJobProofModel | undefined {
        if (!tx) {
            return undefined;
        }
        let inp = 0;
        for (const input of tx.inputs) {
            try {
                return BoostPowJobProofModel.fromScript(input.script, tx.hash, inp, input.prevTxId.toString('hex'), input.outputIndex); // spentTx, spentVout);
            } catch (ex) {
                // Skip and try another output
            }
            inp++;
        }
        return undefined;
    }

    static fromRawTransaction(rawtx: string): BoostPowJobProofModel | undefined {
        if (!rawtx || rawtx === '') {
            return undefined;
        }
        const tx = new bsv.Transaction(rawtx);
        return BoostPowJobProofModel.fromTransaction(tx);
    }

    static fromScript(script: bsv.Script, txid?: string, vin?: number, spentTxid?: string, spentVout?: number): BoostPowJobProofModel {
      let signature;
      let minerPubKey;
      let time;
      let nonce;
      let extraNonce1;
      let extraNonce2;
      let minerPubKeyHash;
      let generalPurposeBits;

      if (
          7 === script.chunks.length &&

          // signature
          script.chunks[0].len &&

          // minerPubKey
          script.chunks[1].len &&

          // nonce
          script.chunks[2].len &&

          // time
          script.chunks[3].len &&

          // extra Nonce 2
          script.chunks[4].len &&

          // extra Nonce 1
          script.chunks[5].len &&

          // minerPubKeyHash
          script.chunks[6].len

      ) {

          minerPubKeyHash = new Digest20(script.chunks[6].buf);

      } else if (

          8 === script.chunks.length &&

          // signature
          script.chunks[0].len &&

          // minerPubKey
          script.chunks[1].len &&

          // nonce
          script.chunks[2].len &&

          // time
          script.chunks[3].len &&

          // extra Nonce 2
          script.chunks[4].len &&

          // extra Nonce 1
          script.chunks[5].len &&

          // generalPurposeBits
          script.chunks[6].len &&

          // minerPubKeyHash
          script.chunks[7].len

      ) {

        generalPurposeBits = new UInt32Little(script.chunks[6].buf);
        minerPubKeyHash = new Digest20(script.chunks[7].buf);

      } else throw new Error('Not valid Boost Proof');

      signature = new Bytes(script.chunks[0].buf);
      minerPubKey = new Bytes(script.chunks[1].buf);
      nonce = new UInt32Little(script.chunks[2].buf);
      time = new UInt32Little(script.chunks[3].buf);

      extraNonce2 = new UInt32Big(script.chunks[4].buf);
      extraNonce1 = new UInt64Big(script.chunks[5].buf);

      return new BoostPowJobProofModel(
        signature,
        minerPubKey,
        time,
        extraNonce1,
        extraNonce2,
        nonce,
        minerPubKeyHash,
        generalPurposeBits,
        txid,
        vin,
        spentTxid,
        spentVout,
      );
    }

    static fromHex(asm: string, txid?: string, vin?: number, spentTxid?: string, spentVout?: number): BoostPowJobProofModel {
        return BoostPowJobProofModel.fromScript(new bsv.Script(asm), txid, vin, spentTxid, spentVout);
    }


    static fromASM(asm: string, txid?: string, vin?: number, spentTxid?: string, spentVout?: number): BoostPowJobProofModel {
        return BoostPowJobProofModel.fromScript(new bsv.Script.fromASM(asm), txid, vin, spentTxid, spentVout);
    }

    // Optional attached information if available
    getTxInpoint(): {txid?: string, vin?: number} {
        return {
            txid: this.txid,
            vin: this.vin,
        }
    }
    // Optional attached information if available
    getTxid(): string | undefined {
        return this.txid;
    }

    // Optional attached information if available
    getVin(): number | undefined {
        return this.vin;
    }

    getSpentTxid(): string | undefined {
        return this.spentTxid;
    }

    // Optional attached information if available
    getSpentVout(): number | undefined {
        return this.spentVout;
    }

    static fromASM2(str: string, txid?: string, vin?: number): BoostPowJobProofModel {
        return BoostPowJobProofModel.fromHex(str, txid, vin);
    }

    toString(): string {
        return this.toScript().toString();
    }

    toBuffer(): string {
        return this.toScript().toBuffer();
    }

    static fromString(str: string, txid?: string, vin?: number): BoostPowJobProofModel {
        return BoostPowJobProofModel.fromHex(str, txid, vin);
    }
}
