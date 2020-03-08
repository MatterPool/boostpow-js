'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

describe('BoostPowSimpleMiner. startMining. difficulty 1. Expect 3 to 10 hours to finish depending on cpu speed', () => {

   it('mine hello general', async () => {
      const debugLevel = 1; // Whether to show logs

      const job = index.BoostPowJob.fromObject({
         content: Buffer.from('Hello General').toString('hex'),
         diff: 1,
         category: '00000001',
         tag: '0000000000000000000000000000000000000001',
         metadata: '0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c',
         unique: '0000000000000001',
      });

      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '01',
         minerPubKey: '00',
         time: '00', // This gets randomized each iteration of mining loop
         minerNonce: '00', // This gets randomized each iteration of mining loop
         minerAddress: '00',
      });

      // This can take hours (3 to 20 hours) on a single core CPU at difficulty=1
      // 7 MH/second is targetted for 10 minutes.
      // Typical CPU can do 20 to 50 KH/second
      const result = index.BoostPowSimpleMiner.startMining(job, jobProof, debugLevel, function(c) {
         console.log('increment here', c);
      });
      console.log('Boost Pow String: ', result.boostPowString);
      console.log('Boost Pow Job: ', result.boostPowJob);
      console.log('Boost Pow Job Proof: ', result.boostPowJobProof);
   });

});
