import * as bsv from 'bsv'
import { BoostUtils } from '../boost-utils'
import { Digest32 } from './digest32'

export class Bytes {
  constructor(
    private data: Buffer,
  ) {
  }

  get buffer(): Buffer {
    return this.data
  }

  get hex(): string {
    return new Buffer(this.buffer).toString('hex')
  }

  get string(): string {
    return this.utf8
  }

  get utf8(): string {
    return BoostUtils.trimBufferString(this.buffer, true)
  }

  get hash256(): Digest32 {
    return new Digest32(bsv.crypto.Hash.sha256sha256(this.buffer))
  }
}
