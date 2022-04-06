import * as bsv from 'bsv'
import { Int32Little } from '../fields/int32Little'
import { UInt32Little } from '../fields/uint32Little'
import { UInt32Big } from '../fields/uint32Big'
import { Digest32 } from '../fields/digest32'
import { Bytes } from '../fields/bytes'
import { Difficulty } from '../fields/difficulty'
import { BoostUtils } from '../boost-utils'
import { PowString } from './string'
export { PowString } from './string'

// TODO the puzzle also needs to contain a Merkle branch but for Boost that is empty.
export class Puzzle {
  constructor(
    public Category: Int32Little,
    public Content: Digest32,
    public Difficulty: Difficulty,
    public MetaBegin: Bytes,
    public MetaEnd: Bytes,
    public Mask?: Int32Little) {}
}

export class Solution {
  constructor(
    public Time: UInt32Little,
    public ExtraNonce1: UInt32Big,
    public ExtraNonce2: Bytes,
    public Nonce: UInt32Little,
    public GeneralPurposeBits?: Int32Little) {}
}

export function meta(p: Puzzle, x: Solution): Bytes {
  return new Bytes(Buffer.concat([
    p.MetaBegin.buffer,
    x.ExtraNonce1.buffer,
    x.ExtraNonce2.buffer,
    p.MetaEnd.buffer
  ]))
}

export function pow_string(p: Puzzle, x: Solution): PowString | undefined {
  var category: Buffer

  if (p.Mask) {
    var generalPurposeBits = x.GeneralPurposeBits
    if (generalPurposeBits) {
      category = BoostUtils.writeInt32LE(
        (p.Category.number & p.Mask.number) |
          (generalPurposeBits.number & ~p.Mask.number))
    } else {
      return
    }
  } else if (x.GeneralPurposeBits) {
      return
  } else {
    category = p.Category.buffer
  }

  const boostPowMetadataCoinbaseString = meta(p, x)

  return new PowString(bsv.BlockHeader.fromBuffer(Buffer.concat([
    category,
    p.Content.buffer,
    boostPowMetadataCoinbaseString.hash256.buffer,
    x.Time.buffer,
    p.Difficulty.buffer,
    x.Nonce.buffer,
  ])))
}

// TODO the puzzle also needs to contain a Merkle branch but for Boost that is empty.
export class Proof {
  constructor(
    public Puzzle: Puzzle,
    public Solution: Solution) {}

  metadata(): Bytes {
    return meta(this.Puzzle, this.Solution)
  }

  string(): PowString | undefined {
    return pow_string(this.Puzzle, this.Solution)
  }

  valid(): boolean {
    let x = this.string()
    if (x) {
      return x.valid()
    }

    return false
  }
}
