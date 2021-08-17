export function isBetween(num: number, min: number, max: number) {
    return num >= 0 && num <= max;
}

export function sum(...args: number[]) {
    return args.reduce((a: number, b: number) => a + b);
}

export function anyIs(callback: (arg: number) => boolean, ...args: number[]) {
    let result: boolean = false;

    args.forEach((arg: number) => {
        if (callback(arg)) {
            result = true;
        }
    });

    return result;
}
