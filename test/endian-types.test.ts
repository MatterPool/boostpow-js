
import { expect } from 'chai'

import { Int32Little, UInt32Little, UInt32Big } from '../lib'

var bsv = require("bsv")

describe("endian types test", () => {
  it("should read and write Int32Little", async () => {
    let x = Int32Little.fromNumber(12345)
    let y = Int32Little.fromNumber(54321)
    let z = Int32Little.fromNumber(-7777)

    expect(Int32Little.fromHex(x.hex)).to.eql(x)
    expect(Int32Little.fromHex(y.hex)).to.eql(y)
    expect(Int32Little.fromHex(z.hex)).to.eql(z)

    expect(Int32Little.fromHex(x.hex)).to.not.eql(y)
    expect(Int32Little.fromHex(y.hex)).to.not.eql(z)
    expect(Int32Little.fromHex(z.hex)).to.not.eql(x)
  })

  it("should read and write UInt32Little and UInt32Big", async () => {
    let xl = UInt32Little.fromNumber(12345)
    let yl = UInt32Little.fromNumber(54321)

    expect(UInt32Little.fromHex(xl.hex)).to.eql(xl)
    expect(UInt32Little.fromHex(yl.hex)).to.eql(yl)

    expect(UInt32Little.fromHex(xl.hex)).to.not.eql(yl)
    expect(UInt32Little.fromHex(yl.hex)).to.not.eql(xl)

    let xb: UInt32Big = UInt32Big.fromNumber(12345)
    let yb = UInt32Big.fromNumber(54321)

    expect(UInt32Big.fromHex(xb.hex)).to.eql(xb)
    expect(UInt32Big.fromHex(yb.hex)).to.eql(yb)

    expect(UInt32Big.fromHex(xb.hex)).to.not.eql(yb)
    expect(UInt32Big.fromHex(yb.hex)).to.not.eql(xb)

    expect(xl.hex).to.not.eql(xb.hex)
    expect(yl.hex).to.not.eql(yb.hex)
  })
})
