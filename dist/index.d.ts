import { BoostPowStringModel } from './boost-pow-string-model';
export declare class BoostClient {
    options: any;
    constructor(providedOptions?: any);
    readonly BoostPowString: typeof BoostPowStringModel;
    setOptions(newOptions: any): void;
    static instance(newOptions?: any): BoostClient;
}
export declare function instance(newOptions?: any): BoostClient;
export declare var BoostPowString: typeof BoostPowStringModel;
