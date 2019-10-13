let masonry: any;
let timer: NodeJS.Timer;

export const setMasonry = (m: any) => masonry = m;

export const onMasonryImg = () => {
    if (masonry) masonry.layout();
    clearTimeout(timer);
    timer = setTimeout(() => {
        if (masonry) masonry.layout();
    }, 500);
}
