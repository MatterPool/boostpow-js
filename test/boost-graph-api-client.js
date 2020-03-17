'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');

var privateKey = 'KxPpaGmowYWcSuGSLdt6fCLiRAJRcWCpke4B8Gsf59hghQ6AKvwV'; //for testing
var options = {
   graph_api_url: 'http://localhost:3000'
}
describe('APIClient', () => {
   it('loadBoostJob success', async () => {
      const job = await index.Graph(options).loadBoostJob('0bb56d8d1f68ca5ec8e361f35ffde3fbb046822f62472b8e9b84437f910933d4');
      expect(job.toObject()).to.eql({
         content:'8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835',
         diff: 1,
         category: '00000000',
         tag: '0000000000000000000000000000000000000000',
         additionalData: '0000000000000000000000000000000000000000000000000000000000000000',
         userNonce: '00000000'
      });
   });

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

   it('loadBoostJob and getBoostJobUnspentOutputs', async () => {
      const job = await index.Graph().loadBoostJob('0bb56d8d1f68ca5ec8e361f35ffde3fbb046822f62472b8e9b84437f910933d4');
      const utxos = await index.Graph().getBoostJobUtxos(job.getScriptHash());
      delete utxos[0].confirmations;

      expect(utxos).to.eql([
         {
             "scripthash": "47d36e2d243388b7a0b415f7603da6e6fb47e6d29aaa1334db2aa2a95cd8cfcf",
             "txid": "0bb56d8d1f68ca5ec8e361f35ffde3fbb046822f62472b8e9b84437f910933d4",
             "vout": 0,
             "amount": 0.00008905,
             "satoshis": 8905,
             "value": 8905,
             "height": 626560,
             // "confirmations": 63,
             "outputIndex": 0
         }
     ]);
   });

   it('loadBoostJob and getBoostJobUnspentOutputs Capitalism quote', async () => {
      // Capitalists can spend more energy that socialists.?
      const job = await index.Graph().loadBoostJob('0bb56d8d1f68ca5ec8e361f35ffde3fbb046822f62472b8e9b84437f910933d4');
      const capital = Buffer.from('Capitalists can spend more energy than socialists.', 'utf8');
      expect(capital.toString('hex')).to.eql('4361706974616c697374732063616e207370656e64206d6f726520656e65726779207468616e20736f6369616c697374732e');

      const hashed = bsv.crypto.Hash.sha256(capital).toString('hex');
      const expectedHash = '8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835';
      expect(expectedHash).to.eql(hashed);
      expect(index.BoostUtilsHelper.getSha256(capital.toString())).to.eql(hashed);
      expect(job.getContentHex()).to.eql(expectedHash);
      const utxos = await index.Graph().getBoostJobUtxos(job.getScriptHash());

      expect(utxos.length > 0).to.eql(true);
   });
   it('submitBoostJob', async () => {
      const rawtx = '01000000013cdee5edfaec88f5ec5d4048c35ba1ed595a5c3dc8efc5360f8a26ec08621dcb010000006b483045022100af4682a0b78dc943f0f0f7fa85d3b4efe7291cad3f33a615e195f59b7d6c56f402207ee620e1848986128c95c07f1e2110fc1d165075bd6b4cbd2c1e24a9c566840b4121021e25de581fcd348717345e8f4c1996990b42f5914e1942b8356292100e43d427ffffffff02c922000000000000fd500108626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394986b557a8254887e557a8258887e7c7eaa517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976a96c88ace88df104000000001976a91432accdcb557ed57b9f01b4c42d69d4c9ea5d972a88ac00000000';
      index.BoostPowJob.fromRawTransaction(rawtx);

      const result = await index.Graph(options).submitBoostJob(rawtx);
      expect(result).to.eql({
         success: true,
         result:
         {
            boostJob: {
               txid: '0bb56d8d1f68ca5ec8e361f35ffde3fbb046822f62472b8e9b84437f910933d4',
               vout: 0,
               diff: 1,
               value: 8905,
               scripthash: '47d36e2d243388b7a0b415f7603da6e6fb47e6d29aaa1334db2aa2a95cd8cfcf',
               rawtx: '01000000013cdee5edfaec88f5ec5d4048c35ba1ed595a5c3dc8efc5360f8a26ec08621dcb010000006b483045022100af4682a0b78dc943f0f0f7fa85d3b4efe7291cad3f33a615e195f59b7d6c56f402207ee620e1848986128c95c07f1e2110fc1d165075bd6b4cbd2c1e24a9c566840b4121021e25de581fcd348717345e8f4c1996990b42f5914e1942b8356292100e43d427ffffffff02c922000000000000fd500108626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394986b557a8254887e557a8258887e7c7eaa517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976a96c88ace88df104000000001976a91432accdcb557ed57b9f01b4c42d69d4c9ea5d972a88ac00000000',
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
      const result = await index.Graph(options).getBoostJobStatus('0bb56d8d1f68ca5ec8e361f35ffde3fbb046822f62472b8e9b84437f910933d4');
      expect(result).to.eql({
         success: true,
         result:
         {
            boostJob: {
               txid: '0bb56d8d1f68ca5ec8e361f35ffde3fbb046822f62472b8e9b84437f910933d4',
               vout: 0,
               diff: 1,
               value: 8905,
               scripthash: '47d36e2d243388b7a0b415f7603da6e6fb47e6d29aaa1334db2aa2a95cd8cfcf',
               rawtx: '01000000013cdee5edfaec88f5ec5d4048c35ba1ed595a5c3dc8efc5360f8a26ec08621dcb010000006b483045022100af4682a0b78dc943f0f0f7fa85d3b4efe7291cad3f33a615e195f59b7d6c56f402207ee620e1848986128c95c07f1e2110fc1d165075bd6b4cbd2c1e24a9c566840b4121021e25de581fcd348717345e8f4c1996990b42f5914e1942b8356292100e43d427ffffffff02c922000000000000fd500108626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394986b557a8254887e557a8258887e7c7eaa517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976a96c88ace88df104000000001976a91432accdcb557ed57b9f01b4c42d69d4c9ea5d972a88ac00000000',
               spentRawtx: null,
               spentScripthash: null,
               spentTxid: null,
               spentVout: null,
            },
            boostPowString: null,
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