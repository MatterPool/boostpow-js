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
    // mattercloud.setApiKey('my key');
    var result = Boost.MagicString.fromString('010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991');
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

matterpool.io

boostpow.com

