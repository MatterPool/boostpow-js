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
            error: 'tx is not a valid boost output',
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
            error: 'txid invalid',
            message: 'txid invalid',
         });
      }
   });

   it('loadBoostJob failure not found', async () => {
      try {
         // not found
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
});