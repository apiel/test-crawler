import { info } from 'logol';

export type Push = (payload: any) => Promise<void>;

let pushList: Push[] = [];

/**
 * Add push socket in pushList
 * @param push
 */
export function pushPush(push: Push) {
    pushList.push(push);
}

/**
 * Send payload to all push socket from pushList
 * @param payload
 */
export async function sendPush(payload: any) {
    for (let i = pushList.length - 1; i >= 0; i--) {
        if (pushList[i]) {
            try {
                await pushList[i](payload);
            } catch (error) {
                info('Push was not sent, remove from pusher list.');
                delete pushList[i];
            }
        }
    }
    pushList = pushList.filter(p => p);
}

// const result = await Promise.all(
//     pushList.map(async push => {
//         const sent = await push(payload);
//         return sent ? push : undefined;
//     }),
// );
// pushList = result.filter(p => p);
