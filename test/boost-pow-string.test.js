'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

describe('boost #BoostPowString.fromObject', () => {

   it('should correctly decode from object to string', async () => {
      const obj = index.BoostPowString.fromObject({
         hash: '0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca',
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         bits: 443192243,
         metadataHash: "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
         time: 1305200806,
         nonce: 2436437219,
         category: 1,
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

   it('should correctly decode First boost header mined by attila', async () => {
      const boostPowString = index.BoostPowString.fromString('01000000646c726f77206f6c6c65480000000000000000000000000000000000000000002a96153663424ecfd483872e26e59bb02fd781a965df6575c437b0848e27d8aca6c8cb4dffff001dae5172dc');

     // 01000000646c726f77206f6c6c65480000000000000000000000000000000000000000002a96153663424ecfd483872e26e59bb02fd781a965df6575c437b0848e27d8aca6c8cb4dffff001dae5172dc

     // 1000000646c726f77206f6c6c65480000000000000000000000000000000000000000002a96
     // 153663424ecfd483872e26e59bb02fd781a965df6575c437b0848e27d8aca6c8cb4dffff001dae5172dc

      expect(boostPowString.hash()).to.equal('0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc');
      expect(boostPowString.toObject()).to.eql({
         hash: '0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc',
         content: '00000000000000000000000000000000000000000048656c6c6f20776f726c64',
         bits: 486604799,
         difficulty: 1,
         metadataHash: "acd8278e84b037c47565df65a981d72fb09be5262e8783d4cf4e42633615962a",
         time: 1305200806,
         nonce: 3698479534,
         category: 1,
      })
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
         difficulty: 157416.40184364,
         metadataHash: "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
         time: 1305200806,
         nonce: 2436437219,
         category: 1,
      })
   });

});

describe('boost #BoostPowString validateProofOfWork ', () => {

   it('validProofOfWorkFromString success ', async () => {
      const result = index.BoostPowString.validProofOfWorkFromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
      expect(result).to.eql(true);
   });

   it('validProofOfWorkFromObject success ', async () => {
       const result = index.BoostPowString.validProofOfWorkFromObject({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         bits: 443192243,
         metadataHash: "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
         time: 1305200806,
         nonce: 2436437219,
         category: 1,
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
        metadataHash: "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
        time: 1305200806,
        nonce: 1,
        category: 1,
     });
     expect(result).to.eql(false);
  });

   it('getTargetDifficulty success', async () => {
      // Block header: 010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991
      // https://search.matterpool.io/block/0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca
      const boostPowString = index.BoostPowString.fromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
      const targetDiff = boostPowString.targetDifficulty(443192243);
      expect(targetDiff.toHex()).to.eql('6a93b30000000000000000000000000000000000000000000000');
   });

   it('getDifficulty success', async () => {
      const boostPowString = index.BoostPowString.fromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
      const diff = boostPowString.difficulty();
      expect(diff).to.eql(157416.40184364);
   });

});

describe('BoostPowString', () => {
   it('should get correctly accessors', async () => {
      const boostPowString = index.BoostPowString.fromString('01000000646c726f77206f6c6c65480000000000000000000000000000000000000000002a96153663424ecfd483872e26e59bb02fd781a965df6575c437b0848e27d8aca6c8cb4dffff001dae5172dc');
      expect(boostPowString.hash()).to.equal('0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc');
      expect(boostPowString.toObject()).to.eql({
         hash: '0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc',
         content: '00000000000000000000000000000000000000000048656c6c6f20776f726c64',
         bits: 486604799,
         difficulty: 1,
         metadataHash: "acd8278e84b037c47565df65a981d72fb09be5262e8783d4cf4e42633615962a",
         time: 1305200806,
         nonce: 3698479534,
         category: 1,
      });

      expect(boostPowString.contentHex()).to.eql('00000000000000000000000000000000000000000048656c6c6f20776f726c64');
      expect(boostPowString.contentBuffer().toString('hex')).to.eql('00000000000000000000000000000000000000000048656c6c6f20776f726c64');
      expect(boostPowString.contentString(false)).to.eql('\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000Hello world');
      expect(boostPowString.contentString()).to.eql('Hello world');
      expect(boostPowString.contentString(true)).to.eql('Hello world');
      expect(boostPowString.bits()).to.eql(486604799);
      expect(boostPowString.difficulty()).to.eql(1);
      expect(boostPowString.metadataHash()).to.eql('acd8278e84b037c47565df65a981d72fb09be5262e8783d4cf4e42633615962a');
      expect(boostPowString.time()).to.eql(1305200806);
      expect(boostPowString.nonce()).to.eql(3698479534);
      expect(boostPowString.category()).to.eql(1);
   });
});
