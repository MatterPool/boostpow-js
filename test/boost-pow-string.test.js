'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

describe('boost #BoostPowString.fromObject', () => {

   it('should correctly decode from object to string', async () => {
      const obj = index.BoostPowString.fromObject({
         hash: '0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca',
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         bits: 443192243,
         abstract: "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
         time: 1305200806,
         nonce: 2436437219,
         version: 1,
      });
      expect(obj.toString()).to.eql('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991')
   });
});


describe('boost #BoostPowString.fromString', () => {
   it('should fail empty or invalid hex string', async () => {
      const badHex = [
         '',
         null,
         undefined,
         1,
         '1',
         'x9',
         'abc!',
         0,
         'abc',
         '0000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991'
      ];
      for (const item of badHex) {
         try {
            index.BoostHeader.fromString(item);
         } catch (ex) {
            continue;
         }
         // Should never get here
         expect(true).to.equal(false);
      }
      expect(true).to.equal(true);
   });

   it('should correctly decode Bitcoin header', async () => {
      const boostPowString = index.BoostPowString.fromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
      expect(boostPowString.hash()).to.equal('0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca');
   });

   it('should correctly decode Bitcoin header but invalid target', async () => {
      try {
         index.BoostPowString.fromString('020000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
      } catch (ex) {
         expect(ex.message).to.equal('INVALID_POW');
         return;
      }
      // Should never get here
      expect(true).to.equal(false);
   });

   it('should correctly decode from string to object', async () => {
      const obj = index.BoostPowString.fromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
      expect(obj.toObject()).to.eql({
         hash: '0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca',
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         bits: 443192243,
         abstract: "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
         time: 1305200806,
         nonce: 2436437219,
         version: 1,
      })
   });

});


describe('boost #BoostMagicString validateProofOfWork ', () => {

   it('validProofOfWorkFromString success ', async () => {
      const result = index.BoostPowString.validProofOfWorkFromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
      expect(result).to.eql(true);
   });

   it('validProofOfWorkFromObject success ', async () => {
       const result = index.BoostPowString.validProofOfWorkFromObject({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         bits: 443192243,
         abstract: "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
         time: 1305200806,
         nonce: 2436437219,
         version: 1,
      });
      expect(result).to.eql(true);
   });

   it('validProofOfWorkFromBuffer success ', async () => {
      const buf = Buffer.from('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991', 'hex');
      const result = index.BoostPowString.validProofOfWorkFromBuffer(buf);
      expect(result).to.eql(true);
   });

   it('validProofOfWorkFromObject success', async () => {
      const result = index.BoostPowString.validProofOfWorkFromObject({
        content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
        bits: 443192243,
        abstract: "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
        time: 1305200806,
        nonce: 1,
        version: 1,
     });
     expect(result).to.eql(false);
  });

   it('getTargetDifficulty success', async () => {
      const boostPowString = index.BoostPowString.fromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
      const targetDiff = boostPowString.getTargetDifficulty(443192243);
      expect(targetDiff.toHex()).to.eql('6a93b30000000000000000000000000000000000000000000000');
   });

   it('getDifficulty success', async () => {
      const boostPowString = index.BoostPowString.fromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
      const diff = boostPowString.getDifficulty();
      expect(diff).to.eql(157416.40184364);
   });

});
