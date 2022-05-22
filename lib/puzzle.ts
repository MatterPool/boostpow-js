import * as bsv from './bsv'
import * as work from './work/proof'
import { Job } from './job'
import { Output } from './output'
import { Redeem } from './redeem'
import { Digest32 } from './fields/digest32'
import { Digest20 } from './fields/digest20'
import { Bytes } from './fields/bytes'

// Puzzle represents a Boost output that has had a private key assigned to it.
// This may have happened before or after the output was created, depending on
// whether it has a contract or bounty format.
export class Puzzle {
  output: Output
  key: bsv.PrivateKey
  pubkey: Bytes
  _address: Digest20 | undefined

  constructor(output: Output, key: bsv.PrivateKey) {
    let pub = key.toPublicKey()
    let address: Digest20 = new Digest20(Buffer.from(bsv.Address.fromPublicKey(pub, key.network).toObject().hash, 'hex'))
    if (output.script.minerPubKeyHash) {
      if (!address.equals(output.script.minerPubKeyHash)) throw "invalid parameters"
    } else this._address = address
    this.output = output
    this.key = key
    this.pubkey = new Bytes(pub.toBuffer())
  }

  get address(): Digest20 {
    if (this._address) return this._address
    return <Digest20>this.output.script.minerPubKeyHash
  }

  get workPuzzle(): work.Puzzle {
    return Job.puzzle(this.output.script, this._address)
  }

  // create a redeem script for this output.
  redeem(
    solution: work.Solution,
    // the incomplete tx that will be signed (the input scripts are missing)
    incomplete_transaction: Buffer | bsv.Transaction,
    // the index of the input script that we are creating.
    input_index: number,
    sigtype = bsv.crypto.Signature.SIGHASH_ALL | bsv.crypto.Signature.SIGHASH_FORKID,
    flags = bsv.Script.Interpreter.SCRIPT_VERIFY_MINIMALDATA |
      bsv.Script.Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID |
      bsv.Script.Interpreter.SCRIPT_ENABLE_MAGNETIC_OPCODES |
      bsv.Script.Interpreter.SCRIPT_ENABLE_MONOLITH_OPCODES): Redeem {
    if (!new work.Proof(this.workPuzzle, solution).valid()) throw new Error('invalid solution')

    return Redeem.fromSolution(
      new Bytes(
        Buffer.concat([
          bsv.Transaction.Sighash.sign(
            new bsv.Transaction(incomplete_transaction), this.key, sigtype,
            input_index, this.output.script.toScript(),
            new bsv.crypto.BN(this.output.value), flags).toBuffer(),
          Buffer.from([sigtype & 0xff])
        ])), this.pubkey, solution, this._address)

  }
}
