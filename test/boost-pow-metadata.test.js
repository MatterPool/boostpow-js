'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require ('bsv');
describe('boost #BoostPowMetadata tests', () => {

   it('should success create', async () => {
      const abstract = index.BoostPowMetadata.fromObject({
         tag: '01',
         minerPubKeyHash: '00000000000000000000000000000000000000a4',
         extraNonce1: '014e',
         extraNonce2: '21a0',
         userNonce: '00000011',
         additionalData: '0000000000000000000000000000000000000000000000000000000000000042',
      });

      const obj = abstract.toObject();
      expect(obj).to.eql({
         tag: '0000000000000000000000000000000000000001',
         minerPubKeyHash: '00000000000000000000000000000000000000a4',
         extraNonce1: '0000014e',
         extraNonce2: '000021a0',
         userNonce: '00000011',
         additionalData: '0000000000000000000000000000000000000000000000000000000000000042',
      });
   });

   it('should success create hex ', async () => {
      const abstract = index.BoostPowMetadata.fromObject({
         tag: '0000000000000000000000000000000000000001',
         minerPubKeyHash: '00000000000000000000000000000000000000a4',
         extraNonce1: '014e',
         extraNonce2: '21a0',
         userNonce: '00000001',
         additionalData: '0000000000000000000000000000000000000000000000000000000000000042',
      });

      const obj = abstract.toObject();
      expect(obj).to.eql({
         tag: '0000000000000000000000000000000000000001',
         minerPubKeyHash: '00000000000000000000000000000000000000a4',
         extraNonce1: '0000014e',
         extraNonce2: '000021a0',
         userNonce: '00000001',
         additionalData: '0000000000000000000000000000000000000000000000000000000000000042',
      });
      expect(abstract.toHex()).to.eql(               '0100000000000000000000000000000000000000a4000000000000000000000000000000000000004e010000a0210000010000004200000000000000000000000000000000000000000000000000000000000000');
      const fromHex = index.BoostPowMetadata.fromHex('0100000000000000000000000000000000000000a4000000000000000000000000000000000000004e010000a0210000010000004200000000000000000000000000000000000000000000000000000000000000');
      expect(abstract.toHex()).to.eql(fromHex.toHex());
      expect(fromHex.toObject()).to.eql(obj);
   });

   it('should success create and get hash of abstract', async () => {
      const fromHex = index.BoostPowMetadata.fromHex('0100000000000000000000000000000000000000a4000000000000000000000000000000000000004e010000a0210000010000004200000000000000000000000000000000000000000000000000000000000000');
      expect(fromHex.hash()).to.eql('2dd2ce3a9bd404105a56433e1e0ce8cfa458e0a3669ce45f56132fc23d18a125');
   });

});

