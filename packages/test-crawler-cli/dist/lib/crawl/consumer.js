"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logol_1 = require("logol");
let consumerLoopRunning = false;
const consumerQueues = {};
let consumers = {};
function setConsumers(_consumers) {
    consumers = _consumers;
}
exports.setConsumers = setConsumers;
function runConsumers(afterAll) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!consumerLoopRunning) {
            consumerLoopRunning = true;
            yield consumerLoop();
            consumerLoopRunning = false;
            afterAll(finish());
        }
    });
}
exports.runConsumers = runConsumers;
function consumerLoop() {
    return __awaiter(this, void 0, void 0, function* () {
        while (yield stuffToDo()) {
            if (!(yield consume())) {
                yield sleep(1000);
            }
        }
    });
}
function consume() {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = false;
        for (const { picker, runner } of Object.values(consumers)) {
            const toRun = yield picker();
            if (toRun && isQueueAvailable(toRun.queue)) {
                ret = true;
                const { name } = toRun.queue;
                yield toRun.apply();
                consumerQueues[name].running++;
                logol_1.info('Consume', name, consumerQueues[name].running);
                const toCall = () => __awaiter(this, void 0, void 0, function* () {
                    yield runner(toRun.data);
                    consumerQueues[name].running--;
                });
                toCall();
            }
        }
        return ret;
    });
}
function finish() {
    const results = {};
    for (const key in consumers) {
        if (consumers[key].finish) {
            results[key] = consumers[key].finish();
        }
    }
    return results;
}
function isQueueAvailable({ name, maxConcurrent }) {
    if (!consumerQueues[name]) {
        logol_1.info('Create queue', { name, maxConcurrent });
        consumerQueues[name] = { maxConcurrent, running: 0 };
    }
    const consumerQueue = consumerQueues[name];
    validateQueue(consumerQueue, maxConcurrent);
    return consumerQueue.running < consumerQueue.maxConcurrent;
}
function validateQueue(consumerQueue, maxConcurrent) {
    if (consumerQueue.maxConcurrent !== maxConcurrent) {
        throw new Error(`A queue with this name exist but with different maxConcurrent.
            Use a different queue name per maxConcurrent`);
    }
}
function isThereJobRunning() {
    return Object.values(consumerQueues).find(consumerQueue => consumerQueue.running > 0);
}
function stuffToDo() {
    return __awaiter(this, void 0, void 0, function* () {
        if (isThereJobRunning()) {
            return true;
        }
        for (const { picker } of Object.values(consumers)) {
            if (yield picker()) {
                return true;
            }
        }
        return false;
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=consumer.js.map