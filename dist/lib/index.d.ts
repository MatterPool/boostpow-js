import { BoostRequestParams } from '../models/boost-request-params';
import { BoostHeaderModel } from './boost-header-model';
import { BoostMagicStringModel } from './boost-magic-string-model';
export declare class BoostClient {
    options: any;
    constructor(providedOptions?: any);
    readonly BoostHeader: typeof BoostHeaderModel;
    readonly BoostMagicString: typeof BoostMagicStringModel;
    setOptions(newOptions: any): void;
    getBoostJobQuote(params: BoostRequestParams, callback?: Function): Promise<any>;
    static instance(newOptions?: any): BoostClient;
}
export declare function instance(newOptions?: any): BoostClient;
export declare var BoostHeader: typeof BoostHeaderModel;
export declare var MagicString: typeof BoostMagicStringModel;
