import { info } from 'logol';

export interface PickerResponse {
    queue: QueueProps;
    data: any;
    apply: () => Promise<void>;
}

export interface Consumer {
    picker: () => Promise<PickerResponse | undefined>;
    runner: (data: any) => Promise<void>;
    finish?: () => any;
}

export interface QueueProps {
    name: string;
    maxConcurrent: number;
}

interface ConsumerQueue {
    maxConcurrent: number;
    running: number;
}

type ConsumerQueues = { [name: string]: ConsumerQueue };
type Consumers = { [key: string]: Consumer };

let consumerLoopRunning = false;
const consumerQueues: ConsumerQueues = {};
let consumers: Consumers = {};

export function setConsumers(_consumers: Consumers) {
    consumers = _consumers;
}

export async function runConsumers(afterAll: () => void) {
    if (!consumerLoopRunning) {
        consumerLoopRunning = true;
        await consumerLoop();
        consumerLoopRunning = false;
        afterAll();
    }
}

async function consumerLoop() {
    while (await stuffToDo()) {
        if(!await consume()) {
            await sleep(1000);
        }
    }
}

async function consume() {
    let ret = false;
    for (const { picker, runner } of Object.values(consumers)) {
        const toRun = await picker();
        // console.log(`${Math.random()} toRun`, toRun);
        if (toRun && isQueueAvailable(toRun.queue)) {
            ret = true;
            const { name } = toRun.queue;
            await toRun.apply();
            consumerQueues[name].running++;
            info('Consume', name, consumerQueues[name].running);
            const toCall = async () => {
                await runner(toRun.data);
                consumerQueues[name].running--;
            };
            toCall(); // don't wait for it
        }
    }
    return ret;
}

function isQueueAvailable({ name, maxConcurrent }: QueueProps) {
    if (!consumerQueues[name]) {
        info('Create queue', { name, maxConcurrent });
        consumerQueues[name] = { maxConcurrent, running: 0 };
    }
    const consumerQueue = consumerQueues[name];
    validateQueue(consumerQueue, maxConcurrent);
    return consumerQueue.running < consumerQueue.maxConcurrent;
}

function validateQueue(consumerQueue: ConsumerQueue, maxConcurrent: number) {
    if (consumerQueue.maxConcurrent !== maxConcurrent) {
        throw new Error(
            `A queue with this name exist but with different maxConcurrent.
            Use a different queue name per maxConcurrent`,
        );
    }
}

function isThereJobRunning() {
    return Object.values(consumerQueues).find(
        consumerQueue => consumerQueue.running > 0,
    );
}

async function stuffToDo() {
    if (isThereJobRunning()) {
        return true;
    }
    for (const { picker } of Object.values(consumers)) {
        if (await picker()) {
            return true;
        }
    }
    return false;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
