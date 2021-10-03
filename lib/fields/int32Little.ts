import * as bsv from 'bsv'
import { BoostUtils } from '../boost-utils'

export class Int32Little {
  constructor(
    private data: Buffer,
  ) {
  }

  static fromNumber(num: number): Int32Little {
    let data = Buffer.alloc(4)
    if (num <= 2147483647 && num >= -2147483648) {
      data.writeInt32LE(num)
    }
    return new Int32Little(data)
  }

  get buffer(): Buffer {
    return this.data
  }

  get hex(): string {
    return this.buffer.toString('hex')
  }

  get number(): number {
    return this.buffer.readInt32LE()
  }

  get string(): string {
    return this.utf8
  }

  get utf8(): string {
    return BoostUtils.trimBufferString(this.buffer, true)
  }

}
