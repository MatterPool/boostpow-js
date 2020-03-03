export declare class BoostMagicString {
    private _boostheader;
    private constructor();
    hash(): string;
    static fromBuffer(buf: any): BoostMagicString;
    static fromString(str: any): BoostMagicString;
    static fromObject(obj: any): BoostMagicString;
    toBuffer(): any;
    toString(): any;
    toObject(): any;
}
