"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boost_pow_job_model_1 = require("./boost-pow-job-model");
const cryptoRandomString = require("crypto-random-string");
class BoostPowSimpleMinerModel {
    /**
     * Start mining the Boost Job
     * @param debug Whether to log output
     */
    static startMining(job, jobProof, debugLevel = 0, increment, cancel) {
        let boostPowString;
        let counter = 0;
        while (!boostPowString) {
            jobProof.setNonce(cryptoRandomString({ length: 16 }));
            jobProof.setTime(Math.round((new Date()).getTime() / 1000).toString(16));
            boostPowString = boost_pow_job_model_1.BoostPowJobModel.tryValidateJobProof(job, jobProof, debugLevel == 2 ? true : false);
            if (counter++ % 500000 === 0) {
                if (debugLevel >= 1) {
                    console.log('Hashes checked: ', counter);
                }
                if (increment) {
                    increment(counter);
                }
            }
            if (cancel) {
                if (cancel()) {
                    return;
                }
            }
        }
        if (debugLevel >= 1) {
            console.log('Boost Pow String found: ', boostPowString.toString(), ', job: ', job.toObject(), ', jobProof: ', jobProof.toObject());
        }
        return {
            boostPowString: boostPowString,
            boostPowJob: job,
            boostPowJobProof: jobProof,
        };
    }
}
exports.BoostPowSimpleMinerModel = BoostPowSimpleMinerModel;
