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
      try {
         const job = await index.Graph(options).loadBoostJob('debbd830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301');
         expect(job.toObject()).to.eql({
            content:'00000000000000000000000000000000000000000048656c6c6f20426f6f7374',
            diff: 1,
            category: '00000000',
            tag: '0000000000000000000000000000000000000000',
            metadata: '0000000000000000000000000000000000000000000000000000000000000000',
            unique: '0000000000000000'
         });
      } catch(ex) {
         expect(true).to.eql(false);
      }
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
         await index.Graph().loadBoostJob('deb2d830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301');
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
         await index.Graph().loadBoostJob('deb2d830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301');
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
      const job = await index.Graph().loadBoostJob('dc36f3baa9b7e96827928760c07a160579b0a531814e3a3900c1c4112c4a92e7');
      const utxos = await index.Graph().getBoostJobUtxos(job.getScriptHash());
      delete utxos[0].confirmations;
      expect(utxos).to.eql([
         {
             "scripthash": "03b508a9da0879dd55619e06f5bd656696f77ba879aaa99e0eb22cedd7dd4846",
             "txid": "dc36f3baa9b7e96827928760c07a160579b0a531814e3a3900c1c4112c4a92e7",
             "vout": 0,
             "amount": 0.00004363,
             "satoshis": 4363,
             "value": 4363,
             "height": 625311,
             // "confirmations": 63,
             "outputIndex": 0
         }
     ]);
   });

   it('loadBoostJob and getBoostJobUnspentOutputs Capitalism quote', async () => {
      // Capitalists can spend more energy that socialists.?
      const job = await index.Graph().loadBoostJob('353dea0d0fd4b140058e409417802a1ca18b23576f82cd312378b6c912407502');
      const capital = Buffer.from('Capitalists can spend more energy than socialists.', 'utf8');
      expect(capital.toString('hex')).to.eql('4361706974616c697374732063616e207370656e64206d6f726520656e65726779207468616e20736f6369616c697374732e');

      const hashed = bsv.crypto.Hash.sha256(capital).toString('hex');
      const expectedHash = '8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835';
      expect(expectedHash).to.eql(hashed);
      expect(index.BoostUtilsHelper.getSha256(capital.toString())).to.eql(hashed);
      expect(job.getContentHex()).to.eql(expectedHash);
      const utxos = await index.Graph().getBoostJobUtxos(job.getScriptHash());
      delete utxos[0].confirmations;

      expect(utxos).to.eql([
         {
             "scripthash": "156d3e09f9d76279ebc1fd6bb49483474eb6bf7d26e7791c3f90437b5050a1b5",
             "txid": "353dea0d0fd4b140058e409417802a1ca18b23576f82cd312378b6c912407502",
             "vout": 0,
             "amount": 0.00005058,
             "satoshis": 5058,
             "value": 5058,
             "height": 625648,
             // "confirmations": 63,
             "outputIndex": 0
         }
     ]);
   });
