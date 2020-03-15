'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');

describe('boost #BoostPowJob create various getters and setters', () => {

   it('should be valid minimal', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 157416.40184364,
      });

      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: Buffer.from('00000000000000000000000000000000000000000068656c6c6f20776f726c64', 'hex').toString('hex'),
         diff: 157416.40184364,
         category: "00000000",
         tag: '0000000000000000000000000000000000000000',
         additionalData: "0000000000000000000000000000000000000000000000000000000000000000",
         userNonce: "00000000",
      })
   });

   it('should output script compatible with MB and Relay', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 157416.40184364,
      });

      const jobObj = job.toASM();
      expect(jobObj).to.eql('626f6f7374706f77 OP_DROP 00000000 646c726f77206f6c6c6568000000000000000000000000000000000000000000 b3936a1a 0000000000000000000000000000000000000000 00000000 0000000000000000000000000000000000000000000000000000000000000000 OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });

   it('should be valid full', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 157416.40184364,
         // Optional fields below
         category: '04d2',
         tag: 'animals',
         additionalData: 'additionalData here',
         // Optional and auto-generated
         userNonce: '913914e3',
      });

      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: index.BoostUtilsHelper.createBufferAndPad('animals', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('additionalData here', 32).reverse().toString('hex'),
         userNonce: '913914e3',
      });
      // console.log('------', index.BoostUtilsHelper.createBufferAndPad('additionalData here', 32).reverse().toString('hex'));
      expect(jobObj).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000006164646974696f6e616c446174612068657265',
         userNonce: '913914e3',
      });
   });

   it('should be valid full from object with hex fields', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000006164646974696f6e616c446174612068657265',
         userNonce: '913914e3',
      });

      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: index.BoostUtilsHelper.createBufferAndPad('animals', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('additionalData here', 32).reverse().toString('hex'),
         userNonce: '913914e3',
      });

      expect(jobObj).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000006164646974696f6e616c446174612068657265',
         userNonce: '913914e3',
      });
   });

   it('should generate output script Hex', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000006164646974696f6e616c446174612068657265',
         userNonce: '913914e3',
      });

      const outputScript = job.toHex();
      expect(outputScript).to.eql('08626f6f7374706f7775043201000020646c726f77206f6c6c656800000000000000000000000000000000000000000004b3936a1a14736c616d696e610000000000000000000000000004e3143991206572656820617461446c616e6f697469646461000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b557a8254887e557a8254887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976aa6c88ac');

      const jobFromHex = index.BoostPowJob.fromHex(outputScript);

      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000006164646974696f6e616c446174612068657265',
         userNonce: '913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000006164646974696f6e616c446174612068657265',
         userNonce: '913914e3',
      });

      expect(outputScript).to.eql('08626f6f7374706f7775043201000020646c726f77206f6c6c656800000000000000000000000000000000000000000004b3936a1a14736c616d696e610000000000000000000000000004e3143991206572656820617461446c616e6f697469646461000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b557a8254887e557a8254887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976aa6c88ac');
   });


   it('should generate output script toString', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '0132',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

      const outputScript = job.toString();
      const jobFromHex = index.BoostPowJob.fromString(outputScript);
      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

      expect(outputScript).to.eql('8 0x626f6f7374706f77 OP_DROP 4 0x32010000 32 0x646c726f77206f6c6c6568000000000000000000000000000000000000000000 4 0xb3936a1a 20 0x736c616d696e6100000000000000000000000000 4 0xe3143991 32 0x6572656820617461646174656d00000000000000000000000000000000000000 OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });

   it('should generate output script ASM', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

      // Why the HECK does toString() work for fromASM, but toASM into fromASM does not?? Argghhh! bsv.js!
      const outputScript = job.toASM();
      const jobFromHex = index.BoostPowJob.fromASM(outputScript);
      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

      expect(outputScript).to.eql('626f6f7374706f77 OP_DROP 32010000 646c726f77206f6c6c6568000000000000000000000000000000000000000000 b3936a1a 736c616d696e6100000000000000000000000000 e3143991 6572656820617461646174656d00000000000000000000000000000000000000 OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
      expect(job.toASM()).to.eql('626f6f7374706f77 OP_DROP 32010000 646c726f77206f6c6c6568000000000000000000000000000000000000000000 b3936a1a 736c616d696e6100000000000000000000000000 e3143991 6572656820617461646174656d00000000000000000000000000000000000000 OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });

   it('should generate same formatted bits as bitcoin block 0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

      const outputScript = job.toString();
      const jobFromHex = index.BoostPowJob.fromString(outputScript);
      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });


      expect(outputScript).to.eql('8 0x626f6f7374706f77 OP_DROP 4 0x01000000 32 0x9500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b000000000000 4 0xb3936a1a 20 0x736c616d696e6100000000000000000000000000 4 0xe3143991 32 0x6572656820617461646174656d00000000000000000000000000000000000000 OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });

   it('should return error for too large and invalid values. content', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '330000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 157416.40184364,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
            userNonce: '913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: content too large. Max 32 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });

   it('should return error for too large and invalid values. diff', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: null,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
            userNonce: '913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: diff must be a number starting at 1. Max 4 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });
   it('should return error for too large and invalid values. category', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '2300000001',
            tag: '00000000000000000000000000616e696d616c73',
            additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
            userNonce: '913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: category too large. Max 4 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });

   it('should return error for too large and invalid values. tag', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '00000001',
            tag: '3200000000000000000000000000616e696d616c73',
            additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
            userNonce: '913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: tag too large. Max 20 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });
   it('should return error for too large and invalid values. additionalData', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            additionalData: '33000000000000000000000000000000000000006d657461646174612068657265',
            userNonce: '913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: additionalData too large. Max 32 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });

   it('should return error for too large and invalid values. userNonce', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
            userNonce: '3300000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: userNonce too large. Max 4 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });
});


describe('boost #BoostPowString tryValidateJobProof', () => {

   it('tryValidateJobProof failure with sample data', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c',
         userNonce: '913914e3',
      });

      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '00',
         minerPubKey: '00',
         extraNonce1: '4dcbc8a6',
         extraNonce2: '4dcbc8a6',
         time: '4dcbc8a6',
         nonce: '913914e3',
         minerPubKeyHash: '00',
      });

      const result = index.BoostPowJob.tryValidateJobProof(job, jobProof);

      expect(result).to.eql(null);
   });

});

describe('BoostPowJob', () => {
   it('should correctly load from fromTransaction', async () => {
      const job = index.BoostPowJob.fromTransaction(new bsv.Transaction('010000000112eff892f1d239d680fa01479fd6287711f1af7b03b7826415f582250919cb42030000006b483045022100fa0a3677fd870c48db4094c350cd4532904f3cef5bb0d964bc8f4f4fc3e9044802204dd66952074f9c080925abaeec0cdcc5bbb809472227c4b27e4c6eae8aeb5e04412103ebae722891c60cad85358fde5aa0bc8b9b9d28272e89e4808e4ffe81831fad16ffffffff01941f000000000000d408626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b557a8254887e557a8254887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976aa6c88ac00000000'));
      expect(job.toObject()).to.eql({
         content: '8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835',
         diff: 1,
         category: '00000000',
         tag: '0000000000000000000000000000000000000000',
         additionalData: '0000000000000000000000000000000000000000000000000000000000000000',
         userNonce: '00000000',
      });
   });
});

describe('BoostPowJob', () => {
   it('should correctly load from fromTransaction', async () => {
      const job = index.BoostPowJob.fromRawTransaction('010000000112eff892f1d239d680fa01479fd6287711f1af7b03b7826415f582250919cb42030000006b483045022100fa0a3677fd870c48db4094c350cd4532904f3cef5bb0d964bc8f4f4fc3e9044802204dd66952074f9c080925abaeec0cdcc5bbb809472227c4b27e4c6eae8aeb5e04412103ebae722891c60cad85358fde5aa0bc8b9b9d28272e89e4808e4ffe81831fad16ffffffff01941f000000000000d408626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b557a8254887e557a8254887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976aa6c88ac00000000');
      expect(job.toObject()).to.eql({
         content: '8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835',
         diff: 1,
         category: '00000000',
         tag: '0000000000000000000000000000000000000000',
         additionalData: '0000000000000000000000000000000000000000000000000000000000000000',
         userNonce: '00000000',
      });
   });
});


describe('BoostPowJob', () => {
   it('should correctly set txid if provided from all loaders', async () => {
      let job

      job = index.BoostPowJob.fromRawTransaction('010000000112eff892f1d239d680fa01479fd6287711f1af7b03b7826415f582250919cb42030000006b483045022100fa0a3677fd870c48db4094c350cd4532904f3cef5bb0d964bc8f4f4fc3e9044802204dd66952074f9c080925abaeec0cdcc5bbb809472227c4b27e4c6eae8aeb5e04412103ebae722891c60cad85358fde5aa0bc8b9b9d28272e89e4808e4ffe81831fad16ffffffff01941f000000000000d408626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b557a8254887e557a8254887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976aa6c88ac00000000');
      expect(job.getTxOutpoint()).to.eql({
         txid: '4aef0afa290b0850e5f60d9830e6c261f6332abaa1d9d06140fa708d8bbcf3f4',
         vout: 0,
         value: 8084,
      });

      job = index.BoostPowJob.fromObject({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c',
         userNonce: '913914e3',
      }, '32617d4a0477a15cabf65e3731c8cf604861956826bdf3338e346c7dacdd5a5c', 0)

      expect(job.getTxOutpoint()).to.eql({
         txid: undefined,
         vout: undefined,
         value: undefined,
      });

      expect(job.toASM()).to.eql('626f6f7374706f77 OP_DROP 01000000 9500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b000000000000 b3936a1a 736c616d696e6100000000000000000000000000 e3143991 6cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600e OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');

      job = index.BoostPowJob.fromASM('626f6f7374706f77 OP_DROP 01000000 9500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b000000000000 b3936a1a 736c616d696e6100000000000000000000000000 e3143991 6cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600e OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG', '32617d4a0477a15cabf65e3731c8cf604861956826bdf3338e346c7dacdd5a5c', 1, 123)

      expect(job.getTxOutpoint()).to.eql({
         txid: '32617d4a0477a15cabf65e3731c8cf604861956826bdf3338e346c7dacdd5a5c',
         vout: 1,
         value: 123
      });

      expect(job.getTxid()).to.eql('32617d4a0477a15cabf65e3731c8cf604861956826bdf3338e346c7dacdd5a5c');
      expect(job.getVout()).to.eql(1);

      job = index.BoostPowJob.fromASM('626f6f7374706f77 OP_DROP 01000000 9500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b000000000000 b3936a1a 736c616d696e6100000000000000000000000000 e3143991 6cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600e OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG', '32617d4a0477a15cabf65e3731c8cf604861956826bdf3338e346c7dacdd5a5c')

      expect(job.getTxOutpoint()).to.eql({
         txid: '32617d4a0477a15cabf65e3731c8cf604861956826bdf3338e346c7dacdd5a5c',
         vout: undefined,
         value: undefined
      });

      job = index.BoostPowJob.fromString('8 0x626f6f7374706f77 OP_DROP 4 0x6c6c6962 32 0x6c616d696e61206f6c6c65680000000000000000000000000000000000000000 4 0xb6300c1c 20 0x6761742061207369207369687400000000000000 4 0xc8010000 32 0x617461446c616e6f6974696464612065726f6d20736920736968740000000000 OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG')

      expect(job.getTxOutpoint()).to.eql({
         txid: undefined,
         vout: undefined,
         value: undefined
      });

      expect(job.getTxid()).to.eql(undefined);
      expect(job.getVout()).to.eql(undefined);
      expect(job.getValue()).to.eql(undefined);

   });

   it('should correctly get content and buffers as appropriate', async () => {
      const job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad('hello animal', 32).reverse().toString('hex'),
         diff: 21,
         category: index.BoostUtilsHelper.createBufferAndPad('bill', 4).reverse().toString('hex'),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('this is more additionalData', 32).reverse().toString('hex'),
         userNonce: index.BoostUtilsHelper.createBufferAndPad('01c8', 4).reverse().toString('hex')
      });

      expect(job.getScriptHash()).to.eql('461e2abc1bb3f6b845edd26866a245d95627f2af351286dfb57b71ad8941751a');
      expect(job.getId()).to.eql('461e2abc1bb3f6b845edd26866a245d95627f2af351286dfb57b71ad8941751a');
      expect(job.getDiff()).to.eql(21);
      expect(job.getUserNonceBuffer().toString('hex')).to.eql('c8010000');
      expect(job.getUserNonceHex()).to.eql('000001c8');
      expect(job.getUserNonce()).to.eql(456);

      expect(job.getContentString()).to.eql('hello animal');
      expect(job.getContentBuffer().toString('hex')).to.eql('6c616d696e61206f6c6c65680000000000000000000000000000000000000000');
      expect(job.getContentHex()).to.eql('000000000000000000000000000000000000000068656c6c6f20616e696d616c');

      expect(job.getTagString()).to.eql('this is a tag');
      expect(job.getTagBuffer().toString('hex')).to.eql('6761742061207369207369687400000000000000');
      expect(job.getTagHex()).to.eql('0000000000000074686973206973206120746167');

      expect(job.getCategoryString()).to.eql('bill');
      expect(job.getCategoryBuffer().toString('hex')).to.eql('6c6c6962');
      expect(job.getCategoryHex()).to.eql('62696c6c');

      expect(job.getAdditionalDataString()).to.eql('this is more additionalData');
      expect(job.getAdditionalDataBuffer().toString('hex')).to.eql('617461446c616e6f6974696464612065726f6d20736920736968740000000000');
      expect(job.getAdditionalDataHex()).to.eql('000000000074686973206973206d6f7265206164646974696f6e616c44617461');

      expect(job.toString()).to.eql('8 0x626f6f7374706f77 OP_DROP 4 0x6c6c6962 32 0x6c616d696e61206f6c6c65680000000000000000000000000000000000000000 4 0xb6300c1c 20 0x6761742061207369207369687400000000000000 4 0xc8010000 32 0x617461446c616e6f6974696464612065726f6d20736920736968740000000000 OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');


   });

   it('should correctly match up forms of variables for pow string and pow job', async () => {
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

      const job = index.BoostPowJob.fromHex(
         index.BoostPowJob.fromASM(
            index.BoostPowJob.fromObject(
            {
               content: '00000000000000000000000000000000000000000048656c6c6f20776f726c64',
               diff: 1,
               category: '01',
               tag:  '02',
               additionalData: '03',
               userNonce: '44',
            }).toASM()
         ).toHex()
      );

      expect(boostPowString.bits()).to.eql(486604799);
      expect(job.bits()).to.eql(486604799);
      expect(boostPowString.bits().toString(16)).to.eql('1d00ffff');
      expect(job.bits().toString(16)).to.eql('1d00ffff');
      expect(boostPowString.difficulty()).to.eql(1);
      expect(job.getDifficulty()).to.eql(1);
   });

   it('should correctly match target and bits for known bitcoin header 0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca', async () => {
      const job = index.BoostPowJob.fromHex(
         index.BoostPowJob.fromASM(
            index.BoostPowJob.fromObject(
            {
               content: '00000000000000000000000000000000000000000048656c6c6f20776f726c64',
               diff: 157416.4018436489,
               category: '01',
               tag:  '02',
               additionalData: '03',
               userNonce: '44',
            }).toASM()
         ).toHex()
      );
      expect(job.bits()).to.eql(443192243);
      expect(job.bits().toString(16)).to.eql('1a6a93b3');
      expect(job.getDifficulty()).to.eql(157416.40184364);
      expect(index.BoostPowJob.hexBitsToDifficulty('1a6a93b3')).to.eql(157416.40184364);
   });

   it('should correctly get bits and target and category number', async () => {

      const prodBitsSample = index.BoostPowJob.hexBitsToDifficulty('1802f15b');
      expect(prodBitsSample).to.eql(373622670066.215);

   });


   it('should correctly get content and buffers as appropriate', async () => {
      const job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad('hello animal', 32).reverse().toString('hex'),
         diff: 21,
         category: index.BoostUtilsHelper.createBufferAndPad('bill', 4).reverse().toString('hex'),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('this is more additionalData', 32).reverse().toString('hex'),
         userNonce: index.BoostUtilsHelper.createBufferAndPad('01c8', 4).reverse().toString('hex')
      });

      expect(job.toString()).to.eql('8 0x626f6f7374706f77 OP_DROP 4 0x6c6c6962 32 0x6c616d696e61206f6c6c65680000000000000000000000000000000000000000 4 0xb6300c1c 20 0x6761742061207369207369687400000000000000 4 0xc8010000 32 0x617461446c616e6f6974696464612065726f6d20736920736968740000000000 OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
      const str = job.toString();
      expect(job.toObject()).to.eql(index.BoostPowJob.fromString(str).toObject());
   });

   it('should correctly get bits and target and category number', async () => {
      let job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad('hello animal', 32).reverse().toString('hex'),
         diff: 1,
         category: Number(123).toString(16),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('this is more additionalData', 32).reverse().toString('hex'),
         userNonce: index.BoostUtilsHelper.createBufferAndPad('01c8', 4).reverse().toString('hex')
      });

      expect(job.getBits()).to.eql(486604799);
      expect(job.getBitsHex()).to.eql('1d00ffff');
      expect(job.getBits().toString(16)).to.eql('1d00ffff');
      expect(job.getCategoryNumber()).to.eql(123);
      expect(job.getUserNonceNumber()).to.eql(456);

      job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad('hello animal', 32).reverse().toString('hex'),
         diff: 409786762471.9213,
         category: Number(123).toString(16),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('this is more additionalData', 32).reverse().toString('hex'),
         userNonce: index.BoostUtilsHelper.createBufferAndPad('01c8', 4).reverse().toString('hex')
      });
      // 1802b20b
      expect(job.getDiff()).to.eql(409786762471.9213);
      expect(job.getBits()).to.eql(402829022);
      expect(job.getBitsHex()).to.eql('1802aede');
      expect(job.getBits().toString(16)).to.eql('1802aede');

      // 1802f15b
   });


   it('should correctly get content and buffers as appropriate capitalists', async () => {
      const hashed = index.BoostUtilsHelper.getSha256('Capitalists can spend more energy than socialists.');
      const job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad(hashed, 32).toString('hex'),
         diff: 21,
         category: index.BoostUtilsHelper.createBufferAndPad('bill', 4).reverse().toString('hex'),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('this is more additionalData', 32).reverse().toString('hex'),
         userNonce: index.BoostUtilsHelper.createBufferAndPad('01c8', 4).reverse().toString('hex')
      });
      expect(job.getContentHex()).to.eql('35b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde5881');

   });

});