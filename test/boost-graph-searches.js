'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');

var options = {
   graph_api_url: 'http://localhost:3000'
}

describe('Graph Search', () => {

   it('search matching content', async () => {
      const result = await index.Graph(options).search({
         contentutf8: 'Hello Boost'
      }, {});
      console.log('result', result);
      expect(!!result.result.length).to.eql(true);
   });

  /* it('search all content returned in resultset', async () => {
      const response = await index.Graph(options).search({
         minedTimeFrom: 1577836800,
         minedTimeEnd: 1585440000
      });
      const ranker = new index.Rank();
      for (const item of response.result.mined) {
         ranker.add(item.powString);
      }
      expect(ranker.list).to.eql([
         {

         }
      ]);
   });
*/
});