import * as bsv from 'bsv'
import { BoostUtils } from '../boost-utils'

export class UInt32Big {
  constructor(
    private data: Buffer,
  ) {
  }

  static fromNumber(num: number): UInt32Big | undefined {
    let data = Buffer.alloc(4)
    if (num > 4294967295 || num < 0) {
      return
    }
    data.writeUInt32BE(num)
    return new UInt32Big(data)
  }

  static fromHex(hex: string): UInt32Big | undefined {
    if (hex.length != 8) {
      return
    }

    let data = Buffer.from(hex, 'hex');
    if (data.length != 4) {
      return
    }

    return new UInt32Big(data)
  }

  get hex(): string {
    return this.data.toString('hex')
  }

  get number(): number {
    return this.data.readUInt32BE()
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
