'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');

var privateKey = 'KxPpaGmowYWcSuGSLdt6fCLiRAJRcWCpke4B8Gsf59hghQ6AKvwV'; //for testing
var options = {
   graph_api_url: 'http://localhost:3000'
}

var goodBoostJobTx = '0100000002a17560a67a95ac690f6499a4d1fae39461b1dbb0fabbcd369cc73d0cf9ec7fb1020000006b483045022100cbda68dc2f2a63e735072f1e77c0dbb7e1229bd415108d19750b380e0e8c31b302207cd01b825af183c0ab593955d4955e4517f5a00c0085f164eefb6c7349538080412102fb9439169bb2cb9f07149e578962fcda257b965191fc525d075f6fb1f609f4bbffffffff803e5993e24b9699a0459ed92dc7266175781b1d355f1541a70e3752280141f9020000006b48304502210084e7f5a30652b8ee6225a8eba21d70c291dc78f9a572c29905abe905386b432802204e1f2ced9d5a6ea2166209c514fe2da6f55f05326d9da1560515ae82d06bedba412103f1dbd11d67698b798c2069bdf1b0c95bcda0476c10a8a2cd2297a7179fc2d500ffffffff02451c0000000000001976a9144719eb6d71ec6973652b671b9e5322a106810bb488ac0222000000000000fdac0208626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa8251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e686c825488537f76530121a5696b7664006a6876009f691d00000000000000000000000000000000000000000000000000000000007e6c53945895998251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e688251947f767664519964516700686700686375677e68009f6301007e689f6976a96c88ac00000000';
var goodBostJobTxid = 'd47105dc96afa00ccc95433848211cc7e6c1701e01cad27ae830b0d11ab616aa';
var goodBostJobTxScripthash = '27e24737fb6da35c73cbaccce40ce85be09c1e9c3ee4f15d67a71889fd51f945';
var goodBostJobTxValue = 8706;
var goodBostJobTxVout = 1;

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
      const job = await index.Graph().loadBoostJob('d47105dc96afa00ccc95433848211cc7e6c1701e01cad27ae830b0d11ab616aa');
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
      const utxos = await index.Graph().getBoostJobUtxos(job.getScriptHash());
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
               vout: 1,
               diff: 1,
               value: 8706,
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
      const result = await index.Graph(options).getBoostJobStatus('d47105dc96afa00ccc95433848211cc7e6c1701e01cad27ae830b0d11ab616aa');
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