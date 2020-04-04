'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');

var options = {
   graph_api_url: 'http://localhost:3000'
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

       expect(result.first.totalDifficulty).to.eql(23);
       expect(result.list[0].totalDifficulty).to.eql(23);
       expect(result.second.totalDifficulty).to.eql(1);
       expect(result.list[1].totalDifficulty).to.eql(1);
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
      expect(result.first.totalDifficulty).to.eql(3);
      expect(result.list[0].totalDifficulty).to.eql(3);
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
      expect(result.first.totalDifficulty).to.eql(5);
      expect(result.length).to.eql(1);
   });
   it('retrieve all signals for content. Dedup by category, content and usernonce only', async () => {
      // todo if you see this
   });

});