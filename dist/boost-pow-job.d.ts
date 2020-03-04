export declare class BoostPowJobModel {
    private content;
    private diff;
    private category;
    private tag;
    private metadata;
    private time;
    private unique;
    private constructor();
    id(): string;
    static fromObject(params: {
        content: string;
        diff: number;
        category?: number;
        tag?: string;
        metadata?: string;
        time?: number;
        unique?: number;
    }): BoostPowJobModel;
    static createBufferAndPad(buf: any, length: number): any;
    toObject(): {
        content: string;
        diff: number;
        category: number;
        tag: string;
        metadata: string;
        time: number;
        unique: number;
    };
    private getBufferHex;
    private getNumberHex;
    private getTarget;
    private expandTarget;
    toScriptASM(): string;
}
