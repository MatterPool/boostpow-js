"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bsv = require("bsv");
const _1 = require(".");
const chalk = require('chalk');
const prompt = require('prompt-async');
const boost = require('boostpow-js');
const PrivateKey = bsv.PrivateKey;
const Opcode = bsv.Opcode;
const Transaction = bsv.Transaction;
const BN = bsv.crypto.BN;
const sigtype = bsv.crypto.Signature.SIGHASH_ALL | bsv.crypto.Signature.SIGHASH_FORKID;
const flags = bsv.Script.Interpreter.SCRIPT_VERIFY_MINIMALDATA | bsv.Script.Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID | bsv.Script.Interpreter.SCRIPT_ENABLE_MAGNETIC_OPCODES | bsv.Script.Interpreter.SCRIPT_ENABLE_MONOLITH_OPCODES;
class CPUMiner {
    sign(tx, target = '') {
        const privKey = PrivateKey.fromRandom();
        const signature = Transaction.sighash.sign(tx, privKey, sigtype, 0, tx.inputs[0].output.script, new bsv.crypto.BN(tx.inputs[0].output.satoshis), flags);
        if (target != '') {
            const sig256 = bsv.crypto.Hash.sha256(Buffer.concat([signature.toBuffer(), Buffer.from(sigtype.toString(16), 'hex')])).toString('hex');
            if (!sig256.startsWith(target)) {
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                process.stdout.write(chalk.red(sig256));
                return (false);
            }
            else {
                console.log();
                console.log(chalk.green(sig256));
            }
        }
        const unlockingScript = new bsv.Script({});
        unlockingScript
            .add(Buffer.concat([
            signature.toBuffer(),
            Buffer.from([sigtype & 0xff])
        ]))
            .add(privKey.toPublicKey().toBuffer());
        tx.inputs[0].setScript(unlockingScript);
        console.log(chalk.green(`Signed ${target} with ${privKey.toString()}`));
        return tx;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { txid } = yield prompt.get(["txid"]);
                if (txid === 'exit')
                    return; //let them exit
                let tx;
                let index = -1;
                let boostJob;
                try {
                    boostJob = yield _1.BoostClient.loadBoostJob(txid);
                }
                catch (ex) {
                    console.log('ex', ex);
                    throw ("TX not found.");
                }
                if (!boostJob) {
                    throw ("No Boost outputs found");
                }
                let { to } = yield prompt.get(["to"]);
                if (txid === 'exit')
                    return; //let them exit
                if (!to.length) {
                    throw ("No address found.");
                }
                try {
                    to = bsv.Script.buildPublicKeyHashOut(to);
                }
                catch (e) {
                    throw ("Invalid address");
                }
                console.log("Automatically publish when mined? Y/N");
                let { publish } = yield prompt.get(["publish"]);
                publish = (publish.toLowerCase()[0] == 'y') ? true : false;
                console.log(chalk.green(`Mining TX ${txid} output ${index}`));
                console.log(chalk.green(`Pay to: ${to}`));
                this.mineId(tx, index, to, publish);
            }
            catch (e) {
                console.log(chalk.red(e));
                this.start();
            }
        });
    }
    mineId(from, index, to, publish) {
        return __awaiter(this, void 0, void 0, function* () {
            const vout = from.vout[index];
            const value = Math.floor(vout.value * 1e8);
            const targetScript = bsv.Script.fromHex(vout.scriptPubKey.hex);
            const target = targetScript.toASM().split(" ")[1].toString('hex');
            //Make initial TX
            let tx = new Transaction();
            tx.addInput(new Transaction.Input({
                output: new Transaction.Output({
                    script: targetScript,
                    satoshis: value
                }),
                prevTxId: from.txid,
                outputIndex: index,
                script: bsv.Script.empty()
            }));
            tx.addOutput(new Transaction.Output({
                satoshis: value - 218,
                script: to
            }));
            console.log(chalk.green(`Targeting: ${target}`));
            let foundPowString;
            while (!foundPowString) {
                foundPowString = this.sign(tx, target);
            }
            console.log(chalk.yellow(tx.uncheckedSerialize()));
            if (!!publish) {
                try {
                    const { data } = yield boost.sned(tx.uncheckedSerialize());
                    console.log(chalk.green('Published ' + Buffer.from(tx._getHash()).reverse().toString('hex')));
                }
                catch (e) {
                    console.log(chalk.red(JSON.stringify({ error: e.response.data })));
                }
            }
            else {
                return;
            }
        });
    }
}
exports.CPUMiner = CPUMiner;
const cpuMiner = new CPUMiner();
cpuMiner.start();
