const DR_STORE = '.DS_Store';
const KEEP = '.keep';

export const garbage = {
    arr: Object.values({ DR_STORE, KEEP }),
    filtered: (item: string) => !garbage.arr.some(str => str === item),
};
