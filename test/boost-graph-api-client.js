'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');

var options = {
   // graph_api_url: 'http://localhost:3000'
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
      expect(utxos.length >= 0).to.eql(true);
   });

   it('submitBoostJob', async () => {
      const rawtx = goodBoostJobTx;
      index.BoostPowJob.fromRawTransaction(rawtx);

      const result = await index.Graph(options).submitBoostJob(rawtx);
      expect(result).to.eql({
         success: true,
         result:
         {
            boostJobId: "5cb0245a9e44f409b26d357a1f03cc30309e056d7acee769c3050b058dd22cdc.0",
            boostJobProofId: '3b56d3a6118ee837e27e4ee508db1a2919630f485a36cec02ea11051b6712592.0',
            "boostHash": "00000000fb7271146196d3fbb46ff31346fa710b2f9139bf86a6410ad0686cca",
            "boostData": {
               "additionaldata": "0000000000000000000000000000000000000000000000000000000000000000",
               "additionaldatautf8": "",
               "category": "00000000",
               "categoryutf8": "",
               "content": "8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835",
               "contentutf8": "�XޫcJ�8�Za퓫W�͋\u0019r���۽�/����5",
               "tag": "0000000000000000000000000000000000000000",
               "tagutf8": "",
               "usernonce": "00000000"
            },
            boostJob: {
               boostJobId: goodBostJobTxid + '.' + goodBostJobTxVout,
               txid: goodBostJobTxid,
               vout: goodBostJobTxVout,
               diff: 1,
               "time": 1585462382,
               createdTime: 1585459599,
               value: goodBostJobTxValue,
               scripthash: goodBostJobTxScripthash,
               rawtx: goodBoostJobTx,
               spentRawtx: '0100000001dc2cd28d050b05c369e7ce7a6d059e3030cc031f7a356db209f4449e5a24b05c00000000974730440220357c64f66653764328a4ad191f9c3956382340a0c7488f7bdfc7a57fba4dc3d3022070e7a666acdb6f9aa2a3d60edfcf539cc9764bbee919732cf74c48a6a1ecba3e412102f96821f6d9a6150e0ea06b00c8c77597e863330041be70438ff6fb211d7efe6604482dd7d5046e3c805e08000000000000000004460014a21492e4d5ab4bb067f872d28f44d3e5433e56fca190ffffffff01521d0000000000001976a91492e4d5ab4bb067f872d28f44d3e5433e56fca19088ac00000000',
               spentScripthash: null,
               spentTxid: '3b56d3a6118ee837e27e4ee508db1a2919630f485a36cec02ea11051b6712592',
               spentVout: 0,
            },
            boostPowMetadata: '000000000000000000000000000000000000000092e4d5ab4bb067f872d28f44d3e5433e56fca190460014a20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            boostPowString: '0000000035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde5881ddf4f115036caa271c6e67a059418dd144211949cdf465ef2c10c8e9fb50dcdd6e3c805effff001d482dd7d5',
            "extra": {
               "explorer": "https://boostpow.com/job/5cb0245a9e44f409b26d357a1f03cc30309e056d7acee769c3050b058dd22cdc",
               "graph": "https://graph.boostpow.com/api/v1/main/boost/:boosthash_txid_or_boost_pow_signal_strings",
            }
         }
      });

   });

   it('getBoostJobStatus', async () => {
      const result = await index.Graph(options).getBoostJobStatus(goodBostJobTxid);
      expect(result).to.eql({
         success: true,
         result:
         {
            "boostHash": "00000000fb7271146196d3fbb46ff31346fa710b2f9139bf86a6410ad0686cca",
            boostJobId: "5cb0245a9e44f409b26d357a1f03cc30309e056d7acee769c3050b058dd22cdc.0",
            boostJobProofId: '3b56d3a6118ee837e27e4ee508db1a2919630f485a36cec02ea11051b6712592.0',
            boostJob: {
               boostJobId: '5cb0245a9e44f409b26d357a1f03cc30309e056d7acee769c3050b058dd22cdc.0',
               txid: goodBostJobTxid,
               vout: goodBostJobTxVout,
               diff: 1,
               "time": 1585462382,
               createdTime: 1585459599,
               value: goodBostJobTxValue,
               scripthash: goodBostJobTxScripthash,
               rawtx: goodBoostJobTx,
               spentRawtx: '0100000001dc2cd28d050b05c369e7ce7a6d059e3030cc031f7a356db209f4449e5a24b05c00000000974730440220357c64f66653764328a4ad191f9c3956382340a0c7488f7bdfc7a57fba4dc3d3022070e7a666acdb6f9aa2a3d60edfcf539cc9764bbee919732cf74c48a6a1ecba3e412102f96821f6d9a6150e0ea06b00c8c77597e863330041be70438ff6fb211d7efe6604482dd7d5046e3c805e08000000000000000004460014a21492e4d5ab4bb067f872d28f44d3e5433e56fca190ffffffff01521d0000000000001976a91492e4d5ab4bb067f872d28f44d3e5433e56fca19088ac00000000',
               spentScripthash: null,
               spentTxid: '3b56d3a6118ee837e27e4ee508db1a2919630f485a36cec02ea11051b6712592',
               spentVout: 0,

            },
            "boostData": {
               "additionaldata": "0000000000000000000000000000000000000000000000000000000000000000",
               "additionaldatautf8": "",
               "category": "00000000",
               "categoryutf8": "",
               "content": "8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835",
               "contentutf8": "�XޫcJ�8�Za퓫W�͋\u0019r���۽�/����5",
               "tag": "0000000000000000000000000000000000000000",
               "tagutf8": "",
               "usernonce": "00000000",
            },
            boostPowString: '0000000035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde5881ddf4f115036caa271c6e67a059418dd144211949cdf465ef2c10c8e9fb50dcdd6e3c805effff001d482dd7d5',
            boostPowMetadata: '000000000000000000000000000000000000000092e4d5ab4bb067f872d28f44d3e5433e56fca190460014a20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            "extra": {
               "explorer": "https://boostpow.com/job/5cb0245a9e44f409b26d357a1f03cc30309e056d7acee769c3050b058dd22cdc",
               "graph": "https://graph.boostpow.com/api/v1/main/boost/:boosthash_txid_or_boost_pow_signal_strings",
            }
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
      const job = index.BoostPowJob.fromRawTransaction('01000000018ff2fe10e8629051853507b4189bf3981569a0d358e0506033a11618f2e3b10c010000006b483045022100f82288631d8c8b6b6fba9094a6d56af6ab572347b7365dcf7e6d68905cb8fd000220390cde292cc50a92bd60e680bfcbddf17443d904c7372880b6ec312a06952fb3412102be82a62c8c3d8e949c9b54a60b4cadf0efacec08164b3eca3b6e793f52bf8d8affffffff0220090000000000001976a914cdb2b66b5fa33fa3f55fb9296f31d445892d990988ace218000000000000e108626f6f7374706f7775047800000020325593000000000000000000000000000000000000000000000000000000000004ffff001d14231200000000000000000000000000000000000004886600002094000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac00000000');

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
         signature: '304402206594747de751c8927ae31fd10c5886d189a852089a44b638f966a490eabb65ae02205540c7e11d8f2615ae0d5643d4ace20a83c17ebfa7837df9b175060f2914041b41',
         minerPubKey: '02f96821f6d9a6150e0ea06b00c8c77597e863330041be70438ff6fb211d7efe66',
         extraNonce1: Buffer.from(extraNonce1Hex, 'hex').toString('hex'),
         extraNonce2: Buffer.from(extraNonce2Hex, 'hex').toString('hex'),
         time: Buffer.from(timeHex, 'hex').toString('hex'),
         nonce: Buffer.from(nonceHex, 'hex').toString('hex'),
         minerPubKeyHash: Buffer.from(expectedPubKeyHash, 'hex').toString('hex'),
      });
      const powString = index.BoostPowJob.tryValidateJobProof(job, jobProof);
      expect(powString.boostPowString.hash()).to.eql('00000000f3a3ce33b86e99236e561d8e641ad62f13277a77abef50a6673e9330');
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
            boostHash: "00000000f3a3ce33b86e99236e561d8e641ad62f13277a77abef50a6673e9330",
            boostJobId: '600834a5c14436aa1b369cf9780994f988a7f0bb30e9e4e0bc6dedc1598e8ede.1',
            boostJobProofId: '6974a4c575c661a918e50d735852c29541a3263dcc4ff46bf90eb9f8f0ec485e.0',
            boostJob: {
               boostJobId: '600834a5c14436aa1b369cf9780994f988a7f0bb30e9e4e0bc6dedc1598e8ede.1',
               txid: '600834a5c14436aa1b369cf9780994f988a7f0bb30e9e4e0bc6dedc1598e8ede',
               vout: 1,
               diff: 1,
               "time": 1585458905,
               createdTime: 1585590793,
               value: 6370,
               scripthash: '1f860e678a1c7dd09c8669a74f20329119558abc69303119d2259ca379bbc0ff',
               rawtx: '01000000018ff2fe10e8629051853507b4189bf3981569a0d358e0506033a11618f2e3b10c010000006b483045022100f82288631d8c8b6b6fba9094a6d56af6ab572347b7365dcf7e6d68905cb8fd000220390cde292cc50a92bd60e680bfcbddf17443d904c7372880b6ec312a06952fb3412102be82a62c8c3d8e949c9b54a60b4cadf0efacec08164b3eca3b6e793f52bf8d8affffffff0220090000000000001976a914cdb2b66b5fa33fa3f55fb9296f31d445892d990988ace218000000000000e108626f6f7374706f7775047800000020325593000000000000000000000000000000000000000000000000000000000004ffff001d14231200000000000000000000000000000000000004886600002094000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac00000000',
               // time: 1584251009,
               spentRawtx: '0100000001de8e8e59c1ed6dbce0e4e930bbf0a788f9940978f99c361baa3644c1a5340860010000009747304402206594747de751c8927ae31fd10c5886d189a852089a44b638f966a490eabb65ae02205540c7e11d8f2615ae0d5643d4ace20a83c17ebfa7837df9b175060f2914041b412102f96821f6d9a6150e0ea06b00c8c77597e863330041be70438ff6fb211d7efe6604e01e73e204d92e805e08000000000000000004460000051492e4d5ab4bb067f872d28f44d3e5433e56fca190ffffffff01dd160000000000001976a91492e4d5ab4bb067f872d28f44d3e5433e56fca19088ac00000000',
               spentScripthash: null,
               spentTxid: '6974a4c575c661a918e50d735852c29541a3263dcc4ff46bf90eb9f8f0ec485e',
               spentVout: 0,
            },
            "boostData": {
               "additionaldata": "0000000000000000000000000000000000000000000000000000000000000094",
               "additionaldatautf8": "�",
               "category": "00000078",
               "categoryutf8": "x",
               "content": "0000000000000000000000000000000000000000000000000000000000935532",
               "contentutf8": "�U2",
               "tag": "0000000000000000000000000000000000001223",
               "tagutf8": "\u0012#",
               "usernonce": "00006688",
            },
            boostPowString: '78000000325593000000000000000000000000000000000000000000000000000000000084c441284e9e919e73e3318b11dfce8cec8647e0a9a9f2c694e73b4b7bee6bfcd92e805effff001de01e73e2',
            boostPowMetadata: '231200000000000000000000000000000000000092e4d5ab4bb067f872d28f44d3e5433e56fca190460000050000000000000000886600009400000000000000000000000000000000000000000000000000000000000000',
            "extra": {
               "explorer": "https://boostpow.com/job/600834a5c14436aa1b369cf9780994f988a7f0bb30e9e4e0bc6dedc1598e8ede",
               "graph": "https://graph.boostpow.com/api/v1/main/boost/:boosthash_txid_or_boost_pow_signal_strings",
            }
         }
      });

      const boostJobClone = index.BoostPowJob.fromRawTransaction(submitResult.result.boostJob.rawtx);
      expect(boostJobClone.toObject()).to.eql(job.toObject());

      const boostJobProofClone = index.BoostPowJobProof.fromRawTransaction(submitResult.result.boostJob.spentRawtx);
      expect(boostJobProofClone.toObject()).to.eql(jobProof.toObject());

      const validatedPow = index.BoostPowString.fromString(submitResult.result.boostPowString);
      expect(validatedPow.hash()).to.eql('00000000f3a3ce33b86e99236e561d8e641ad62f13277a77abef50a6673e9330')
      expect(submitResult.result.boostPowMetadata).to.eql(index.BoostPowJob.createBoostPowMetadata(boostJobClone, boostJobProofClone).getCoinbaseString());
      expect(validatedPow.metadataHash()).to.eql(index.BoostPowJob.createBoostPowMetadata(boostJobClone, boostJobProofClone).hash());

   });
});