import * as bsv from 'bsv';
import { BoostPowJobModel } from './boost-pow-job-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
const cryptoRandomString = require('crypto-random-string');

export class BoostPowSimpleMinerModel {

    /**
     *  Start mining the Boost Job
     * @param debug Whether to log output
     */
    static startMining(debug = false) {
        let job;
        let boostPowString;
        let jobProof;
        let counter = 0;
        while (!boostPowString) {
            job = BoostPowJobModel.fromObject({
                content: Buffer.from('Hello world').toString('hex'),
                diff: 1,
                category: '00000001',
                tag: '0000000000000000000000000000000000000001',
                metadata: '0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c',
                unique: '0000000000000001',
            });

            jobProof = BoostPowJobProofModel.fromObject({
                signature: '01',
                minerPubKey: '00',
                time: '4dcbc8a6',
                minerNonce: cryptoRandomString({length: 16}),
                minerAddress: '00',
            });

            boostPowString = BoostPowJobModel.tryValidateJobProof(job, jobProof, true);

            if (debug) {
                if (counter++ % 100000 === 0 ) {
                    console.log('Hashes performed: ', counter);
                }
            }
        }
        if (debug) {
            console.log('Boost Pow String found: ',
                boostPowString.toString(),
                ', job: ', job.toObject(), ', jobProof: ', jobProof.toObject()
            );
        }
        return {
            boostPowString: boostPowString,
            boostPowJob: job,
            boostPowJobProof: jobProof,
        };
    }
}