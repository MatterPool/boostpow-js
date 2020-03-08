'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
describe('APIClient', () => {
   it('loadBoostJob success', async () => {
      try {
         const job = await index.Client().loadBoostJob('debbd830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301');
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
         await index.Client().loadBoostJob('2e791e480b24ee0c727619b37c692f83ca65fd49b280e869ae59df13cffdee97');
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
         await index.Client().loadBoostJob('x');
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
         await index.Client().loadBoostJob('deb2d830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301');
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
         await index.Client().loadBoostJob('deb2d830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301');
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

   it('loadBoostJob and getScriptUtxos', async () => {
      const job = await index.Client().loadBoostJob('dc36f3baa9b7e96827928760c07a160579b0a531814e3a3900c1c4112c4a92e7');
      const utxos = await index.Client().getScriptUtxos(job.getScriptHash());
      delete utxos.confirmations;
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
});