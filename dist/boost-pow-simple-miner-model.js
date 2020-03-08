"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boost_pow_job_model_1 = require("./boost-pow-job-model");
const cryptoRandomString = require('crypto-random-string');
const randomBytes = require("randombytes");
class BoostPowSimpleMinerModel {
    /**
     *  Start mining the Boost Job
     * @param debug Whether to log output
     */
    static startMining(job, jobProof, debugLevel = 0, increment, cancel) {
        let boostPowString;
        let counter = 0;
        while (!boostPowString) {
            jobProof.setMinerNonce(randomBytes(16));
            jobProof.setTime(((new Date()).getTime() / 1000).toString(16));
            boostPowString = boost_pow_job_model_1.BoostPowJobModel.tryValidateJobProof(job, jobProof, debugLevel == 2 ? true : false);
            if (debugLevel >= 1) {
                if (counter++ % 1000000 === 0) {
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
