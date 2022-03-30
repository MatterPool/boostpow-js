# Boost POW Javascript Library
> Boost Proof of Work Protocol
> https://boostpow.com

Boost is a new type of content ranking system that enables users to increase the amount of energy required to mine or process their content. Users will boost their post as a way to signal to the network that they believe their information is valuable. Boosted posts will appear in the boost feed – ordered by the amount of energy requested for their information.

[![ProofOfWorkCompany](https://circleci.com/gh/ProofOfWorkCompany/boostpow-js.svg?style=shield)](https://circleci.com/gh/ProofOfWorkCompany/boostpow-js)
[![Node.js CI](https://github.com/ProofOfWorkCompany/boostpow-js/actions/workflows/node.js.yml/badge.svg)](https://github.com/ProofOfWorkCompany/boostpow-js/actions/workflows/node.js.yml)
[![npm version](https://badge.fury.io/js/boostpow.svg)](https://badge.fury.io/js/boostpow)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Preview

A Boost Pow String (also called "Boost Header") consist of an 80 byte string that is encoded identically to a Bitcoin Block Header.  The string is valid if the hash256 of the string is less than the target difficulty specified inside the string.

We can objectively order content of Boost Pow Strings from most to least energy (difficulty) in a way that is self-evident and provable. The world's first provably fair content ranking system powered by native Bitcoin Proof of Work.

**Boost Pow String:**
```
010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991
```
And it's hash256 is: **0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca**

**Sample code to verify Boost Pow String**:
```javascript
// Validate a Boost Pow String
// Underneath bsv.js validates the string *exactly* like a Bitcoin Block Header
const powString = boost.BoostPowString.fromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
// Print out the decoded string
console.log(powString.toObject());
/*
{
    hash: '0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc',
    content: '00000000000000000000000000000000000000000048656c6c6f20776f726c64',
    bits: 486604799,
    difficulty: 1,
    metadataHash: "acd8278e84b037c47565df65a981d72fb09be5262e8783d4cf4e42633615962a",
    time: 1305200806,
    nonce: 3698479534,
    category: 1,
}
*/
```

## Installation

```sh
npm install boostpow --save
```

# Boost POW

**A Protocol for Buying and Selling Proof-of-Work Embedded in Bitcoin Script**

<a href='https://pow.co/'>pow.co</a>

Boost is a new type of content ranking system that enables users to increase the amount of energy required to mine or process their content. Users will boost their post as a way to signal to the network that they believe their information is valuable. Boosted posts will appear in the boost feed – ordered by the amount of energy requested for their information.

**Links**:

- <a href='https://github.com/ProofOfWorkCompany/boostpow-js'>Javascript SDK: boostpow</a>
- <a href='https://media.bitcoinfiles.org/52fb4bedc85854638af61a7f906bf8e93da847d2ddb522b1aec53cfc6a0b2023'>Whitepaper</a>

## MoneyButton, Relay, TwetchPay Integration

Easily integrate <a href='https://moneybutton.com'>MoneyButton</a>, <a href='https://relayx.io'>Relay</a>, and <a href='https://pay.twetch.com/docs'>TwetchPay</a>

Consult the respective documentation for additional details. All services support the 'outputs' format presented below for easy integration.

```javascript
const boost = require('boostpow');
// Create a Boost request with your data
const boostJob = boost.BoostPowJob.fromObject({
  content: Buffer.from('hello world', 'utf8').toString('hex'),
  diff: 1, // Minimum '1'. Specifies how much hashrate. 1 = difficulty of Bitcoin Genesis (7 MH/second)
  category: Buffer.from('B', 'utf8').toString('hex'),
  additionalData: Buffer.from(`{ "foo": 1234, "metadata": "hello"}`, 'utf8').toString('hex'),
  userNonce: Buffer.from(Math.random(999999999), 'utf8').toString('hex'),
  tag: Buffer.from('funny-animals', 'utf8').toString('hex'),
});
// Construct a MoneyButton or Relay Output
const boostOutputs = [{
  script: boostJob.toASM(),
  amount: boostJob.getDiff() * 0.0001, // Charge a fee for the Boost. In future this will be a feeQuote system. Higher payout the more likely a miner will mine the boost relativity to the diff.
  currency: "BSV"
}];

// Now you can populate MoneyButton, Relay or TwetchPay with the outputs:
twetchPay.pay({
  label: 'Boost Content',
  outputs: boostOutputs,
  onPayment: async (e) => {
    // submit to the JSON API for immediate indexing
    // In the future a planaria will pick it up automatically on-chain, for now submit the rawtx
  }
});

```

> The above command returns JSON structured like this after successfully submitting.

```json
{
  "success": true,
  "result": {
    "boostPowString": null,
    "boostPowMetadata": null,
    "boostHash": null,
    "boostJobId": "cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267.0",
    "boostJobProofId": null,
    "boostJob": {
      "boostJobId": "cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267.0",
      "createdTime": 1586125104,
      "txid": "cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267",
      "vout": 0,
      "scripthash": "b94f7355830581e0776d91b752bcea9856d4f5b6d0fbccb9d5628fff16180fce",
      "value": 10000,
      "diff": 1,
      "rawtx": "01000000026d78236444e4ffcae65b0b7ac467774ee9bb9bf233022231f918195056990504050000006a47304402204c41bfabb9a6114a1bb9472f9eeffceb4fe809aa2724dc5cb01d02b230a7c79102202bbe6bfae1c7ef183f060377ad1bfd36dc45a8fcc9dd5aad36f0b079b4cc0e374121021de3f773245db6d0aa1fa0a45483226e1dc4245fbf107dafe6614a5619700534ffffffff0e8358d2a0695438ca0086748c5eca4920a21c3412f9215389befc024341a61f030000006a4730440220136058bf2a4968f1aa6c1fb838ddb3addc09c4a0a5e0ab799eafa863c6da370c02204b81d1957c7f091b35c00f3baa4f1cc144208e42753b61457915f39cbdff4fd14121027651f21529831fc06155b71d1e673dccecdec87b9327367c8f3f4d6e6cdd484cffffffff021027000000000000e108626f6f7374706f7775040000000020747365742061207369207369687400000000000000000000000000000000000004ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac783c0000000000001976a9141c0a355b69698600f78cccd184c2cee02206c99188ac00000000",
      "spentTxid": null,
      "spentVout": 0,
      "spentRawtx": null,
      "spentScripthash": null
    },
    "boostData": {
      "categoryutf8": "",
      "category": "00000000",
      "contentutf8": "this is a test",
      "content": "0000000000000000000000000000000000007468697320697320612074657374",
      "tagutf8": "",
      "tag": "0000000000000000000000000000000000000000",
      "usernonce": "00000000",
      "additionaldatautf8": "",
      "additionaldata": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  }
}

```

# Boost Content Ranking

Easily query your own content and cross check against Boost POW signals to obtain the Boost Rank.

It leaves your existing objects the same, but adds a 'hash' and 'boostpow' member variables added to your objects.

## Publish Widget

<a href='https://publish.boost.pow.co/docs.html'>Open Docs</a>

<a href='https://publish.boost.pow.co'>Sample Boost Widget</a>

Boost Publisher Widget is a simple way to boost content from your website.

Currently supported wallets are TwetchPay, Money Button and RelayX.

The simplest Boost Publisher usage looks like this:

```javascript
// in HTML
<script src="https://publish.boostpow.com/publish.js"></script>

// in javascript
boostPublish.open({
  outputs: [],
  onPayment: function(payment, boostJobStatus) {
	  console.log(payment, boostJobStatus);
  }
});

```

## Build and Test

```
npm install
npm run build
npm run test
```

-----------

## Any questions or ideas?

Daniel Krawisz - daniel@pow.co
Derrick Horton - derrick@pow.co
Rafael LaVerde - rafael@pow.co
Steven Zeiler  - steven@pow.co

