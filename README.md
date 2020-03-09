# Boost POW Javascript Library
> Boost Proof of Work Protocol
> https://boostpow.com


Boost is a new type of content ranking system that enables users to increase the amount of energy required to mine or process their content. Users will boost their post as a way to signal to the network that they believe their information is valuable. Boosted posts will appear in the boost feed – ordered by the amount of energy requested for their information.

---

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
// See whitepaper for protocol description: <LINK>
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
npm install boostpow-js --save
```

### Usage examples

See usage examples at: https://github.com/MatterPool/boostpow-js/blob/master/test/boost-magic-string.test.js

Example Boost Job:

https://boostpow.com/job/f2f61baa9b8567b6bad79f6d5d2d627bbc3137d004f7fe4d8d13c2598e5270e1

https://search.matterpool.io/tx/f2f61baa9b8567b6bad79f6d5d2d627bbc3137d004f7fe4d8d13c2598e5270e1

```javascript
// Construct and validate a Boost Pow String constructed from an object
// An exception will be thrown if the Proof of work is invalid or there is anything corrupted

const obj = Boost.BoostPowString.fromObject({
  content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
  bits: 443192243,
  abstract: "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
  time: 1305200806,
  nonce: 2436437219,
  version: 1,
});
console.log(obj.toString());
// 010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991

// Construct and validate a Boost Pow String and then get the difficulty
const boostPowString = boost.BoostPowString.fromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
const diff = boostPowString.difficulty();
console.log(diff);
// 157416.40184364

// Attempt to just validate proof of work for a Boost Pow String (or Bitcoin Block Header!)
 const isValidPow = boost.BoostPowString.validProofOfWorkFromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
console.log(isValidPow);
// true

 const isValidPow = boost.BoostPowString.validProofOfWorkFromString('a10000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
console.log(isValidPow);
// false

```


## Browser Include
```javascript
// Node
var boost = require('boostpow-js');

```

```html
<!-- Browser -->
<script src="dist/boostpow.js"></script>
<script language="javascript">
    var result = Boost.BoostPowString.fromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
    console.log('result', result);
    document.getElementById('results').innerHTML = JSON.stringify(result.toObject());
</script>
```

## Build and Test

```
npm install
npm run build
npm run test
```

-----------

## Any questions or ideas?

@mxtterpool

https://boostpow.com

