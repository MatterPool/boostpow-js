import { BoostHeaderModel } from './boost-header-model';
export declare class BoostClient {
    options: any;
    constructor(providedOptions?: any);
    readonly BoostHeader: typeof BoostHeaderModel;
    setOptions(newOptions: any): void;
    static instance(newOptions?: any): BoostClient;
}
export declare function instance(newOptions?: any): BoostClient;
export declare var BoostHeader: typeof BoostHeaderModel;
