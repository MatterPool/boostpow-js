"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const lib_1 = require("../lib");
var bsv = require("bsv");
describe("endian types test", () => {
    it("should read and write Int32Little", () => __awaiter(void 0, void 0, void 0, function* () {
        let x = lib_1.Int32Little.fromNumber(12345);
        let y = lib_1.Int32Little.fromNumber(54321);
        let z = lib_1.Int32Little.fromNumber(-7777);
        chai_1.expect(lib_1.Int32Little.fromHex(x.hex)).to.eql(x);
        chai_1.expect(lib_1.Int32Little.fromHex(y.hex)).to.eql(y);
        chai_1.expect(lib_1.Int32Little.fromHex(z.hex)).to.eql(z);
        chai_1.expect(lib_1.Int32Little.fromHex(x.hex)).to.not.eql(y);
        chai_1.expect(lib_1.Int32Little.fromHex(y.hex)).to.not.eql(z);
        chai_1.expect(lib_1.Int32Little.fromHex(z.hex)).to.not.eql(x);
    }));
    it("should read and write UInt32Little and UInt32Big", () => __awaiter(void 0, void 0, void 0, function* () {
        let xl = lib_1.UInt32Little.fromNumber(12345);
        let yl = lib_1.UInt32Little.fromNumber(54321);
        chai_1.expect(lib_1.UInt32Little.fromHex(xl.hex)).to.eql(xl);
        chai_1.expect(lib_1.UInt32Little.fromHex(yl.hex)).to.eql(yl);
        chai_1.expect(lib_1.UInt32Little.fromHex(xl.hex)).to.not.eql(yl);
        chai_1.expect(lib_1.UInt32Little.fromHex(yl.hex)).to.not.eql(xl);
        let xb = lib_1.UInt32Big.fromNumber(12345);
        let yb = lib_1.UInt32Big.fromNumber(54321);
        chai_1.expect(lib_1.UInt32Big.fromHex(xb.hex)).to.eql(xb);
        chai_1.expect(lib_1.UInt32Big.fromHex(yb.hex)).to.eql(yb);
        chai_1.expect(lib_1.UInt32Big.fromHex(xb.hex)).to.not.eql(yb);
        chai_1.expect(lib_1.UInt32Big.fromHex(yb.hex)).to.not.eql(xb);
        chai_1.expect(xl.hex).to.not.eql(xb.hex);
        chai_1.expect(yl.hex).to.not.eql(yb.hex);
    }));
});
