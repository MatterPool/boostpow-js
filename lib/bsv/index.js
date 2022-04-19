'use strict'

var bsv = module.exports

// crypto
bsv.crypto = {}
var bsv_crypto_bn = require('./crypto/bn')
bsv.crypto.BN = bsv_crypto_bn
bsv.crypto.ECDSA = require('./crypto/ecdsa')
bsv.crypto.Hash = require('./crypto/hash')
bsv.crypto.Random = require('./crypto/random')
bsv.crypto.Point = require('./crypto/point')
bsv.crypto.Signature = require('./crypto/signature')

// encoding
bsv.encoding = {}
bsv.encoding.Base58 = require('./encoding/base58')
bsv.encoding.Base58Check = require('./encoding/base58check')
bsv.encoding.BufferReader = require('./encoding/bufferreader')
bsv.encoding.BufferWriter = require('./encoding/bufferwriter')
bsv.encoding.Varint = require('./encoding/varint')

// utilities
bsv.util = {}
bsv.util.js = require('./util/javas')
bsv.util.preconditions = require('./util/preconditions')

// errors thrown by the library
bsv.errors = require('./errors')

// main bitcoin library
//bsv.Address = require('./lib/address')
//bsv.Block = require('./lib/block')
//bsv.MerkleBlock = require('./lib/block/merkleblock')
bsv.BlockHeader = require('./block/blockheader')
//bsv.HDPrivateKey = require('./lib/hdprivatekey.js')
//bsv.HDPublicKey = require('./lib/hdpublickey.js')
//bsv.Networks = require('./lib/networks')
bsv.Opcode = require('./opcode')
bsv.PrivateKey = require('./privatekey')
bsv.PublicKey = require('./publickey')
bsv.Script = require('./script')
bsv.Transaction = require('./transaction')
