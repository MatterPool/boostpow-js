import * as bsv from '../bsv'
import { Utils } from '../utils'
import { UInt32Little } from './uint32Little'

export class Difficulty {
  constructor(
    private diff: number,
  ) {
  }

  valid(): boolean {
    return this.diff > 0
  }

  static fromBits(bits: number): Difficulty {
    return new Difficulty(Utils.difficulty(bits))
  }

  static fromHex(hex: string): Difficulty | undefined {
    let bits = UInt32Little.fromHex(hex)
    if (bits) {
      return this.fromBits(bits.number)
    }
  }

  get number(): number {
    return this.diff
  }

  get bits(): number {
    return Utils.difficulty2bits(this.diff)
  }

  get buffer(): Buffer {
    return UInt32Little.fromNumber(this.bits).buffer
  }

  get hex(): string {
    return this.buffer.toString('hex')
  }

  get string(): string {
    return this.hex
  }

  get target(): bsv.crypto.BN {
    return Utils.getTargetDifficulty(this.bits)
  }
}
