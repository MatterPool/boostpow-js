"use strict"
var expect = require("chai").expect
var index = require("..")

var bsv = require("bsv")

describe("endian types test", () => {
  it("should read and write Int32Little", async () => {
    let x = index.Int32Little.fromNumber(12345)
    let y = index.Int32Little.fromNumber(54321)
    let z = index.Int32Little.fromNumber(-7777)

    expect(index.Int32Little.fromHex(x.hex)).to.eql(x)
    expect(index.Int32Little.fromHex(y.hex)).to.eql(y)
    expect(index.Int32Little.fromHex(z.hex)).to.eql(z)

    expect(index.Int32Little.fromHex(x.hex)).to.not.eql(y)
    expect(index.Int32Little.fromHex(y.hex)).to.not.eql(z)
    expect(index.Int32Little.fromHex(z.hex)).to.not.eql(x)
  })

  it("should read and write UInt32Little and UInt32Big", async () => {
    let xl = index.UInt32Little.fromNumber(12345)
    let yl = index.UInt32Little.fromNumber(54321)

    expect(index.UInt32Little.fromHex(xl.hex)).to.eql(xl)
    expect(index.UInt32Little.fromHex(yl.hex)).to.eql(yl)

    expect(index.UInt32Little.fromHex(xl.hex)).to.not.eql(yl)
    expect(index.UInt32Little.fromHex(yl.hex)).to.not.eql(xl)

    let xb = index.UInt32Big.fromNumber(12345)
    let yb = index.UInt32Big.fromNumber(54321)

    expect(index.UInt32Big.fromHex(xb.hex)).to.eql(xb)
    expect(index.UInt32Big.fromHex(yb.hex)).to.eql(yb)

    expect(index.UInt32Big.fromHex(xb.hex)).to.not.eql(yb)
    expect(index.UInt32Big.fromHex(yb.hex)).to.not.eql(xb)

    expect(xl.hex).to.not.eql(xb.hex)
    expect(yl.hex).to.not.eql(yb.hex)
  })
})
