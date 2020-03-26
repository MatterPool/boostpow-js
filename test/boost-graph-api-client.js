'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');

var privateKey = 'KxPpaGmowYWcSuGSLdt6fCLiRAJRcWCpke4B8Gsf59hghQ6AKvwV'; //for testing
var options = {
   graph_api_url: 'http://localhost:3000'
}

var goodBoostJobTx = '01000000027cb3bdfcba3f013008e04fd566baf8dccac36ae54e0bb8b1579d8a3790729836010000006a47304402200b6e84bfcf9d1fdd5f40252576fbfc53cb04be78d7251651749f24d9822fe9f002203d027dc96c9b7715c1948696095ecf22a08a92a21e6f2a9d561c8cb2fd977dd4412103bb88ef4b58927d7a525fb64a4789d9462c39ff2c16086dff9a070c7c1babd459ffffffffbb4fa8d4459cda26e50ca530d430eab1820ff43f8d06fd78abdd987c47470bb7000000006b483045022100f33e45e54b2fd769a6b7b517c023a2a25cad32603fdc9a9edeb08a76f872d81e02200f6044d039d807e43fb05fd47a05c41fbfeab30277c3389af9f8756e6d89a5fc412103421187172da9fed7f935a7bebe89217a6840c2ba61d8745dd2e696650f237426ffffffff02571f000000000000e108626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac2a490000000000001976a9148a1a812ceb0e68fd6c153f95c10b2b59cb7b956c88ac00000000';
var goodBostJobTxid = '5cb0245a9e44f409b26d357a1f03cc30309e056d7acee769c3050b058dd22cdc';
var goodBostJobTxScripthash = 'b1b2b1db4b0c31ff13ef09e0861ed4bf94942d248aa47f30cd792db86badd9cd';
var goodBostJobTxValue = 8023;
var goodBostJobTxVout = 0;

