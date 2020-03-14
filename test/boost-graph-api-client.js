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
      const job = await index.Graph(options).loadBoostJob('9f7e8f672a417ecac32997388873fc86e2fccb593dc3399652f0ed8b80e78770');
      expect(job.toObject()).to.eql({
         content:'00000000000000000000000000000000000000000048656c6c6f20426f6f7374',
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
         await index.Graph().loadBoostJob('9f7e8f672a417ecac32997388873fc86e2fccb593dc3399652f0ed8b80e78774');
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

   it('loadBoostJob failure not found', async () => {
      try {
         await index.Graph().loadBoostJob('127e8f672a417ecac32997388873fc86e2fccb593dc3399652f0ed8b80e78770');
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
      const job = await index.Graph().loadBoostJob('4aef0afa290b0850e5f60d9830e6c261f6332abaa1d9d06140fa708d8bbcf3f4');
      const utxos = await index.Graph().getBoostJobUtxos(job.getScriptHash());
      delete utxos[0].confirmations;

      expect(utxos).to.eql([
         {
             "scripthash": "bf28428c215a22438d6a7771ed83393967dc2cb2366d1d5022b4a9c152340bf1",
             "txid": "4aef0afa290b0850e5f60d9830e6c261f6332abaa1d9d06140fa708d8bbcf3f4",
             "vout": 0,
             "amount": 0.00008084,
             "satoshis": 8084,
             "value": 8084,
             "height": 626106,
             // "confirmations": 63,
             "outputIndex": 0
         }
     ]);
   });

   it('loadBoostJob and getBoostJobUnspentOutputs Capitalism quote', async () => {
      // Capitalists can spend more energy that socialists.?
      const job = await index.Graph().loadBoostJob('4aef0afa290b0850e5f60d9830e6c261f6332abaa1d9d06140fa708d8bbcf3f4');
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
      await index.Graph(options).loadBoostJob('4aef0afa290b0850e5f60d9830e6c261f6332abaa1d9d06140fa708d8bbcf3f4');
      const rawtx = '010000000112eff892f1d239d680fa01479fd6287711f1af7b03b7826415f582250919cb42030000006b483045022100fa0a3677fd870c48db4094c350cd4532904f3cef5bb0d964bc8f4f4fc3e9044802204dd66952074f9c080925abaeec0cdcc5bbb809472227c4b27e4c6eae8aeb5e04412103ebae722891c60cad85358fde5aa0bc8b9b9d28272e89e4808e4ffe81831fad16ffffffff01941f000000000000d408626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b557a8254887e557a8254887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976aa6c88ac00000000';
      index.BoostPowJob.fromRawTransaction(rawtx);

      const result = await index.Graph(options).submitBoostJob(rawtx);
      expect(result).to.eql({
         success: true,
         result:
         {
            boostJob: {
               txid: '4aef0afa290b0850e5f60d9830e6c261f6332abaa1d9d06140fa708d8bbcf3f4',
               vout: 0,
               diff: 1,
               value: 8084,
               scripthash: 'bf28428c215a22438d6a7771ed83393967dc2cb2366d1d5022b4a9c152340bf1',
               rawtx: '010000000112eff892f1d239d680fa01479fd6287711f1af7b03b7826415f582250919cb42030000006b483045022100fa0a3677fd870c48db4094c350cd4532904f3cef5bb0d964bc8f4f4fc3e9044802204dd66952074f9c080925abaeec0cdcc5bbb809472227c4b27e4c6eae8aeb5e04412103ebae722891c60cad85358fde5aa0bc8b9b9d28272e89e4808e4ffe81831fad16ffffffff01941f000000000000d408626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b557a8254887e557a8254887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976aa6c88ac00000000',
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
      const result = await index.Graph(options).getBoostJobStatus('4aef0afa290b0850e5f60d9830e6c261f6332abaa1d9d06140fa708d8bbcf3f4');
      expect(result).to.eql({
         success: true,
         result:
         {
            boostJob: {
               txid: '4aef0afa290b0850e5f60d9830e6c261f6332abaa1d9d06140fa708d8bbcf3f4',
               vout: 0,
               diff: 1,
               value: 8084,
               scripthash: 'bf28428c215a22438d6a7771ed83393967dc2cb2366d1d5022b4a9c152340bf1',
               rawtx: '010000000112eff892f1d239d680fa01479fd6287711f1af7b03b7826415f582250919cb42030000006b483045022100fa0a3677fd870c48db4094c350cd4532904f3cef5bb0d964bc8f4f4fc3e9044802204dd66952074f9c080925abaeec0cdcc5bbb809472227c4b27e4c6eae8aeb5e04412103ebae722891c60cad85358fde5aa0bc8b9b9d28272e89e4808e4ffe81831fad16ffffffff01941f000000000000d408626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b557a8254887e557a8254887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976aa6c88ac00000000',
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