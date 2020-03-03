import { BoostHeaderModel } from './boost-header-model';
import { BoostMagicStringModel } from './boost-magic-string-model';
export declare class BoostClient {
    options: any;
    constructor(providedOptions?: any);
    readonly BoostHeader: typeof BoostHeaderModel;
    readonly MagicString: typeof BoostMagicStringModel;
    setOptions(newOptions: any): void;
    static instance(newOptions?: any): BoostClient;
}
export declare function instance(newOptions?: any): BoostClient;
export declare var BoostHeader: typeof BoostHeaderModel;
export declare var MagicString: typeof BoostMagicStringModel;
