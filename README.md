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
And its hash256 is: **0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca**

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
  amount: boostJob.difficulty * 0.0001, // Charge a fee for the Boost. In future this will be a feeQuote system. Higher payout the more likely a miner will mine the boost relativity to the diff.
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
<script src="https://publish.boost.pow.co/publish.js"></script>

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

