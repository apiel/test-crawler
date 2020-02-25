// should be able to know max concurent consumer on the fly
// -> there would be something like getConsumerSettings returning name and maxConcurrent
//       result,  1
//       ie,      1
//       Safari,  1
//       browser, 5

// -> pickFromQueue                should use getConsumerSettings
//    return an item to consumer eg.: { projectId, id, url, timestamp }
//    with consumer settings eg.: browser, 5
//    and apply method eg.: async () =>  await move(queueFile, pathInfoFile(projectId, timestamp, id));

interface PickerResponse {
    queue: QueueProps;
    data: any;
    apply: () => Promise<void>;
}

interface Consumer {
    picker: () => Promise<PickerResponse>;
    runner: (data: any) => Promise<void>;
}

interface QueueProps {
    name: string;
    maxConcurrent: number;
}

interface ConsumerQueue {
    maxConcurrent: number;
    running: number;
}

type ConsumerQueues = { [name: string]: ConsumerQueue };
type Consumers = { [key: string]: Consumer };

const consumerQueues: ConsumerQueues = {};
const consumers: Consumers = {};

function validateQueue(consumerQueue: ConsumerQueue, maxConcurrent: number) {
    if (consumerQueue.maxConcurrent !== maxConcurrent) {
        throw new Error(
            `A queue with this name exist but with different maxConcurrent.
            Use a different queue name per maxConcurrent`,
        );
    }
}

function isQueueAvailable({ name, maxConcurrent }: QueueProps) {
    if (!consumerQueues[name]) {
        consumerQueues[name] = { maxConcurrent, running: 0 };
    }
    const consumerQueue = consumerQueues[name];
    validateQueue(consumerQueue, maxConcurrent);
    return consumerQueue.running < consumerQueue.maxConcurrent;
}

async function consume() {
    for (const { picker, runner } of Object.values(consumers)) {
        const toRun = await picker();
        if (toRun && isQueueAvailable(toRun.queue)) {
            await toRun.apply();
            consumerQueues[toRun.queue.name].running++;
            const toCall = async () => {
                await runner(toRun.data);
                consumerQueues[toRun.queue.name].running--;
            };
            toCall(); // don't wait for it
        }
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

async function consumerLoop() {
    while (await stuffToDo()) {
        await consume();
        sleep(500);
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
