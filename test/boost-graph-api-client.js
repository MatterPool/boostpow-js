'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
describe('APIClient', () => {
   it('loadBoostJob success', async () => {
      try {
         const job = await index.Graph().loadBoostJob('debbd830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301');
         expect(job.toObject()).to.eql({
            content:'00000000000000000000000000000000000000000048656c6c6f20426f6f7374',
            diff: 1,
            category: '00000000',
            tag: '0000000000000000000000000000000000000000',
            metadata: '0000000000000000000000000000000000000000000000000000000000000000',
            unique: '0000000000000000'
         });
      } catch(ex) {
         expect(true).to.eql(false);
      }
   });

   it('loadBoostJob failure invalid boost output', async () => {
      try {
         await index.Graph().loadBoostJob('2e791e480b24ee0c727619b37c692f83ca65fd49b280e869ae59df13cffdee97');
         expect(true).to.eql(false);
      } catch(ex) {
         expect(ex).to.eql({
            success: false,
            code: 400,
            error: 'TX_INVALID_BOOST_OUTPUT',
            message: 'tx is not a valid boost output',
         });
      }
   });

   it('loadBoostJob failure invalid txid', async () => {
      try {
         await index.Graph().loadBoostJob('x');
         expect(true).to.eql(false);
      } catch(ex) {
         expect(ex).to.eql({
            success: false,
            code: 422,
            error: 'TXID_INVALID',
            message: 'txid invalid',
         });
      }
   });

   it('loadBoostJob failure not found', async () => {
      try {
         await index.Graph().loadBoostJob('deb2d830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301');
         expect(true).to.eql(false);
      } catch(ex) {
         expect(ex).to.eql({
            success: false,
            code: 404,
            error: '',
            message: ''
         });
         return;
      }
   });

   it('loadBoostJob failure not found', async () => {
      try {
         await index.Graph().loadBoostJob('deb2d830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301');
         expect(true).to.eql(false);
      } catch(ex) {
         expect(ex).to.eql({
            success: false,
            code: 404,
            error: '',
            message: ''
         });
         return;
      }
   });

   it('loadBoostJob and getBoostJobUnspentOutputs', async () => {
      const job = await index.Graph().loadBoostJob('dc36f3baa9b7e96827928760c07a160579b0a531814e3a3900c1c4112c4a92e7');
      const utxos = await index.Graph().getBoostJobUtxos(job.getScriptHash());
      delete utxos[0].confirmations;
      expect(utxos).to.eql([
         {
             "scripthash": "03b508a9da0879dd55619e06f5bd656696f77ba879aaa99e0eb22cedd7dd4846",
             "txid": "dc36f3baa9b7e96827928760c07a160579b0a531814e3a3900c1c4112c4a92e7",
             "vout": 0,
             "amount": 0.00004363,
             "satoshis": 4363,
             "value": 4363,
             "height": 625311,
             // "confirmations": 63,
             "outputIndex": 0
         }
     ]);
   });

   it('loadBoostJob and getBoostJobUnspentOutputs Capitalism quote', async () => {
      const job = await index.Graph().loadBoostJob('afe7bd76c5b4af66702368a5b08d36d8d546ee737cda636e3d7965ddc38feaed');
      const utxos = await index.Graph().getBoostJobUtxos(job.getScriptHash());
      delete utxos[0].confirmations;
      expect(utxos).to.eql([
         {
             "scripthash": "9d4294f7ab5b060180429f521e9ef1b9dd5d12ab214301e5b353105d8f0c25a7",
             "txid": "afe7bd76c5b4af66702368a5b08d36d8d546ee737cda636e3d7965ddc38feaed",
             "vout": 0,
             "amount": 0.00005077,
             "satoshis": 5077,
             "value": 5077,
             "height": 625396,
             // "confirmations": 63,
             "outputIndex": 0
         }
     ]);
   });

});