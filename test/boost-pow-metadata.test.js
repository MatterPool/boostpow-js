'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

describe('boost #BoostPowMetadata tests', () => {

   it('should success create', async () => {
      const abstract = index.BoostPowMetadata.fromObject({
         tag: '01',
         minerPubKeyHash: '00000000000000000000000000000000000000a4',
         extraNonce1: '014e',
         extraNonce2: '21a0',
         userNonce: '00000011',
         additionalData: '0000000000000000000000000000000000000000000000000000000000000042',
      });

      const obj = abstract.toObject();
      expect(obj).to.eql({
         tag: '0000000000000000000000000000000000000001',
         minerPubKeyHash: '00000000000000000000000000000000000000a4',
         extraNonce1: '0000014e',
         extraNonce2: '000021a0',
         userNonce: '00000011',
         additionalData: '0000000000000000000000000000000000000000000000000000000000000042',
      });
   });

   it('should success create hex ', async () => {
      const abstract = index.BoostPowMetadata.fromObject({
         tag: '0000000000000000000000000000000000000001',
         minerPubKeyHash: '00000000000000000000000000000000000000a4',
         extraNonce1: '014e',
         extraNonce2: '21a0',
         userNonce: '00000001',
         additionalData: '0000000000000000000000000000000000000000000000000000000000000042',
      });

      const obj = abstract.toObject();
      expect(obj).to.eql({
         tag: '0000000000000000000000000000000000000001',
         minerPubKeyHash: '00000000000000000000000000000000000000a4',
         extraNonce1: '0000014e',
         extraNonce2: '000021a0',
         userNonce: '00000001',
         additionalData: '0000000000000000000000000000000000000000000000000000000000000042',
      });
      expect(abstract.toHex()).to.eql(               '0100000000000000000000000000000000000000a4000000000000000000000000000000000000004e010000a0210000010000004200000000000000000000000000000000000000000000000000000000000000');
      const fromHex = index.BoostPowMetadata.fromHex('0100000000000000000000000000000000000000a4000000000000000000000000000000000000004e010000a0210000010000004200000000000000000000000000000000000000000000000000000000000000');
      expect(abstract.toHex()).to.eql(fromHex.toHex());
      expect(fromHex.toObject()).to.eql(obj);
   });

   it('should success create and get hash of abstract', async () => {
      const fromHex = index.BoostPowMetadata.fromHex('0100000000000000000000000000000000000000a4000000000000000000000000000000000000004e010000a0210000010000004200000000000000000000000000000000000000000000000000000000000000');
      expect(fromHex.hash()).to.eql('2dd2ce3a9bd404105a56433e1e0ce8cfa458e0a3669ce45f56132fc23d18a125');
   });

});