describe('boost #BoostPowJob createBoostPowMetadata', () => {

   // https://search.matterpool.io/tx/600834a5c14436aa1b369cf9780994f988a7f0bb30e9e4e0bc6dedc1598e8ede
   it('createBoostPowMetadata success 600834a5c14436aa1b369cf9780994f988a7f0bb30e9e4e0bc6dedc1598e8ede', async () => {
      const job = index.BoostPowJob.fromRawTransaction('01000000018ff2fe10e8629051853507b4189bf3981569a0d358e0506033a11618f2e3b10c010000006b483045022100f82288631d8c8b6b6fba9094a6d56af6ab572347b7365dcf7e6d68905cb8fd000220390cde292cc50a92bd60e680bfcbddf17443d904c7372880b6ec312a06952fb3412102be82a62c8c3d8e949c9b54a60b4cadf0efacec08164b3eca3b6e793f52bf8d8affffffff0220090000000000001976a914cdb2b66b5fa33fa3f55fb9296f31d445892d990988ace218000000000000e108626f6f7374706f7775047800000020325593000000000000000000000000000000000000000000000000000000000004ffff001d14231200000000000000000000000000000000000004886600002094000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac00000000', 1);

      const userNonce = '00006688';
      const tag = '0000000000000000000000000000000000001223';
      const additionalData = '0000000000000000000000000000000000000000000000000000000000000094';
      const content = '0000000000000000000000000000000000000000000000000000000000935532';
      const extraNonce1Int = 1174405125;
      const extraNonce1Hex = Buffer.from(extraNonce1Int.toString(16), 'hex').reverse().toString('hex');
      const extraNonce2Hex = '0000000000000000';
      expect(job.toObject()).to.eql({
         content: content,
         diff: 1,
         category: '00000078',
         tag: tag,
         additionalData: additionalData,
         userNonce: userNonce,
      });
      var expectedPubKeyHash = '92e4d5ab4bb067f872d28f44d3e5433e56fca190';
      const nonceHex = 'e2731ee0';
      const timeHex = '5e802ed9';
      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '00',
         minerPubKey: '02f96821f6d9a6150e0ea06b00c8c77597e863330041be70438ff6fb211d7efe66',
         extraNonce1: Buffer.from(extraNonce1Hex, 'hex').toString('hex'),
         extraNonce2: Buffer.from(extraNonce2Hex, 'hex').toString('hex'),
         time: Buffer.from(timeHex, 'hex').toString('hex'),
         nonce: Buffer.from(nonceHex, 'hex').toString('hex'),
         minerPubKeyHash: Buffer.from(expectedPubKeyHash, 'hex').toString('hex'),
      });

      expect(jobProof.toObject()).to.eql({
         "extraNonce1": extraNonce1Hex,
         "extraNonce2": extraNonce2Hex,
         "minerPubKey": '02f96821f6d9a6150e0ea06b00c8c77597e863330041be70438ff6fb211d7efe66',
         "minerPubKeyHash": expectedPubKeyHash,
         "nonce": nonceHex,
         "signature": "00",
         "time": timeHex,
      });
      expect(index.BoostPowJob.createBoostPowMetadata(job, jobProof).toBuffer().toString('hex'))
      .to.eql('231200000000000000000000000000000000000092e4d5ab4bb067f872d28f44d3e5433e56fca190460000050000000000000000886600009400000000000000000000000000000000000000000000000000000000000000');

      const expectedMerkleRootMetaHash = 'fc6bee7b4b3be794c6f2a9a9e04786ec8ccedf118b31e3739e919e4e2841c484';
      expect(bsv.crypto.Hash.sha256sha256(
         index.BoostPowJob.createBoostPowMetadata(job, jobProof).toBuffer())
         .reverse().toString('hex'))
      .to.eql(expectedMerkleRootMetaHash);

      expect(index.BoostPowJob.createBoostPowMetadata(job, jobProof).hash()).to.eql(expectedMerkleRootMetaHash);
      /*
      {"method": "mining.submit", "params": ["abra.001", "3", "0000000000000000", "5e802ed9", "e2731ee0"], "id":4}
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.473852 15138 StratumServerBitcoinBoost.cc:303] coinbase: 231200000000000000000000000000000000000092e4d5ab4bb067f872d28f44d3e5433e56fca190extra nonce-> 460000050000000000000000<- extra nonce  user nonce ->88660000<- user nonce ->9400000000000000000000000000000000000000000000000000000000000000
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.473984 15176 StratumServerBitcoinBoost.cc:610] >>>>>>>>>>>>>>>>>>> FOUND BOOST HEADER FOUND >>>>>>>>>>>>>>>>>>>
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.473999 15176 StratumServerBitcoinBoost.cc:615] CBlockHeader nVersion: 00000078, hashPrevBlock: 0000000000000000000000000000000000000000000000000000000000935532, hashMerkleRoot: fc6bee7b4b3be794c6f2a9a9e04786ec8ccedf118b31e3739e919e4e2841c484, nTime: 5e802ed9, nBits: 1d00ffff, nNonce: e2731ee0, extraNonce1: 46000005, extraNonce2: 0000000000000000, tag: 2312000000000000000000000000000000000000, minerPubKeyHash: 92e4d5ab4bb067f872d28f44d3e5433e56fca190, additionalData: 9400000000000000000000000000000000000000000000000000000000000000, userNonce: 88660000
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474097 15176 StratumServerBitcoinBoost.cc:761] >>>> submitBoostSolutionBlockThread
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474107 15176 StratumServerBitcoinBoost.cc:773] submit boost solution:
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474110 15176 StratumServerBitcoinBoost.cc:777] req:
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474114 15176 StratumServerBitcoinBoost.cc:779] extranonce1:
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474118 15176 StratumServerBitcoinBoost.cc:780] 1174405125
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474123 15176 StratumServerBitcoinBoost.cc:781] extranonce2:
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474125 15176 StratumServerBitcoinBoost.cc:782] 0000000000000000
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474128 15176 StratumServerBitcoinBoost.cc:783] time:
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474133 15176 StratumServerBitcoinBoost.cc:784] 1585458905
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474135 15176 StratumServerBitcoinBoost.cc:785] boost job txid:
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474138 15176 StratumServerBitcoinBoost.cc:786] 600834a5c14436aa1b369cf9780994f988a7f0bb30e9e4e0bc6dedc1598e8ede
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474143 15176 StratumServerBitcoinBoost.cc:787] boost vout:
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474145 15176 StratumServerBitcoinBoost.cc:788] 1
      Mar 29 05:15:52 ip-172-31-47-53 sserverboost[15138]: I0329 05:15:52.474159 15176 StratumServerBitcoinBoost.cc:799] { "extraNonce1": 1174405125, "extraNonce2": "0000000000000000", "time": 1585458905, "nonce": 3799195360, "txid": "600834a5c14436aa1b369cf9780994f988a7f0bb30e9e4e0bc6dedc1598e8ede", "vout": 1 }
 */
      const powString = index.BoostPowJob.tryValidateJobProof(job, jobProof, false);

      expect(powString.boostPowString.hash()).to.eql('00000000f3a3ce33b86e99236e561d8e641ad62f13277a77abef50a6673e9330');
      const powMetadata = index.BoostPowJob.createBoostPowMetadata(job, jobProof);

      expect(powString.boostPowString.metadataHash()).to.eql(
         powMetadata.hash()
      );
      expect(powString.boostPowString.metadataHash()).to.eql(
         index.BoostPowMetadata.fromString(powString.boostPowMetadata.toString()).hash()
      );
   });


});
