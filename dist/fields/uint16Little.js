"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UInt16Little = void 0;
class UInt16Little {
    constructor(data) {
        this.data = data;
    }
    static fromNumber(num) {
        let data = Buffer.alloc(2);
        if (num <= 65536 && num >= 0) {
            data.writeUInt16LE(num);
        }
        return new UInt16Little(data);
    }
    hex() {
        return this.data.toString('hex');
    }
    number() {
        return this.data.readUInt16LE();
    }
    buffer() {
        return this.data;
    }
    string() {
        return this.hex();
    }
}
exports.UInt16Little = UInt16Little;
