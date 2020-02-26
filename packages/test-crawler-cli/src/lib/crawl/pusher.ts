export type Push = (payload: any) => Promise<boolean>;

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
export async function push(payload: any) {
    // const result = await Promise.all(
    //     pushList.map(async push => {
    //         const sent = await push(payload);
    //         return sent ? push : undefined;
    //     }),
    // );
    // pushList = result.filter(p => p);
    for(let i = pushList.length - 1; i >= 0; i--) {
        const sent = await pushList[i](payload);
        if (!sent) {
            delete pushList[i];
        }
    }
}
