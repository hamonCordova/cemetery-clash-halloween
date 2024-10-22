export const debounce = (func: Function, delay: number) => {
    let timerId: any;
    return (...args: any) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

export const throttle = (func: Function, limit: number) => {
    let lastFunc: any;
    let lastRan: number;

    return (...args: any) => {
        const now = Date.now();
        if (!lastRan) {
            func.apply(null, args);
            lastRan = now;
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (now - lastRan >= limit) {
                    func.apply(null, args);
                    lastRan = now;
                }
            }, limit - (now - lastRan));
        }
    };
};
