import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowJobModel } from './boost-pow-job-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
import { BoostPowSimpleMinerModel } from './boost-pow-simple-miner-model';
import { BoostUtils } from './boost-utils';
export declare class BoostGraphApi {
    options: any;
    constructor(providedOptions?: any);
    readonly BoostPowString: typeof BoostPowStringModel;
    readonly BoostPowJob: typeof BoostPowJobModel;
    readonly BoostPowJobProof: typeof BoostPowJobProofModel;
    readonly BoostPowMetadata: typeof BoostPowMetadataModel;
    readonly BoostPowSimpleMiner: typeof BoostPowSimpleMinerModel;
    loadBoostJob(txid: string, callback?: Function): Promise<any>;
    getScriptUtxos(scriptHash: string, callback?: Function): Promise<any>;
    setOptions(newOptions: any): void;
    static instance(newOptions?: any): BoostGraphApi;
}
export declare function Client(newOptions?: any): BoostGraphApi;
export declare function instance(newOptions?: any): BoostGraphApi;
export declare var BoostPowString: typeof BoostPowStringModel;
export declare var BoostPowJob: typeof BoostPowJobModel;
export declare var BoostPowJobProof: typeof BoostPowJobProofModel;
export declare var BoostPowMetadata: typeof BoostPowMetadataModel;
export declare var BoostPowSimpleMiner: typeof BoostPowSimpleMinerModel;
export declare var BoostUtilsHelper: typeof BoostUtils;
