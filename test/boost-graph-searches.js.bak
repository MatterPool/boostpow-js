'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');

var options = {
  // graph_api_url: 'http://localhost:3000'
}

describe('Graph Search', () => {

   it('search matching contentutf8', async () => {
      const s = 'Hello Boost Test9323';
      const result = await index.Graph(options).rawSearch({
         contentutf8: s
      });

      let signals = [];
      for (const item of result.mined) {
         const signal = index.BoostSignal.fromHex(item.boostPowString, item.boostPowMetadata);
         expect(signal.content()).to.eql(s);
         signals.push(signal);
      }
      expect(signals.length > 0).to.eql(true);
   });

   it('search matching contenthex', async () => {
      const s = '00000000000000000000000048656c6c6f20426f6f7374205465737439333233';
      const result = await index.Graph(options).rawSearch({
         contenthex: s
      });

      let signals = [];
      for (const item of result.mined) {
         const signal = index.BoostSignal.fromHex(item.boostPowString, item.boostPowMetadata);
         expect(signal.content(true)).to.eql(s);
         signals.push(signal);
      }
      expect(signals.length > 0).to.eql(true);
   });
   it('search matching contenthex and content', async () => {
      const s = '00000000000000000000000048656c6c6f20426f6f7374205465737439333233';
      const s2 = 'Hello Boost Test9323';
      const result = await index.Graph(options).rawSearch({
         contenthex: s,
         contentutf8: s2
      });

      let signals = [];
      for (const item of result.mined) {
         const signal = index.BoostSignal.fromHex(item.boostPowString, item.boostPowMetadata);
         expect(signal.content(true)).to.eql(s);
         expect(signal.content()).to.eql(s2);
         signals.push(signal);
      }
      expect(signals.length > 0).to.eql(true);

      const result2 = await index.Graph(options).rawSearch({categoryutf8: 'mttr'});
      let signals2 = [];
      for (const item of result2.mined) {
         const signal = index.BoostSignal.fromHex(item.boostPowString, item.boostPowMetadata);
         expect(signal.category(true)).to.eql('6d747472');
         expect(signal.category()).to.eql('mttr');
         signals.push(signals2);
      }
      expect(signals2.length > 0).to.eql(false);
   });

   it('search matching not found empty', async () => {
      const s2 = 'super secret string';
      const result = await index.Graph(options).rawSearch({
         contentutf8: s2
      });

      expect(result).to.eql({
        "mined": [],
        "nextPaginationToken": null,
        "q": {
         "contentutf8": "super secret string",
        "limit": 10000,
        "be": true,
        "debug": true,
         "expanded": true
         }
      });
   });
   it('search all', async () => {
      const result = await index.Graph(options).rawSearch();

      let signals = [];
      for (const item of result.mined) {
         const signal = index.BoostSignal.fromHex(item.boostPowString, item.boostPowMetadata);
         expect(!!signal).to.eql(true);
         signals.push(signals);
      }
      expect(signals.length > 0).to.eql(true);
   });

   it('search rawsearch', async () => {
      const result = await index.Graph(options).rawSearch({contentutf8: 'test1235'});

      let signals = [];
      for (const item of result.mined) {
         const signal = index.BoostSignal.fromHex(item.boostPowString, item.boostPowMetadata);
         expect(!!signal).to.eql(true);

         signals.push(signals);
      }
      expect(signals.length > 0).to.eql(true);

   });

   it('search by content hex and only get back content hex', async () => {
      const result = await index.Graph(options).search({
         contentutf8: 'test1235',
         categoryutf8: 'mttr',
         tagutf8: 'bitcoin-protocol'
      });
      for (const item of result.list) {
         expect(item.entity.content()).to.eql('test1235');
         expect(item.entity.category()).to.eql('mttr');
         expect(item.entity.tag()).to.eql('bitcoin-protocol');
      }
      expect(result.length > 0).to.eql(true);
   });

   it('search total difficulty for a peice of content', async () => {
      const result = await index.Graph(options).search({
         contentutf8: 'test1235',
         categoryutf8: 'mttr',
         tagutf8: 'bitcoin-protocol'
      });
      expect(result.length).to.eql(1);
      expect(result.first.entity.content()).to.eql('test1235');
      expect(result.first.totalDifficulty).to.eql(2);
      expect(result.list[0].entity.content()).to.eql('test1235');
   });

   it('retrieve no matching signals at all', async () => {
      const result = await index.Graph(options).search({
         contentutf8: ['asdfsdfi1219092jkrha111'],
      });
      expect(result.first).to.eql(null);
      expect(result.second).to.eql(null);
      expect(result.third).to.eql(null);
      expect(result.last).to.eql(null);
      expect(result.length).to.eql(0);
   });

   it('CURRENT_TEST retrieve all signals that match at least one of content', async () => {
      const result = await index.Graph(options).search({
         contentutf8: ['hello', 'Hello World'],
      });
      for (const item of result.list) {
         if (item.entity.content() !== 'hello' && item.entity.content() !== 'Hello World') {
            expect(item.entity.content()).to.eql('fail');
            expect('Fail').to.eql('Non matching hello and Hello World! returned: ' + item.entity.content());
         }
       }
       expect(result.length > 1).to.eql(true);
       expect(result.totalDifficulty).to.eql(24);
       expect(result.first.totalDifficulty).to.eql(13);
       expect(result.list[0].totalDifficulty).to.eql(13);
       expect(result.second.totalDifficulty).to.eql(10);
       expect(result.list[1].totalDifficulty).to.eql(10);
   });

   it('retrieve all signals that match the content and tags', async () => {
      let result = await index.Graph(options).search({
         contentutf8: ['supertest9382', 'superanimal9389', 'supertest9382'],
      });

      for (const item of result.list) {
         if (item.entity.content() !== 'supertest9382' && item.entity.content() !== 'superanimal9389' && item.entity.content() !== 'supertest9382') {
            expect('Fail').to.eql('Non matching string returned: ' + item.entity.content());
         }
      }

      expect(result.length > 0).to.eql(true);
      expect(result.totalDifficulty).to.eql(5);
      expect(result.first.totalDifficulty).to.eql(2);
      expect(result.list[0].totalDifficulty).to.eql(2);
      expect(result.second.totalDifficulty).to.eql(2);
      expect(result.list[1].totalDifficulty).to.eql(2);


      result = await index.Graph(options).search({
         contentutf8: 'supertest9382',
         categoryutf8: 'mttr'
      });

      for (const item of result.list) {
         if (item.entity.content() !== 'supertest9382') {
            expect('Fail').to.eql('Non matching string returned: ' + item.entity.content());
         }
       }
       expect(result.length > 0).to.eql(true);
       expect(result.totalDifficulty).to.eql(1);
       expect(result.first.totalDifficulty).to.eql(1);
       expect(result.list[0].totalDifficulty).to.eql(1);

   });

   it('retrieve all signals that match category', async () => {
      const result = await index.Graph(options).search({
         category: '5421',                // Use single value. optional array performs logicsl OR for lookup.
         content: ['hello4545823'],       // Use array. optional array performs logicsl OR for lookup.
      });

      expect(result.first.entity.content()).to.eql('hello4545823');
      expect(result.first.entity.category()).to.eql('5421');
      expect(result.first.totalDifficulty).to.eql(2);
      expect(result.totalDifficulty).to.eql(2);
   });

   it('retrieve all signals for a content and category', async () => {
      const result = await index.Graph(options).search({
         category: '5421',                // Use single value. optional array performs logicsl OR for lookup.
         content: ['hello4545823'],       // Use array. optional array performs logicsl OR for lookup.
      });

      expect(result.first.entity.content()).to.eql('hello4545823');
      expect(result.first.entity.category()).to.eql('5421');
      expect(result.first.totalDifficulty).to.eql(2);
      expect(result.length).to.eql(1);
   });

   it('retrieve all signals for content. Dedup by content and usernonce only', async () => {
      const result = await index.Graph(options).search({
         content: ['usernoncetest314'],       // Use array. optional array performs logicsl OR for lookup.
      });
      expect(result.first.totalDifficulty).to.eql(4);
      expect(result.length).to.eql(2);
   });

   it('retrieve all for everything (limits to 1 week of data)', async () => {
      const result = await index.Graph(options).search();
      expect(result.length > 0).to.eql(true);
   });

   it('retrieve and cross check transactions test_curr', async () => {
      const ranker = await index.Graph(options).search({
         // Get all mined boost signals in past 3 days
         minedTimeFrom: Math.round((new Date()).getTime() / 1000) - (3600 * 72)
      });
      // Or use standalonen with:
      // const ranker = index.BoostSignalRanker.fromArray(result);
      const boostRanked = ranker.rank([
         'eb497f88173ac22d0542076e6e4d8e58d8afa0591d60925c4679216a47df35e1',
         '4048289b19a77bd6e7a3acebe90fa975faa1ea1445e59bccfb3ca79b6d0e0e0e',
         {
            // Handles duplicates
            hash: 'eb497f88173ac22d0542076e6e4d8e58d8afa0591d60925c4679216a47df35e1',
         }
      ]);
      expect(boostRanked).to.eql([
         {
            "hash":"4048289b19a77bd6e7a3acebe90fa975faa1ea1445e59bccfb3ca79b6d0e0e0e",
            "boostpow":{
               "signals":[
                  {
                     "boosthash":"0000000002ec8c1e72aa09ebb0dc55a0d24055626d41778a7ebd3ef635732eeb",
                     "boostPowString":"420000000e0e0e6d9ba73cfbcc9be54514eaa1fa75a90fe9ebaca3e7d67ba7199b2848402f8e540524bc0dbacc53e7c33eb7906dbf0f3ffad41b141b57c5ee3dee02016ac610065f0842081c0ceb69b2",
                     "boostPowMetadata":"000000000000000000000000000000000000000092e4d5ab4bb067f872d28f44d3e5433e56fca1900c67e2940000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                     "boostPowJobId":"8aba9c2f2d3274bb0fa9c335621cafa4ec198ef68e17469e3f1e9c901dfc3f5a.1",
                     "boostPowJobProofId":"5f9da48a4b7b919d8a7ebfe485593e7c962e574ee970d385e1d92bfd50c0fd83.0",
                     "contenthex":"4048289b19a77bd6e7a3acebe90fa975faa1ea1445e59bccfb3ca79b6d0e0e0e",
                     "category":"\u0000\u0000\u0000B",
                     "categoryhex":"00000042",
                     "userNoncehex":"00000000",
                     "additionalData":"",
                     "additionalDatahex":"000000000000000000000000000000000000000000000000000000000000000000000000",
                     "tag":"",
                     "taghex":"0000000000000000000000000000000000000000",
                     "metadataHash":"6a0102ee3deec5571b141bd4fa3f0fbf6d90b73ec3e753ccba0dbc2405548e2f",
                     "minerPubKeyHash":"92e4d5ab4bb067f872d28f44d3e5433e56fca190",
                     "time":1594233030,
                     "difficulty":31.00001478
                  },
                  {
                     "boosthash":"00000000519fadfaae536cf55b14e9f724e3cd3d52444d778258446f27fa0683",
                     "boostPowString":"420000000e0e0e6d9ba73cfbcc9be54514eaa1fa75a90fe9ebaca3e7d67ba7199b28484007bd567870ceb5afb08d6b245dffc0815adc900771f10a627fad51a38857193e5e3b045fffff001d15325cc6",
                     "boostPowMetadata":"000000000000000000000000000000000000000092e4d5ab4bb067f872d28f44d3e5433e56fca1900c64e3b70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                     "boostPowJobId":"7702356e61bfd118e739a7579dfe6bb142ecea142e753b2ac4bcc9e6b1a4407d.0",
                     "boostPowJobProofId":"2ca5e31857d41182134d0e33163377ddfbbf860881bf4a178762bdbbebab47b4.0",
                     "contenthex":"4048289b19a77bd6e7a3acebe90fa975faa1ea1445e59bccfb3ca79b6d0e0e0e",
                     "category":"\u0000\u0000\u0000B",
                     "categoryhex":"00000042",
                     "userNoncehex":"00000000",
                     "additionalData":"",
                     "additionalDatahex":"000000000000000000000000000000000000000000000000000000000000000000000000",
                     "tag":"",
                     "taghex":"0000000000000000000000000000000000000000",
                     "metadataHash":"3e195788a351ad7f620af1710790dc5a81c0ff5d246b8db0afb5ce707856bd07",
                     "minerPubKeyHash":"92e4d5ab4bb067f872d28f44d3e5433e56fca190",
                     "time":1594112862,
                     "difficulty":1
                  },
                  {
                     "boosthash":"0000000072108f845702ed90d55bf74069f25b0899f99eb7b93a64e37e1f83de",
                     "boostPowString":"420000000e0e0e6d9ba73cfbcc9be54514eaa1fa75a90fe9ebaca3e7d67ba7199b2848405ce0d65410ad2cf32eabd8f4dfe0436d746e76b340e98c4442f21dfd3bf86e9b4bb5035fffff001d18cad831",
                     "boostPowMetadata":"000000000000000000000000000000000000000092e4d5ab4bb067f872d28f44d3e5433e56fca1900c64019f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                     "boostPowJobId":"a7be0275f92cf2d173ece823834b200da34f9bbbcc5c3342390729b17e7ce2da.0",
                     "boostPowJobProofId":"1893bf9774399c281e56689db426678b48775dab6b7909320453a422f63e59cf.0",
                     "contenthex":"4048289b19a77bd6e7a3acebe90fa975faa1ea1445e59bccfb3ca79b6d0e0e0e",
                     "category":"\u0000\u0000\u0000B",
                     "categoryhex":"00000042",
                     "userNoncehex":"00000000",
                     "additionalData":"",
                     "additionalDatahex":"000000000000000000000000000000000000000000000000000000000000000000000000",
                     "tag":"",
                     "taghex":"0000000000000000000000000000000000000000",
                     "metadataHash":"9b6ef83bfd1df242448ce940b3766e746d43e0dff4d8ab2ef32cad1054d6e05c",
                     "minerPubKeyHash":"92e4d5ab4bb067f872d28f44d3e5433e56fca190",
                     "time":1594078539,
                     "difficulty":1
                  },
                  {
                     "boosthash":"0000000069f7d3f8d42b2c1fc1b1d03d25e52effebb29e59608352c95c3412ff",
                     "boostPowString":"420000000e0e0e6d9ba73cfbcc9be54514eaa1fa75a90fe9ebaca3e7d67ba7199b2848405ce0d65410ad2cf32eabd8f4dfe0436d746e76b340e98c4442f21dfd3bf86e9ba5b3035fffff001d0576b501",
                     "boostPowMetadata":"000000000000000000000000000000000000000092e4d5ab4bb067f872d28f44d3e5433e56fca1900c64019f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                     "boostPowJobId":"4fce8854df6519ed9af56c91b771b742605c4c830fd01bd299fc05919060a65d.0",
                     "boostPowJobProofId":"6e97d3f4eee3adf39136699a0bdb0e95838b7ffed8c523927421eccd711c04af.0",
                     "contenthex":"4048289b19a77bd6e7a3acebe90fa975faa1ea1445e59bccfb3ca79b6d0e0e0e",
                     "category":"\u0000\u0000\u0000B",
                     "categoryhex":"00000042",
                     "userNoncehex":"00000000",
                     "additionalData":"",
                     "additionalDatahex":"000000000000000000000000000000000000000000000000000000000000000000000000",
                     "tag":"",
                     "taghex":"0000000000000000000000000000000000000000",
                     "metadataHash":"9b6ef83bfd1df242448ce940b3766e746d43e0dff4d8ab2ef32cad1054d6e05c",
                     "minerPubKeyHash":"92e4d5ab4bb067f872d28f44d3e5433e56fca190",
                     "time":1594078117,
                     "difficulty":1
                  },
                  {
                     "boosthash":"000000002888ded933784a8a714618a1de278230e81f3cf3856a55ab18445886",
                     "boostPowString":"420000000e0e0e6d9ba73cfbcc9be54514eaa1fa75a90fe9ebaca3e7d67ba7199b284840eed77e74a924595d06d1565f6f1dbd5fcb7ddf7ac0cb8157c367757369d0fe62c293045fffff001d040a2233",
                     "boostPowMetadata":"000000000000000000000000000000000000000092e4d5ab4bb067f872d28f44d3e5433e56fca1900c6571770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                     "boostPowJobId":"fa562caf0455f4903c849ae89a479ac8f5006b68e1a0131625b2554d89c0732c.0",
                     "boostPowJobProofId":"9de83906e6c55c7370f05cf50942fd6fd6634e321f28dfd62da609a8c628b867.0",
                     "contenthex":"4048289b19a77bd6e7a3acebe90fa975faa1ea1445e59bccfb3ca79b6d0e0e0e",
                     "category":"\u0000\u0000\u0000B",
                     "categoryhex":"00000042",
                     "userNoncehex":"00000000",
                     "additionalData":"",
                     "additionalDatahex":"000000000000000000000000000000000000000000000000000000000000000000000000",
                     "tag":"",
                     "taghex":"0000000000000000000000000000000000000000",
                     "metadataHash":"62fed069737567c35781cbc07adf7dcb5fbd1d6f5f56d1065d5924a9747ed7ee",
                     "minerPubKeyHash":"92e4d5ab4bb067f872d28f44d3e5433e56fca190",
                     "time":1594135490,
                     "difficulty":1
                  }
               ],
               "totalDifficulty":35.00001478,
               "lastSignalTime":1594078117,
               "recentSignalTime":1594233030
            }
         },
         {
            "hash":"eb497f88173ac22d0542076e6e4d8e58d8afa0591d60925c4679216a47df35e1",
            "boostpow":{
               "signals":[
                  {
                     "boosthash":"000000004e70c6a0c24ab8ece1b522e3074cffec7a95fed2ead8129f27bdf936",
                     "boostPowString":"42000000e135df476a2179465c92601d59a0afd8588e4d6e6e0742052dc23a17887f49eb0bc5fe947c636ff5872780b4572f625202622d5fdb3a94318b3dd7071f6a9742891a045fffff001d02f6b838",
                     "boostPowMetadata":"67736f240000000000000000000000000000000092e4d5ab4bb067f872d28f44d3e5433e56fca1900c64a6aa0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                     "boostPowJobId":"a1482fb5ee09f2a3101624038d8a89b9ef8cfd436c2033e36b352698be004c16.1",
                     "boostPowJobProofId":"20673d9d7b56e9fc5f6490d4ece76b84e0665d82921afb70f6b4a48c97ef2b51.0",
                     "contenthex":"eb497f88173ac22d0542076e6e4d8e58d8afa0591d60925c4679216a47df35e1",
                     "category":"\u0000\u0000\u0000B",
                     "categoryhex":"00000042",
                     "userNoncehex":"00000000",
                     "additionalData":"",
                     "additionalDatahex":"000000000000000000000000000000000000000000000000000000000000000000000000",
                     "tag":"$osg",
                     "taghex":"00000000000000000000000000000000246f7367",
                     "metadataHash":"42976a1f07d73d8b31943adb5f2d620252622f57b4802787f56f637c94fec50b",
                     "minerPubKeyHash":"92e4d5ab4bb067f872d28f44d3e5433e56fca190",
                     "time":1594104457,
                     "difficulty":1
                  }
               ],
               "totalDifficulty":1,
               "lastSignalTime":1594104457,
               "recentSignalTime":1594104457
            }
         }
      ]);
   });

});