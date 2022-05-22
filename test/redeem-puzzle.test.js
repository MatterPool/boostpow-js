"use strict"
const expect = require("chai").expect
const index = require("..")

describe("redeem output test ", () => {
  const categoryHex = "d2040000"

  const contentHex = index.BoostUtilsHelper.stringToBuffer(
    "hello animal", 32).reverse().toString("hex")

  const difficulty = 0.0001

  const tagHex = new Buffer("this is a tag", "ascii").toString("hex")

  const dataHex = new Buffer("this is more additionalData", "ascii").toString("hex")

  const userNonceHex = "c8010000"

  const extraNonce1 = index.UInt32Big.fromHex("02000000")

  const extraNonce2 = index.Bytes.fromHex("0000000300000003")

  const time = index.UInt32Little.fromHex("12300009")

  const generalPurposeBits = index.Int32Little.fromHex("ffffffff")

  let nonceV1 = index.UInt32Little.fromNumber(151906)
  let nonceV2 = index.UInt32Little.fromNumber(305455)

  let key = index.bsv.PrivateKey.fromWIF("KwKYRBpVWEYdQeA4uRGAu959BN4M1WpaTuetwsoBYES8CrVkxfLt")
  let pubkey = key.toPublicKey()
  let minerPubKeyHex = pubkey.toHex()
  let minerPubKeyHashHex = index.bsv.Address.fromPublicKey(pubkey, key.network).toObject().hash

  let satoshis = 7500
  let txid = index.Digest32.fromHex("abcdef00112233445566778899abcdefabcdef00112233445566778899abcdef")
  let vout = 2

  const puzzleBountyV1 = new index.Puzzle(
    new index.Output(
      index.BoostPowJob.fromObject({
        category: categoryHex,
        content: contentHex,
        diff: difficulty,
        tag: tagHex,
        additionalData: dataHex,
        userNonce: userNonceHex,
      }), satoshis, txid, vout), key)

  const puzzleBountyV2 = new index.Puzzle(
    new index.Output(
      index.BoostPowJob.fromObject({
        category: categoryHex,
        content: contentHex,
        diff: difficulty,
        tag: tagHex,
        additionalData: dataHex,
        userNonce: userNonceHex,
        useGeneralPurposeBits: true
      }), satoshis, txid, vout), key)

  const puzzleContractV1 = new index.Puzzle(
    new index.Output(
      index.BoostPowJob.fromObject({
        category: categoryHex,
        content: contentHex,
        diff: difficulty,
        tag: tagHex,
        additionalData: dataHex,
        userNonce: userNonceHex,
        minerPubKeyHash: minerPubKeyHashHex,
      }), satoshis, txid, vout), key)

  const puzzleContractV2 = new index.Puzzle(
    new index.Output(
      index.BoostPowJob.fromObject({
        category: categoryHex,
        content: contentHex,
        diff: difficulty,
        tag: tagHex,
        additionalData: dataHex,
        userNonce: userNonceHex,
        minerPubKeyHash: minerPubKeyHashHex,
        useGeneralPurposeBits: true
      }), satoshis, txid, vout), key)

  let solutionV1 = new index.work.Solution(time, extraNonce1, extraNonce2, nonceV1)

  let solutionV2 = new index.work.Solution(time, extraNonce1, extraNonce2, nonceV2, generalPurposeBits)

  it("should make valid proofs from puzzles and solutions", async () => {
    expect(new index.work.Proof(puzzleBountyV1.workPuzzle, solutionV1).valid()).to.eql(true)
    expect(new index.work.Proof(puzzleBountyV2.workPuzzle, solutionV2).valid()).to.eql(true)
    expect(new index.work.Proof(puzzleContractV1.workPuzzle, solutionV1).valid()).to.eql(true)
    expect(new index.work.Proof(puzzleContractV2.workPuzzle, solutionV2).valid()).to.eql(true)
  })

  // now we create the redemption transaction.

  let txRedeemBountyV1 = new index.bsv.Transaction()
  let txRedeemBountyV2 = new index.bsv.Transaction()
  let txRedeemContractV1 = new index.bsv.Transaction()
  let txRedeemContractV2 = new index.bsv.Transaction()

  txRedeemBountyV1.addOutput(new index.bsv.Transaction.Output({
    script: index.bsv.Script(new index.bsv.Address("13wgYHWXXwgLsSQLQzb4s24SL5jScuYujy")),
    satoshis: satoshis - 517
  }))

  txRedeemBountyV2.addOutput(new index.bsv.Transaction.Output({
    script: index.bsv.Script(new index.bsv.Address("13wgYHWXXwgLsSQLQzb4s24SL5jScuYujy")),
    satoshis: satoshis - 517
  }))

  txRedeemContractV1.addOutput(new index.bsv.Transaction.Output({
    script: index.bsv.Script(new index.bsv.Address("13wgYHWXXwgLsSQLQzb4s24SL5jScuYujy")),
    satoshis: satoshis - 517
  }))

  txRedeemContractV2.addOutput(new index.bsv.Transaction.Output({
    script: index.bsv.Script(new index.bsv.Address("13wgYHWXXwgLsSQLQzb4s24SL5jScuYujy")),
    satoshis: satoshis - 517
  }))

  txRedeemBountyV1.addInput(
    new index.bsv.Transaction.Input({
      output: new index.bsv.Transaction.Output({
        script: puzzleBountyV1.output.script.toScript(),
        satoshis: satoshis
      }),
      prevTxId: txid.buffer,
      outputIndex: vout,
      script: index.bsv.Script.empty()
    })
  )

  txRedeemBountyV2.addInput(
    new index.bsv.Transaction.Input({
      output: new index.bsv.Transaction.Output({
        script: puzzleBountyV2.output.script.toScript(),
        satoshis: satoshis
      }),
      prevTxId: txid.buffer,
      outputIndex: vout,
      script: index.bsv.Script.empty()
    })
  )

  txRedeemContractV1.addInput(
    new index.bsv.Transaction.Input({
      output: new index.bsv.Transaction.Output({
        script: puzzleContractV1.output.script.toScript(),
        satoshis: satoshis
      }),
      prevTxId: txid.buffer,
      outputIndex: vout,
      script: index.bsv.Script.empty()
    })
  )

  txRedeemContractV2.addInput(
    new index.bsv.Transaction.Input({
      output: new index.bsv.Transaction.Output({
        script: puzzleContractV2.output.script.toScript(),
        satoshis: satoshis
      }),
      prevTxId: txid.buffer,
      outputIndex: vout,
      script: index.bsv.Script.empty()
    })
  )

  let sigtype = index.bsv.crypto.Signature.SIGHASH_ALL | index.bsv.crypto.Signature.SIGHASH_FORKID

  let flags = index.bsv.Script.Interpreter.SCRIPT_VERIFY_MINIMALDATA |
    index.bsv.Script.Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID |
    index.bsv.Script.Interpreter.SCRIPT_ENABLE_MAGNETIC_OPCODES |
    index.bsv.Script.Interpreter.SCRIPT_ENABLE_MONOLITH_OPCODES

  let redeemBountyV1 = puzzleBountyV1.redeem(solutionV1, txRedeemBountyV1, 0, sigtype, flags)
  let redeemBountyV2 = puzzleBountyV2.redeem(solutionV2, txRedeemBountyV2, 0, sigtype, flags)
  let redeemContractV1 = puzzleContractV1.redeem(solutionV1, txRedeemContractV1, 0, sigtype, flags)
  let redeemContractV2 = puzzleContractV2.redeem(solutionV2, txRedeemContractV2, 0, sigtype, flags)

  it("should make valid Redeem objects.", async () => {
    expect(index.Job.tryValidateJobProof(puzzleBountyV1.output.script, redeemBountyV1)).to.not.eql(null)
    expect(index.Job.tryValidateJobProof(puzzleBountyV2.output.script, redeemBountyV2)).to.not.eql(null)
    expect(index.Job.tryValidateJobProof(puzzleContractV1.output.script, redeemContractV1)).to.not.eql(null)
    expect(index.Job.tryValidateJobProof(puzzleContractV2.output.script, redeemContractV2)).to.not.eql(null)
  })

  txRedeemBountyV1.inputs[0].setScript(redeemBountyV1.toScript())
  txRedeemBountyV2.inputs[0].setScript(redeemBountyV2.toScript())
  txRedeemContractV1.inputs[0].setScript(redeemContractV1.toScript())
  txRedeemContractV2.inputs[0].setScript(redeemContractV2.toScript())
  // we cannot do this test because we don't have a proper interpreter. 
  /*
  it("should interpret the script and be valid", async () => {
    let bn = index.bsv.crypto.BN.fromNumber(satoshis)
    expect(puzzleBountyV1.output.script.toScript()).to.not.eql(undefined)
    index.bsv.Script.Interpreter.MAXIMUM_ELEMENT_SIZE = 0
    expect(index.bsv.Script.Interpreter().verify(
      redeemBountyV1.toScript(),
      puzzleBountyV1.output.script.toScript(),
      txRedeemBountyV1, 0, flags, bn)).to.eql(true)
    expect(index.bsv.Script.Interpreter().verify(
      redeemBountyV2.toScript(),
      puzzleBountyV2.output.script.toScript(),
      txRedeemBountyV2, 0, flags, bn)).to.eql(true)
    expect(index.bsv.Script.Interpreter().verify(
      redeemContractV1.toScript(),
      puzzleContractV1.output.script.toScript(),
      txRedeemContractV1, 0, flags, bn)).to.eql(true)
    expect(index.bsv.Script.Interpreter().verify(
      redeemContractV2.toScript(),
      puzzleContractV2.output.script.toScript(),
      txRedeemContractV2, 0, flags, bn)).to.eql(true)
  })*/

})
