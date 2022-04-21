import * as bsv from '../bsv'
import { Utils } from '../utils'
import { Digest32 } from './digest32'

export class Bytes {
  constructor(
    private data: Buffer,
  ) {
  }

  static fromHex(b: string): Bytes {
    return new Bytes(Buffer.from(b, 'hex'))
  }

  get buffer(): Buffer {
    return this.data
  }

  get hex(): string {
    return this.buffer.toString('hex')
  }

  get string(): string {
    return this.utf8
  }

  get utf8(): string {
    return Utils.trimBufferString(this.buffer, true)
  }

  get hash256(): Digest32 {
    return new Digest32(bsv.crypto.Hash.sha256sha256(this.buffer))
  }

  get length(): number {
    return this.data.length
  }
}
