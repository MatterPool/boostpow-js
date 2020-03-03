# Boost Pow Javascript Library
> boostpow.com

See usage examples at: https://github.com/MatterPool/boostpow-js/blob/master/test/boost-magic-string.test.js

---

## Quick Start

**Installation**
```sh
npm install boostpow-js --save
```

**Include**
```javascript
// Node
var boostpow = require('boostpow-js');

```

```html
<!-- Browser -->
<script src="dist/boostpow.js"></script>
<script language="javascript">
    var result = Boost.MagicString.fromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
    console.log('result', result);
    document.getElementById('results').innerHTML = JSON.stringify(result.toObject());
</script>
```

### Usage examples

See usage at See usage examples at: https://github.com/MatterPool/boostpow-js/blob/master/test/boost-magic-string.test.js

```javascript
const obj = Boost.MagicString.fromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
console.log(obj);
/*
{
  hash: '0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca',
  content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
  bits: 443192243,
  abstract: "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
  time: 1305200806,
  nonce: 2436437219,
  version: 1,
}
*/

const obj = Boost.MagicString.fromObject({
  content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
  bits: 443192243,
  abstract: "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
  time: 1305200806,
  nonce: 2436437219,
  version: 1,
});
console.log(obj.toString());
// 010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991


```


## Build and Test

```
npm install
npm run build
npm run test
```

-----------

## Any questions or ideas?

matterpool.io

boostpow.com

