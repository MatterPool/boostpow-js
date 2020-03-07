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
         console.log('loadBoostJob success ex', ex);
         expect(true).to.eql(false);
      }
   });
});