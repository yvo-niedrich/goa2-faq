interface DebouncedFunction<T extends (...args: any[]) => void> {
    (...args: Parameters<T>): void;
    cancel: () => void;
    flush: () => void;
}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number, immediate: boolean = false): DebouncedFunction<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let result: ReturnType<T>;

    const debounced = function(this: any, ...args: Parameters<T>): void {
        const context = this;

        const later = () => {
            timeoutId = undefined;
            if (!immediate) {
                (result as any) = func.apply(context, args);
            }
        };

        const callNow = immediate && timeoutId === undefined;

        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(later, wait);

        if (callNow) {
            (result as any) = func.apply(context, args);
        }
    };

    debounced.cancel = () => {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
        timeoutId = undefined;
    };

    debounced.flush = () => {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
            func();
            timeoutId = undefined;
        }
    };

    return debounced;
}

interface ThrottledFunction<T extends (...args: any[]) => void> {
    (...args: Parameters<T>): void;
    cancel: () => void;
    flush: () => void;
}

export function throttle<T extends (...args: any[]) => void>(func: T, wait: number, options: { leading?: boolean; trailing?: boolean } = {}): ThrottledFunction<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let lastCall = 0;
    let lastArgs: Parameters<T> | undefined;
    let result: ReturnType<T>;

    const { leading = true, trailing = true } = options;

    const throttled = function(...args: Parameters<T>): void {
        const now = Date.now();

        if (!lastCall && !leading) {
            lastCall = now;
        }

        const remaining = wait - (now - lastCall);

        if (remaining <= 0 || remaining > wait) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = undefined;
            }
            lastCall = now;
            (result as any) = func(...args);
        } else if (trailing) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            lastArgs = args;
            timeoutId = setTimeout(() => {
                lastCall = leading ? Date.now() : 0;
                timeoutId = undefined;
                if (lastArgs) {
                    (result as any) = func(...lastArgs);
                    lastArgs = undefined;
                }
            }, remaining);
        }
    };

    throttled.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
        }
        lastCall = 0;
        lastArgs = undefined;
    };

    throttled.flush = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
            if (lastArgs) {
                lastCall = leading ? Date.now() : 0;
                (result as any) = func(...lastArgs);
                lastArgs = undefined;
            }
        }
    };

    return throttled;
}
