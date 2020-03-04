'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

describe('boost #BoostPowJob.createBoostJob', () => {

   it('should be valid minimal', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 8,
      });

      const jobObj = job.toObject();
      delete jobObj.time;
      delete jobObj.unique;
      expect(jobObj).to.eql({
         content: Buffer.from('68656c6c6f20776f726c64000000000000000000000000000000000000000000', 'hex').toString('hex'),
         diff: 8,
         category: 0,
         tag: '0000000000000000000000000000000000000000',
         metadata: "0000000000000000000000000000000000000000000000000000000000000000",
         // auto-generated
         // time: 1305200806,
         // unique: 2436437219,
      })
   });

   it('should be valid full', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 8,
         // Optional fields below
         category: 1234,
         tag: 'animals',
         metadata: 'metadata here',
         // Optional and auto-generated
         time: 1305200806,
         unique: 2436437219,
      });

      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: index.BoostPowJob.createBufferAndPad('hello world', 32).toString('hex'),
         diff: 8,
         category: 1234,
         tag: index.BoostPowJob.createBufferAndPad('animals', 20).toString('hex'),
         metadata: index.BoostPowJob.createBufferAndPad('metadata here', 32).toString('hex'),
         time: 1305200806,
         unique: 2436437219,
      });

      expect(jobObj).to.eql({
         content: '68656c6c6f20776f726c64000000000000000000000000000000000000000000',
         diff: 8,
         category: 1234,
         tag: '616e696d616c7300000000000000000000000000',
         metadata: '6d65746164617461206865726500000000000000000000000000000000000000',
         time: 1305200806,
         unique: 2436437219,
      });
   });

   it('should be valid full from object with hex fields', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '68656c6c6f20776f726c64000000000000000000000000000000000000000000',
         diff: 8,
         category: 1234,
         tag: '616e696d616c7300000000000000000000000000',
         metadata: '6d65746164617461206865726500000000000000000000000000000000000000',
         time: 1305200806,
         unique: 2436437219,
      });

      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: index.BoostPowJob.createBufferAndPad('hello world', 32).toString('hex'),
         diff: 8,
         category: 1234,
         tag: index.BoostPowJob.createBufferAndPad('animals', 20).toString('hex'),
         metadata: index.BoostPowJob.createBufferAndPad('metadata here', 32).toString('hex'),
         time: 1305200806,
         unique: 2436437219,
      });

      expect(jobObj).to.eql({
         content: '68656c6c6f20776f726c64000000000000000000000000000000000000000000',
         diff: 8,
         category: 1234,
         tag: '616e696d616c7300000000000000000000000000',
         metadata: '6d65746164617461206865726500000000000000000000000000000000000000',
         time: 1305200806,
         unique: 2436437219,
      });
   });

   it('should generate output script ASM', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '68656c6c6f20776f726c64000000000000000000000000000000000000000000',
         diff: 8,
         category: 2,
         tag: '616e696d616c7300000000000000000000000000',
         metadata: '6d65746164617461206865726500000000000000000000000000000000000000',
         time: 1305200806,
         unique: 2436437219,
      });

      const outputScript = job.toScriptASM();
      expect(outputScript).to.eql('OP_4 02000000 OP_PUSHDATA1 20 68656c6c6f20776f726c64000000000000000000000000000000000000000000 OP_4 00000008 OP_PUSHDATA1 14 616e696d616c7300000000000000000000000000 OP_8 913914e300000000 OP_PUSHDATA1 20 6d65746164617461206865726500000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP OP_PUSHDATA1 32 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });
});
