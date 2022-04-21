import { Utils } from '../utils'

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

  static fromHex(hex: string): Int32Little | undefined {
    if (hex.length != 8) {
      return
    }

    let data = Buffer.from(hex, 'hex');
    if (data.length != 4) {
      return
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
    return Utils.trimBufferString(this.buffer, true)
  }

}