/*
   it('submitBoost', async () => {
      const loadedJob = await index.Graph().loadBoostJob('353dea0d0fd4b140058e409417802a1ca18b23576f82cd312378b6c912407502');
      expect(loadedJob).to.eql({
         content: '8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835',
         diff: 1,
         category: '00000000',
         tag: '0000000000000000000000000000000000000000',
         metadata: '0000000000000000000000000000000000000000000000000000000000000000',
         unique: '0000000000000000'
      });

      expect(loadedJob.toHex()).to.eql('asdf');
      const submitJobStatus = await index.Graph().submitBoostJob(loadedJob.toHex());

      expect(submitJobStatus).to.eql([
         {
            success: true,
            result: {
               txid: 'sdf',
            }
         }
     ]);
   });*/

   it('submitBoostJob', async () => {
      await index.Graph(options).loadBoostJob('353dea0d0fd4b140058e409417802a1ca18b23576f82cd312378b6c912407502');
      const rawtx = '01000000012e3911b9e0d16ae603677dc4ca97f06fdfae84c324b1372f9f172e39a7f007a2020000006a47304402203c4ded353ebd13e2f503de7800f643ed737027042fdd195d8c8edef22c66cb8b022013d1a5b46a6938016bb15a812cb5a6b74c2f36f8f265188863c8080a74b20ee34121027842e3e45af0b2bea9c80138ca3f2a0b15b562bdbb4ddd2f7aae551e92155cc6ffffffff02c213000000000000d40831307674736f6f627504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d1400000000000000000000000000000000000000000800000000000000002000000000000000000000000000000000000000000000000000000000000000005879825488567a766b7b5479825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b577a825888547f6b7e7b7e7e7eaa7c7e7e7e7c7e6c7e6c7eaa6c9f6976aa6c88acdd5c5118000000001976a914591ef1803803ab0332644b7b039a1e3d1160194388ac00000000';
      index.BoostPowJob.fromRawTransaction(rawtx);
      try {
         const result = await index.Graph(options).submitBoostJob(rawtx);
         expect(result).to.eql({
            success: true,
            result: {
               txid: '353dea0d0fd4b140058e409417802a1ca18b23576f82cd312378b6c912407502',
               vout: 0,
               scripthash: '156d3e09f9d76279ebc1fd6bb49483474eb6bf7d26e7791c3f90437b5050a1b5'
            },
         });
      } catch (ex) {
         console.log('ex', ex);
         expect(false).to.eql(true);
      }
   });

   /*
   it('createBoost', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835',
         diff: 1,
         category: '00000000',
         tag: '0000000000000000000000000000000000000000',
         metadata: '0000000000000000000000000000000000000000000000000000000000000000',
         unique: '0000000000000000'
      });

      expect(job.toHex()).to.eql('0831307674736f6f627504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d1400000000000000000000000000000000000000000800000000000000002000000000000000000000000000000000000000000000000000000000000000005879825488567a766b7b5479825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b577a825888547f6b7e7b7e7e7eaa7c7e7e7e7c7e6c7e6c7eaa6c9f6976aa6c88ac');

      const rawtx = await index.Graph().createBoostJob({
         boost: {
            content: 'hello',
            diff: 1,
            // optional
            tag: 'helloworld',
            metadata: 'string',
            unique: 3,
         },
         pay: {
            tx: 'sdf', // paying tx
            // key: privateKey,
            // value: 40000,
            // currency: 'satoshi'
         }
      });
      const boostJob = BoostPowJob.fromTransaction(rawtx);

      // Some time later
      const boostPowStrings = index.Graph().getBoostPowStringsByScriptHash(boostJob.getScriptHash());

     expect(boostJob).to.eql(
        {
         content: '8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835',
         diff: 1,
         category: '00000000',
         tag: '0000000000000000000000000000000000000000',
         metadata: '0000000000000000000000000000000000000000000000000000000000000000',
         unique: '0000000000000000'
         }
      );


   });
*/
/*
   it('createBoost', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835',
         diff: 1,
         category: '00000000',
         tag: '0000000000000000000000000000000000000000',
         metadata: '0000000000000000000000000000000000000000000000000000000000000000',
         unique: '0000000000000000'
      });

      expect(job.toHex()).to.eql('0831307674736f6f627504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d1400000000000000000000000000000000000000000800000000000000002000000000000000000000000000000000000000000000000000000000000000005879825488567a766b7b5479825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b577a825888547f6b7e7b7e7e7eaa7c7e7e7e7c7e6c7e6c7eaa6c9f6976aa6c88ac');

      const boostJob = await index.Graph().create({
         boost: {
            content: 'hello',
            diff: 1,
            // optional
            tag: 'helloworld',
            metadata: 'string',
            unique: 3,
         },
         pay: {
            key: privateKey,
            value: 40000,
            currency: 'satoshi'
         }
      }).then((rawtxBoostJob) => {
         console.log('rawtxboost', rawtxBoostJob);
         return BoostPowJob.fromTransaction(rawtxBoostJob);
      }).catch((err) => {
         console.log('err', err);
      });

     expect(boostJob).to.eql(
        {
         content: '8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835',
         diff: 1,
         category: '00000000',
         tag: '0000000000000000000000000000000000000000',
         metadata: '0000000000000000000000000000000000000000000000000000000000000000',
         unique: '0000000000000000'
         }
      );


   });*/
});