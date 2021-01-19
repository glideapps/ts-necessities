export function proveType<T>(_val: T) {
    // do nothing, just prove the compiler thinks the types match
}

export function proveNever<T>(_never: never, message: string, result: T): never {
    console.trace(message);
    return result as never;
}

export function panic(message: string = "This should not happen"): never {
    console.trace(message);
    throw new Error(message);
}

export function assert(fact: boolean, message: string = "Assertion failed"): asserts fact {
    if (fact) return;
    return panic(message);
}

export function assertNever(_never: never): never {
    return panic("Hell froze over");
}

export function defined<T>(v: T | undefined, reason?: string): T {
    if (v === undefined)
        return panic(
            "Value was undefined but should be defined" +
                (reason !== undefined ? `, expected to be defined because: ${reason}` : "")
        );
    return v;
}

export function dontAwait(p: Promise<unknown>): void {
    p.catch(e => {
        console.error("Unhandled error from unawaited promise", e);
        throw e;
    });
}

export function sleep(ms: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, ms);
    });
}

export function reduceTwo<T>(a: T | undefined, b: T | undefined, f: (aa: T, bb: T) => T): T | undefined {
    if (a === undefined) return b;
    if (b === undefined) return a;
    return f(a, b);
}

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export function definedMap<T, U>(x: T | undefined, f: (xx: T) => U): U | undefined {
    if (x === undefined) return undefined;
    return f(x);
}

export function hasOwnProperty<T extends string>(obj: unknown, name: T): obj is { [P in T]: unknown } {
    if (obj === undefined || obj === null) return false;
    return Object.prototype.hasOwnProperty.call(obj, name);
}

export { DefaultMap } from "./default-map";
