'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

const cryptoRandomString = require('crypto-random-string');


describe('boost #BoostPowString tryValidateJobProof', () => {

   it('tryValidateJobProof mini mining loop difficulty 1', async () => {
      /*
      let result;
      let counter = 0;

      while (!result && counter < 10000000000) {
         const job = index.BoostPowJob.fromObject({
            content: Buffer.from('Hello world').toString('hex'),
            diff: 1,
            category: '00000001',
            tag: '0000000000000000000000000000000000000001',
            metadata: '0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c',
            unique: '0000000000000001',
         });

         const jobProof = index.BoostPowJobProof.fromObject({
            signature: '01',
            minerPubKey: '00',
            time: '4dcbc8a6',
            minerNonce: cryptoRandomString({length: 16}), // '00000000913914e3',
            minerAddress: '00',
         });

         result = index.BoostPowJob.tryValidateJobProof(job, jobProof, true);
         if (counter++ % 100000 === 0 ) {
            console.log('Hashes done:', counter);
         }
      }
      */
   });

});
