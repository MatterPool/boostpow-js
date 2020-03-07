import { BoostPowJobModel } from './boost-pow-job-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
export declare class BoostPowSimpleMinerModel {
    /**
     *  Start mining the Boost Job
     * @param debug Whether to log output
     */
    static startMining(job: BoostPowJobModel, jobProof: BoostPowJobProofModel, debugLevel?: number): {
        boostPowString: any;
        boostPowJob: BoostPowJobModel;
        boostPowJobProof: BoostPowJobProofModel;
    };
}
