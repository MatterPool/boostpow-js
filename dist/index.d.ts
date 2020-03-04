import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowJobModel } from './boost-pow-job';
export declare class BoostClient {
    options: any;
    constructor(providedOptions?: any);
    readonly BoostPowString: typeof BoostPowStringModel;
    setOptions(newOptions: any): void;
    static instance(newOptions?: any): BoostClient;
}
export declare function instance(newOptions?: any): BoostClient;
export declare var BoostPowString: typeof BoostPowStringModel;
export declare var BoostPowJob: typeof BoostPowJobModel;
