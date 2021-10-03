import * as bsv from 'bsv'
import { BoostUtils } from '../boost-utils'

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
}
