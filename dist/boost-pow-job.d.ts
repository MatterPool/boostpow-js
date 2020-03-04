export declare class BoostPowJobModel {
    private content;
    private diff;
    private category;
    private tag;
    private metadata;
    private unique;
    static operations: any[];
    private constructor();
    id(): string;
    static fromObject(params: {
        content: string;
        diff: number;
        category: number;
        tag: string;
        metadata: string;
        unique: number;
    }): BoostPowJobModel;
    static createBufferAndPad(buf: any, length: number): any;
    toObject(): {
        content: string;
        diff: number;
        category: number;
        tag: string;
        metadata: string;
        unique: number;
    };
    static difficulty2bits(difficulty: any): number;
    private getNumberHexBuffer;
    getTargetAsNumberBuffer(): any;
    toHex(): string;
    /**
     * Returns the target difficulty for this block
     * @param {Number} bits
     * @returns {BN} An instance of BN with the decoded difficulty bits
     */
    static getTargetDifficulty(bits: any): any;
    /**
     * @link https://en.bitcoin.it/wiki/Difficulty
     * @return {Number}
     */
    static getDifficulty(bits: any): number;
    static remainingOperationsMatchExactly(remainingChunks: any): boolean;
    static fromHex(asm: string): BoostPowJobModel;
    toASM(): string;
    static fromASM(asm: string): BoostPowJobModel;
    toString(): string;
    static fromString(str: string): BoostPowJobModel;
}
