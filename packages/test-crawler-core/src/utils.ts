export function generateTinestampFolder() {
    return Math.floor(Date.now() / 1000).toString();
}
