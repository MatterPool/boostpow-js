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
      const job = await index.Graph(options).loadBoostJob('0eeea673cd4312a26e61a470afe096e94b5251b9cf286e012dd6719121df1092');
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
      const job = await index.Graph().loadBoostJob('0eeea673cd4312a26e61a470afe096e94b5251b9cf286e012dd6719121df1092');
      const utxos = await index.Graph().getBoostJobUtxos(job.getScriptHash());
      delete utxos[0].confirmations;

      expect(utxos).to.eql([
         {
             "scripthash": "2ce050ed38bd8f17b63f364d2538b484483a96fab6dd6f98924b527e859e6159",
             "txid": "0eeea673cd4312a26e61a470afe096e94b5251b9cf286e012dd6719121df1092",
             "vout": 0,
             "amount": 0.00008179,
             "satoshis": 8179,
             "value": 8179,
             "height": 626372,
             // "confirmations": 63,
             "outputIndex": 0
         }
     ]);
   });

   it('loadBoostJob and getBoostJobUnspentOutputs Capitalism quote', async () => {
      // Capitalists can spend more energy that socialists.?
      const job = await index.Graph().loadBoostJob('0eeea673cd4312a26e61a470afe096e94b5251b9cf286e012dd6719121df1092');
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
      await index.Graph(options).loadBoostJob('0eeea673cd4312a26e61a470afe096e94b5251b9cf286e012dd6719121df1092');
      const rawtx = '0100000001a3fa9326238ec8fe6468a144ce204303cfd1d67893f17b57fcd47a9d607457e7010000006a473044022047a94fb4feea3a48d9c9716309d5c074d62e434fdb370e15a130197d888f922b0220597aefbf7bb90428f98e75ba274b7aa18df0fd45f9713f1a55eba445dd05831241210341ac150fc82f6785c9457c9505f3cb01c575ad747b42d4023cdf028e910e54cfffffffff02f31f000000000000d408626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976aa6c88ac59400000000000001976a914c2c2a218c36c196153f7fd7f92cf49c5ee23174c88ac00000000';
      index.BoostPowJob.fromRawTransaction(rawtx);

      const result = await index.Graph(options).submitBoostJob(rawtx);
      expect(result).to.eql({
         success: true,
         result:
         {
            boostJob: {
               txid: '0eeea673cd4312a26e61a470afe096e94b5251b9cf286e012dd6719121df1092',
               vout: 0,
               diff: 1,
               value: 8179,
               scripthash: '2ce050ed38bd8f17b63f364d2538b484483a96fab6dd6f98924b527e859e6159',
               rawtx: '0100000001a3fa9326238ec8fe6468a144ce204303cfd1d67893f17b57fcd47a9d607457e7010000006a473044022047a94fb4feea3a48d9c9716309d5c074d62e434fdb370e15a130197d888f922b0220597aefbf7bb90428f98e75ba274b7aa18df0fd45f9713f1a55eba445dd05831241210341ac150fc82f6785c9457c9505f3cb01c575ad747b42d4023cdf028e910e54cfffffffff02f31f000000000000d408626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976aa6c88ac59400000000000001976a914c2c2a218c36c196153f7fd7f92cf49c5ee23174c88ac00000000',
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
      const result = await index.Graph(options).getBoostJobStatus('0eeea673cd4312a26e61a470afe096e94b5251b9cf286e012dd6719121df1092');
      expect(result).to.eql({
         success: true,
         result:
         {
            boostJob: {
               txid: '0eeea673cd4312a26e61a470afe096e94b5251b9cf286e012dd6719121df1092',
               vout: 0,
               diff: 1,
               value: 8179,
               scripthash: '2ce050ed38bd8f17b63f364d2538b484483a96fab6dd6f98924b527e859e6159',
               rawtx: '0100000001a3fa9326238ec8fe6468a144ce204303cfd1d67893f17b57fcd47a9d607457e7010000006a473044022047a94fb4feea3a48d9c9716309d5c074d62e434fdb370e15a130197d888f922b0220597aefbf7bb90428f98e75ba274b7aa18df0fd45f9713f1a55eba445dd05831241210341ac150fc82f6785c9457c9505f3cb01c575ad747b42d4023cdf028e910e54cfffffffff02f31f000000000000d408626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976aa6c88ac59400000000000001976a914c2c2a218c36c196153f7fd7f92cf49c5ee23174c88ac00000000',
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