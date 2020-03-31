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
         signals.push(signal);
      }
      expect(signals.length > 0).to.eql(true);
   });

});