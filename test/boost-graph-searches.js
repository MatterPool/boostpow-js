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
         console.log(item);
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
        "limit": 10000
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

   it('search total difficulty for a peice of content', async () => {
      const result = await index.Graph(options).search({
         contentutf8: 'test1235',
         categoryutf8: 'mttr',
         tagutf8: 'bitcoin-protocol'
      });

      expect(result.first.entity.content()).to.eql('test1235');
      expect(result.first.totalDifficulty).to.eql(1);
      expect(result.list[0].entity.content()).to.eql('test1235');


   });

});