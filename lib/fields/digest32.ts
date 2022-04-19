import * as bsv from '../bsv'
import { BoostUtils } from '../boost-utils'

export class Digest32 {
  constructor(
    private data: Buffer,
  ) {
  }

  static fromHex(x: string): Digest32 {
    return new Digest32(Buffer.from(x, 'hex').reverse())
  }

  // reverse because of a horrible convention that exists in Bitcoin
  // which got started due to stupid a bug long ago.
  get hex(): string {
    return Buffer.from(this.data).reverse().toString('hex')
  }

  get number(): bsv.crypto.BN {
    return new bsv.crypto.BN(this.hex, 'hex', 'be')
  }

  get buffer(): Buffer {
    return this.data
  }

  get string(): string {
    return this.utf8
  }

  get utf8(): string {
    return BoostUtils.trimBufferString(this.data, true)
  }
}