describe('APIClient', () => {

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
         await index.Graph().loadBoostJob('1eeea673cd4312a26e61a470afe096e94b5251b9cf286e012dd6719121df1092');
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

   it('loadBoostJob and getBoostJobUnspentOutputs Capitalism quote', async () => {
      // Capitalists can spend more energy that socialists.?
      const job = await index.Graph(options).loadBoostJob('4eb545a588a21045495e74449b348ce1eb8f48ac95356c519a2a85a57731a518');
      expect(job.toObject()).to.eql({
         content:'8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835',
         diff: 1,
         category: '00000000',
         tag: '0000000000000000000000000000000000000000',
         additionalData: '0000000000000000000000000000000000000000000000000000000000000000',
         userNonce: '00000000'
      });

      const capital = Buffer.from('Capitalists can spend more energy than socialists.', 'utf8');
      expect(capital.toString('hex')).to.eql('4361706974616c697374732063616e207370656e64206d6f726520656e65726779207468616e20736f6369616c697374732e');
      const hashed = bsv.crypto.Hash.sha256(capital).toString('hex');
      const expectedHash = '8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835';
      expect(expectedHash).to.eql(hashed);
      expect(index.BoostUtilsHelper.getSha256(capital.toString())).to.eql(hashed);
      expect(job.getContentHex()).to.eql(expectedHash);
      const utxos = await index.Graph(options).getBoostJobUtxos(job.getScriptHash());
      expect(utxos.length > 0).to.eql(true);
   });

   it('submitBoostJob', async () => {
      const rawtx = goodBoostJobTx;
      index.BoostPowJob.fromRawTransaction(rawtx);

      const result = await index.Graph(options).submitBoostJob(rawtx);
      expect(result).to.eql({
         success: true,
         result:
         {
            boostJob: {
               txid: goodBostJobTxid,
               vout: goodBostJobTxVout,
               diff: 1,
               value: goodBostJobTxValue,
               scripthash: goodBostJobTxScripthash,
               rawtx: goodBoostJobTx,
               spentRawtx: null,
               spentScripthash: null,
               spentTxid: null,
               spentVout: null,
            },
            boostPowString: null,
         }
      });

   });

   it('getBoostJobStatus', async () => {
      const result = await index.Graph(options).getBoostJobStatus(goodBostJobTxid);
      expect(result).to.eql({
         success: true,
         result:
         {
            boostJob: {
               txid: goodBostJobTxid,
               vout: goodBostJobTxVout,
               diff: 1,
               value: goodBostJobTxValue,
               scripthash: goodBostJobTxScripthash,
               rawtx: goodBoostJobTx,

               spentRawtx: null,
               spentScripthash: null,
               spentTxid: null,
               spentVout: null,

            },
            boostPowString: null,
         }
      });
   });

   it('submitMiningSolution should error', async () => {
      try {
         await index.Graph(options).submitBoostSolution({});
         expect(true).to.eql(false);
      } catch(ex) {
         expect(ex).to.eql({
            success: false,
            code: 422,
            error: '',
            message: 'required fields: txid, vout, nonce, extraNonce1, extraNonce2, time'
         });
      }
   });

   it('submitMiningSolution should fail', async () => {
      const job = index.BoostPowJob.fromRawTransaction('010000000174d9f6dc235207fbbcdff7bdc412dcb375eb634da698ed164cc1e9aa1b88729a040000006b4830450221008596410738406e0e8589292a0e7a4d960e739025ab1859a3df6c77b4cf8c59ac0220733024f199162bc7b9ccd648aae56f0a0e307558a9827a26d35b1016de1865c54121025a77fe27d1db166b660205ff08b97f7dd87c7c68edaa2931895c2c8577f1a351ffffffff027d20000000000000e108626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88acb461590e000000001976a914ba6e459a2b505dc78e44e8c5874776c00890e16088ac00000000');
      /*
      >>>>>>>>>>>>>>>>>>> checkShare >>>>>>>>>>>>>>>>>>>
      211193-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175833 30281 StratumServerBitcoin.cc:336] coinbase tx:
      // Original reaL:
      00000000000000000000000000000000000000009fb8cb68b8850a13c7438e26e1d277b748be657a0a00000abf07000000000000000000000000000000000000000000000000000000000000000000000000000000000000
      211194-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175880 30327 StratumServerBitcoin.cc:632] >>>>>>>>>>>>>>>>>>> checkingFoundNewBlock >>>>>>>>>>>>>>>>>>>
      211195:Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175889 30327 StratumServerBitcoin.cc:637] >>>>>>>>>>>>>>>>>>> FOUND BLOCK FOUND >>>>>>>>>>>>>>>>>>>
      211196-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175894 30327 StratumServerBitcoin.cc:642] CBlockHeader nVersion: 00000000, hashPrevBlock: 8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835, hashMerkleRoot: 7687b9ef4a2a8bc0387336177e4f90ceabca3cbdf246ad4e9f27d4d94f1f4019, nTime: 5e6dc081, nBits: 1d00ffff, nNonce: 1ca169e0, extraNonce1: 0a00000a, extraNonce2: bf07000000000000
      211197-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175958 30327 StratumServerBitcoin.cc:684] >>>> found a new block: 0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35, jobId: 6804306268015034369, userId: 35, by: shedminer.002 <<<<
      211198-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175973 30327 StratumServerBitcoin.cc:689] >>>> found a new block_boost: 0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35, jobId: 6804306268015034369, userId: 35, by: shedminer.002 <<<<0 <<<<8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835 <<<<7687b9ef4a2a8bc0387336177e4f90ceabca3cbdf246ad4e9f27d4d94f1f4019 <<<<1584251009 <<<<486604799 <<<<480340448
      211199-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175994 30327 StratumServerBitcoin.cc:710] high diff share, blkhash: 0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35, diff: 272, networkDiff: 1, by: shedminer.002
      */
      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '00',
         minerPubKey: '020370f418d21765b33bc093db143aa1dd5cfefc97275652dc8396c2d567f93d65',
         extraNonce1: Buffer.from('000000', 'hex').toString('hex'),
         extraNonce2: Buffer.from('bf07000000000000', 'hex').toString('hex'),
         time: Buffer.from('5e6dc081', 'hex').toString('hex'),
         nonce: Buffer.from('1ca169e0', 'hex').toString('hex'),
         minerPubKeyHash: Buffer.from('9fb8cb68b8850a13c7438e26e1d277b748be657a', 'hex').toString('hex'),
      });
      try {
         await index.Graph(options).submitBoostSolution({
            nonce: jobProof.getNonceNumber(),
            extraNonce1: jobProof.getExtraNonce1Number(),
            extraNonce2: jobProof.getExtraNonce2().toString('hex'),
            txid: job.getTxid(),
            vout: job.getVout(),
            time: jobProof.getTimeNumber(),
         });
      }
      catch (ex) {
         expect(ex).to.eql({
            "code": 422,
            "error": "",
            "message": "invalid boost solution",
            "success": false,
         });
         return;
      }
      expect(true).to.eql(false);
   });

   it('submitMiningSolution should succeed', async () => {
      const job = index.BoostPowJob.fromRawTransaction('010000000174d9f6dc235207fbbcdff7bdc412dcb375eb634da698ed164cc1e9aa1b88729a040000006b4830450221008596410738406e0e8589292a0e7a4d960e739025ab1859a3df6c77b4cf8c59ac0220733024f199162bc7b9ccd648aae56f0a0e307558a9827a26d35b1016de1865c54121025a77fe27d1db166b660205ff08b97f7dd87c7c68edaa2931895c2c8577f1a351ffffffff027d20000000000000e108626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88acb461590e000000001976a914ba6e459a2b505dc78e44e8c5874776c00890e16088ac00000000');
      /*
      >>>>>>>>>>>>>>>>>>> checkShare >>>>>>>>>>>>>>>>>>>
      211193-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175833 30281 StratumServerBitcoin.cc:336] coinbase tx:
      // Original reaL:
      00000000000000000000000000000000000000009fb8cb68b8850a13c7438e26e1d277b748be657a0a00000abf07000000000000000000000000000000000000000000000000000000000000000000000000000000000000
      211194-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175880 30327 StratumServerBitcoin.cc:632] >>>>>>>>>>>>>>>>>>> checkingFoundNewBlock >>>>>>>>>>>>>>>>>>>
      211195:Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175889 30327 StratumServerBitcoin.cc:637] >>>>>>>>>>>>>>>>>>> FOUND BLOCK FOUND >>>>>>>>>>>>>>>>>>>
      211196-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175894 30327 StratumServerBitcoin.cc:642] CBlockHeader nVersion: 00000000, hashPrevBlock: 8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835, hashMerkleRoot: 7687b9ef4a2a8bc0387336177e4f90ceabca3cbdf246ad4e9f27d4d94f1f4019, nTime: 5e6dc081, nBits: 1d00ffff, nNonce: 1ca169e0, extraNonce1: 0a00000a, extraNonce2: bf07000000000000
      211197-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175958 30327 StratumServerBitcoin.cc:684] >>>> found a new block: 0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35, jobId: 6804306268015034369, userId: 35, by: shedminer.002 <<<<
      211198-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175973 30327 StratumServerBitcoin.cc:689] >>>> found a new block_boost: 0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35, jobId: 6804306268015034369, userId: 35, by: shedminer.002 <<<<0 <<<<8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835 <<<<7687b9ef4a2a8bc0387336177e4f90ceabca3cbdf246ad4e9f27d4d94f1f4019 <<<<1584251009 <<<<486604799 <<<<480340448
      211199-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175994 30327 StratumServerBitcoin.cc:710] high diff share, blkhash: 0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35, diff: 272, networkDiff: 1, by: shedminer.002
      */
      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '00',
         minerPubKey: '020370f418d21765b33bc093db143aa1dd5cfefc97275652dc8396c2d567f93d65',
         extraNonce1: Buffer.from('0a00000a', 'hex').toString('hex'),
         extraNonce2: Buffer.from('bf07000000000000', 'hex').toString('hex'),
         time: Buffer.from('5e6dc081', 'hex').toString('hex'),
         nonce: Buffer.from('1ca169e0', 'hex').toString('hex'),
         minerPubKeyHash: Buffer.from('9fb8cb68b8850a13c7438e26e1d277b748be657a', 'hex').toString('hex'),
      });
      const powString = index.BoostPowJob.tryValidateJobProof(job, jobProof);
      expect(powString.hash()).to.eql('0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35');
      const submitResult = await index.Graph(options).submitBoostSolution({
         nonce: jobProof.getNonceNumber(),
         extraNonce1: jobProof.getExtraNonce1Number(),
         extraNonce2: jobProof.getExtraNonce2().toString('hex'),
         txid: job.getTxid(),
         vout: job.getVout(),
         time: jobProof.getTimeNumber(),
      });
      expect(submitResult).to.eql({
         success: true,
         result: {
            rawtx: '010000000118a53177a5852a9a516c3595ac488febe18c349b44745e494510a288a545b54e0000000098483045022100aa9c8d5cd3b975e00305122b9ce5ce965565f4e36f6dce24870da45fb153636102201aa4ddcd5fa69b73ff498d309de137c5c0c82b32ddd3b864aabe96973e4afc414121020370f418d21765b33bc093db143aa1dd5cfefc97275652dc8396c2d567f93d6504e069a11c0481c06d5e08bf07000000000000040a00000a149fb8cb68b8850a13c7438e26e1d277b748be657affffffff01781e0000000000001976a9140bed1b97a1ec681cf100ee8b11800a54b39b9fda88ac00000000',
            txid: '6e1d88f10e829fa2dd9691ef5cf9550ba6f0eed51d676f1b74df3fa894fe7035',
         }
      });
   });

   it('search by content', async () => {
      const result = await index.Graph(options).search({
         contentutf8: 'Hello Boost'
      }, {});

      expect(!!result.result.length).to.eql(true);
   });

   it('search all', async () => {
      const result = await index.Graph(options).search({
      }, {});
      expect(result.success).to.eql(true);
      expect(result.result.length > 0).to.eql(true);
   });

});