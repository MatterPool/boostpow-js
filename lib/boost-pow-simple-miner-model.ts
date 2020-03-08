import * as bsv from 'bsv';
import { BoostPowJobModel } from './boost-pow-job-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
const cryptoRandomString = require('crypto-random-string');
import * as randomBytes from 'randombytes';

export class BoostPowSimpleMinerModel {

    /**
     *  Start mining the Boost Job
     * @param debug Whether to log output
     */
    static startMining(job: BoostPowJobModel, jobProof: BoostPowJobProofModel, debugLevel = 0, increment?: Function, cancel?: Function) {
        let boostPowString;
        let counter = 0;

        while (!boostPowString) {

            jobProof.setMinerNonce(randomBytes(16));
            jobProof.setTime(((new Date()).getTime() / 1000).toString(16))
            boostPowString = BoostPowJobModel.tryValidateJobProof(job, jobProof, debugLevel == 2 ? true : false);

            if (debugLevel >= 1) {
                if (counter++ % 1000000 === 0 ) {
                    console.log('Hashes checked: ', counter);
                }
            }
            if (increment) {
                increment(counter);
            }
            if (cancel) {
                if (cancel()) {
                    return;
                }
            }
        }
        if (debugLevel >= 1) {
            console.log('Boost Pow String found: ',
                boostPowString.toString(),
                ', job: ', job.toObject(),
                ', jobProof: ', jobProof.toObject()
            );
        }
        return {
            boostPowString: boostPowString,
            boostPowJob: job,
            boostPowJobProof: jobProof,
        };
    }
}