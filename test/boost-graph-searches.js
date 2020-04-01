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
      const result = await index.Graph(options).search({
         contentutf8: s
      }, {});

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
      const result = await index.Graph(options).search({
         contenthex: s
      }, {});

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
      const result = await index.Graph(options).search({
         contenthex: s,
         contentutf8: s2
      }, {});

      let signals = [];
      for (const item of result.mined) {
         const signal = index.BoostSignal.fromHex(item.boostPowString, item.boostPowMetadata);
         expect(signal.content(true)).to.eql(s);
         expect(signal.content()).to.eql(s2);
         signals.push(signal);
      }
      expect(signals.length > 0).to.eql(true);

      const result2 = await index.Graph(options).search({categoryutf8: 'mttr'});
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
      const result = await index.Graph(options).search({
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
      const result = await index.Graph(options).search();

      let signals = [];
      for (const item of result.mined) {
         const signal = index.BoostSignal.fromHex(item.boostPowString, item.boostPowMetadata);
         expect(!!signal).to.eql(true);
         signals.push(signals);
      }
      expect(signals.length > 0).to.eql(true);
   });

   it('search all', async () => {
      const result = await index.Graph(options).search({contentutf8: 'test1235'});

      let signals = [];
      for (const item of result.mined) {
         const signal = index.BoostSignal.fromHex(item.boostPowString, item.boostPowMetadata);
         expect(!!signal).to.eql(true);
 
         signals.push(signals);
      }
      expect(signals.length > 0).to.eql(true);

   });

});