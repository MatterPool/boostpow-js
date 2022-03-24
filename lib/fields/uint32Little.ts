import * as bsv from 'bsv'
import { BoostUtils } from '../boost-utils'

export class UInt32Little {
  constructor(
    private data: Buffer,
  ) {
    this.data = data;
  }

  static fromNumber(num: number): UInt32Little {
    let data = Buffer.alloc(4)
    if (num <= 4294967295 && num >= 0) {
      data.writeUInt32LE(num)
    }
    return new UInt32Little(data)
  }

  static fromHex(hex: string): UInt32Little | undefined {
    if (hex.length != 8) {
      return
    }

    let data = Buffer.from(hex, 'hex');
    if (data.length != 4) {
      return
    }

    return new UInt32Little(data)
  }

  get hex(): string {
    return this.data.toString('hex')
  }

  get number(): number {
    return this.data.readUInt32LE()
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
