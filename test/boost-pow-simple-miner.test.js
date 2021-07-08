'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');

describe('BoostPowSimpleMiner. startMining. difficulty 1. Expect 3 to 10 hours to finish depending on cpu speed', () => {

   it('mine hello world', async () => {
      const debugLevel = 1; // Whether to show logs
      //const job = await index.Graph().loadBoostJob('4aef0afa290b0850e5f60d9830e6c261f6332abaa1d9d06140fa708d8bbcf3f4');
       let job = index.BoostPowJob.fromObject({
           content: index.BoostUtilsHelper.createBufferAndPad('hello animal', 32,true).reverse().toString('hex'),
           diff: 0.0001,
           category: index.BoostUtilsHelper.createBufferAndPad("04d2",4,true).toString('hex'),
           tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
           additionalData: index.BoostUtilsHelper.createBufferAndPad('this is more additionalData', 32).reverse().toString('hex'),
           userNonce: index.BoostUtilsHelper.createBufferAndPad('01c8', 4).reverse().toString('hex')
       });
      const privKey = bsv.PrivateKey.fromRandom();
      const capital = Buffer.from('Capitalists can spend more energy than socialists.', 'utf8');
      console.log('sha256', bsv.crypto.Hash.sha256(capital).toString('hex'));
      const address = privKey.toAddress();
      console.log('job', job.toObject());
      console.log('Private key and address', privKey, privKey.toPublicKey().toBuffer().toString('hex'), privKey.toPublicKey().toBuffer(), address, address.toBuffer());
      // const jobProof = index.BoostPowJobProof.fromObject({
      //   signature: '01',
      //   minerPubKey: privKey.toPublicKey().toBuffer(),
      //   time: '00', // This gets randomized each iteration of mining loop
      //   minerNonce: '00', // This gets randomized each iteration of mining loop
      //   minerAddress: address.toBuffer()
      //});
      const jobProof = index.BoostPowJobProof.fromObject({ signature:
         '0000000000000000000000000000000000000000000000000000000000000001',
        minerPubKey:
         '0511ec53f1cfcb0b348b8349b940900672259a46b78807b80e07aa846f506d32',
        time: '00000000',
        nonce: '00000000',
        extraNonce1: '00000000',
        extraNonce2: '00000000',
        minerPubKeyHash: 'a0aa1de2a8c424fa20cf453101125e37d8ac3cf0' });

      console.log('jobProof Init', jobProof.toObject());
      // This can take hours (3 to 20 hours) on a single core CPU at difficulty=1
      // 7 MH/second is targetted for 10 minutes.
      // Typical CPU can do 20 to 50 KH/second
      const result = index.BoostPowSimpleMiner.startMining(job, jobProof, debugLevel, function(c) {
         console.log('Hashes checked:', c);
      });
      console.log('Boost Pow String: ', result.boostPowString);
      console.log('Boost Pow Job: ', result.boostPowJob);
      console.log('Boost Pow Job Proof: ', result.boostPowJobProof);
   });
});
