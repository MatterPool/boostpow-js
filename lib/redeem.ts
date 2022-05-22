import * as bsv from './bsv'
import * as work from './work/proof'
import { Utils } from './utils'
import { UInt32Little } from './fields/uint32Little'
import { Int32Little } from './fields/int32Little'
import { UInt32Big } from './fields/uint32Big'
import { Digest20 } from './fields/digest20'
import { Bytes } from './fields/bytes'

/**
 * Responsible for redeem script proof that work was done.
 * This gets combined with BoostPowJobModel
 */
export class Redeem {

    private constructor(
        private Signature: Bytes,
        private MinerPubKey: Bytes,
        private Time: UInt32Little,
        private ExtraNonce1: UInt32Big,
        private ExtraNonce2: Bytes,
        private Nonce: UInt32Little,
        private MinerPubKeyHash?: Digest20,
        private GeneralPurposeBits?: Int32Little,
        // Optional tx information attached or not
        private Txid?: string,
        private Vin?: number,
        private SpentTxid?: string,
        private SpentVout?: number
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
    }): Redeem {

        if (params.signature.length > 166) {
            throw new Error('signature too large. Max 83 bytes.')
        }

        if (params.minerPubKey.length != 66 && params.minerPubKey.length != 130) {
            throw new Error('minerPubKey too large. Max 65 bytes.')
        }

        if (params.nonce.length > 8) {
            throw new Error('nonce too large. Max 4 bytes.')
        }

        if (params.extraNonce1.length > 8) {
            throw new Error('extraNonce1 too large. Max 4 bytes.')
        }

        let minerPubKey = Buffer.from(params.minerPubKey, 'hex')
        let minerPubKeyHash
        if (params.minerPubKeyHash) {
            if (params.minerPubKeyHash.length != 40) {
               throw new Error('minerPubKeyHash too large. Max 20 bytes.')
            }
            minerPubKeyHash = new Digest20(Buffer.from(params.minerPubKeyHash, 'hex'))
        }

        let generalPurposeBits
        if (params.generalPurposeBits) {
            if (params.generalPurposeBits.length > 8) {
              throw new Error('generalPurposeBits too large. Max 8 bytes.')
            }
            generalPurposeBits = new UInt32Little(Utils.createBufferAndPad(params.generalPurposeBits, 4, false))

            if (params.extraNonce2.length > 32) {
                throw new Error('extraNonce2 too large. Max 32 bytes.')
            }
        } else {
          if (params.extraNonce2.length != 16) {
              throw new Error('extraNonce2 too large. Max 8 bytes.')
          }
        }

        return new Redeem(
            new Bytes(Buffer.from(params.signature, 'hex')),
            new Bytes(minerPubKey),
            new UInt32Little(Utils.createBufferAndPad(params.time, 4, false)),
            new UInt32Big(Utils.createBufferAndPad(params.extraNonce1, 4,false)),
            new Bytes(Buffer.from(params.extraNonce2, 'hex')),
            new UInt32Little(Utils.createBufferAndPad(params.nonce, 4, false)),
            minerPubKeyHash,
            generalPurposeBits
        )
    }

    static fromSolution(
        signature: Bytes,
        minerPubKey: Bytes,
        solution: work.Solution,
        minerPubKeyHash?: Digest20): Redeem {
      return new Redeem(signature, minerPubKey,
        solution.Time, solution.ExtraNonce1, solution.ExtraNonce2, solution.Nonce,
        minerPubKeyHash, solution.GeneralPurposeBits)
    }

    get time(): UInt32Little {
      return this.Time
    }

    get generalPurposeBits(): Int32Little | undefined {
      return this.GeneralPurposeBits
    }

    get extraNonce1(): UInt32Big {
      return this.ExtraNonce1
    }

    get extraNonce2(): Bytes {
      return this.ExtraNonce2
    }

    get nonce(): UInt32Little {
      return this.Nonce
    }

    // Should add bsv.Address version and string version too
    get minerPubKeyHash(): Digest20 | undefined {
      return this.MinerPubKeyHash
    }

    get signature(): Bytes {
      return this.Signature
    }

    get minerPubKey(): Bytes {
      return this.MinerPubKey
    }

    isContract(): boolean {
      return !this.MinerPubKeyHash
    }

    isBounty(): boolean {
      return !!this.MinerPubKeyHash
    }

    toObject () {
      let obj = {
        // Output to string first, then flip endianness so we do not accidentally modify underlying buffer
        signature: this.signature.hex,
        minerPubKey: this.minerPubKey.hex,
        time: this.time.hex,
        nonce: this.nonce.hex,
        extraNonce1: this.extraNonce1.hex,
        extraNonce2: this.extraNonce2.hex
      }

      if (this.generalPurposeBits) {
        obj["generalPurposeBits"] = this.generalPurposeBits.hex
      }

      if (this.minerPubKeyHash) {
        obj["minerPubKeyHash"] = this.minerPubKeyHash.hex
      }

      return obj
    }

    private toScript(): bsv.Script {

      let buildOut = bsv.Script()

      // Add signature
      buildOut.add(this.signature.buffer)

      // Add miner pub key
      buildOut.add(this.minerPubKey.buffer)

      // Add miner nonce
      buildOut.add(this.nonce.buffer)

      // Add time
      buildOut.add(this.time.buffer)

      // Add extra nonce2
      buildOut.add(this.extraNonce2.buffer)

      // Add extra nonce 1
      buildOut.add(this.extraNonce1.buffer)

      if (this.generalPurposeBits) {
        buildOut.add(this.generalPurposeBits.buffer)
      }

      if (this.minerPubKeyHash) {
        buildOut.add(this.minerPubKeyHash.buffer)
      }

      return buildOut
    }

    static fromTransaction(tx: bsv.Transaction): Redeem | undefined {
        if (!tx) {
            return undefined
        }

        let inp = 0
        for (const input of tx.inputs) {
            try {
                return Redeem.fromScript(input.script, tx.hash, inp, input.prevTxId.toString('hex'), input.outputIndex)
            } catch (ex) {
                // Skip and try another output
            }
            inp++
        }

        return undefined
    }

    static fromRawTransaction(rawtx: string): Redeem | undefined {
        if (!rawtx || rawtx === '') {
            return undefined
        }

        const tx = new bsv.Transaction(rawtx)
        return Redeem.fromTransaction(tx)
    }

    private static fromScript(script: bsv.Script, txid?: string, vin?: number, spentTxid?: string, spentVout?: number): Redeem {
      let signature
      let minerPubKey
      let time
      let nonce
      let extraNonce1
      let extraNonce2
      let minerPubKeyHash
      let generalPurposeBits

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

          minerPubKeyHash = new Digest20(script.chunks[6].buf)

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
          ((script.chunks[4].buf && script.chunks[4].len <= 20) ||
              script.chunks[4].opcodenum == bsv.Opcode.OP_0 ||
              script.chunks[4].opcodenum == bsv.Opcode.OP_1NEGATE ||
              (script.chunks[4].opcodenum >= bsv.Opcode.OP_1 && script.chunks[6].opcodenum <= bsv.Opcode.OP_16)) &&

          // extra Nonce 1
          script.chunks[5].len &&

          // generalPurposeBits
          script.chunks[6].len &&

          // minerPubKeyHash
          script.chunks[7].len

      ) {

        generalPurposeBits = new UInt32Little(script.chunks[6].buf)
        minerPubKeyHash = new Digest20(script.chunks[7].buf)

      } else throw new Error('Not valid Boost Proof')

      signature = new Bytes(script.chunks[0].buf)
      minerPubKey = new Bytes(script.chunks[1].buf)
      nonce = new UInt32Little(script.chunks[2].buf)
      time = new UInt32Little(script.chunks[3].buf)

      extraNonce2 = new Bytes(Utils.fromOpCode(script.chunks[4]))
      extraNonce1 = new UInt32Big(script.chunks[5].buf)

      return new Redeem(
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
      )
    }

    static fromHex(asm: string, txid?: string, vin?: number, spentTxid?: string, spentVout?: number): Redeem {
        return Redeem.fromScript(new bsv.Script(asm), txid, vin, spentTxid, spentVout)
    }


    static fromASM(asm: string, txid?: string, vin?: number, spentTxid?: string, spentVout?: number): Redeem {
        return Redeem.fromScript(new bsv.Script.fromASM(asm), txid, vin, spentTxid, spentVout)
    }

    // Optional attached information if available
    get txInpoint(): {txid?: string, vin?: number} {
        return {
            txid: this.Txid,
            vin: this.Vin,
        }
    }
    // Optional attached information if available
    get txid(): string | undefined {
        return this.Txid
    }

    // Optional attached information if available
    get vin(): number | undefined {
        return this.Vin
    }

    get spentTxid(): string | undefined {
        return this.SpentTxid
    }

    // Optional attached information if available
    get spentVout(): number | undefined {
        return this.SpentVout
    }

    static fromASM2(str: string, txid?: string, vin?: number): Redeem {
        return Redeem.fromHex(str, txid, vin)
    }

    toString(): string {
        return this.toScript().toString()
    }

    toBuffer(): Bytes {
        return this.toScript().toBuffer()
    }

    static fromBuffer(b: Buffer): Redeem {
        return Redeem.fromScript(bsv.Script.fromBuffer(b))
    }

    static fromString(str: string, txid?: string, vin?: number): Redeem {
        return Redeem.fromHex(str, txid, vin)
    }
}
