/**
 * Do nothing, but only compile if `_val` is of type `T`.
 */
export function proveType<T>(_val: T): void {
    // do nothing, just prove the compiler thinks the types match
}

/**
 * Only compile if `_never` has type `never`.  If run, trace the
 * `message` and return `result`.
 */
export function proveNever<T>(_never: never, message: string, result: T): never {
    console.trace(message);
    return result as never;
}

/**
 * Throw an `Error` and trace `message`.
 */
export function panic(message: string = "This should not happen"): never {
    console.trace(message);
    debugger;
    throw new Error(message);
}

/**
 * Assert that `fact` is `true`.  If the assertion fails, [[panic]]
 * with `message`.
 */
export function assert(fact: boolean, message: string = "Assertion failed"): asserts fact {
    if (fact) return;
    return panic(message);
}

/**
 * Only compile if `_never` has the type `never`.  If run, [[panic]]
 * with `message`.
 */
export function assertNever(_never: never, message: string = "`never` happened"): never {
    return panic(message);
}

/**
 * If `v` is not `undefined`, return `v`.  Otherwise, [[panic]] with
 * a message including `reason`.
 */
export function defined<T>(v: T | undefined, reason?: string): T {
    if (v === undefined) {
        return panic("Value was undefined but should be defined" + (reason !== undefined ? ` because: ${reason}` : ""));
    }
    return v;
}

/**
 * The only thing this function does is to trace if the promise
 * `p` rejects.  It is useful to explain to ESLint that `p` is
 * intentionally not `await`ed.
 */
export function dontAwait(p: Promise<unknown>): void {
    p.catch(e => {
        console.trace("Unhandled error from unawaited promise", e);
        throw e;
    });
}

/**
 * A promise that resolves after `ms` milliseconds.
 */
export function sleep(ms: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, ms);
    });
}

/**
 * If both `a` and `b` are `undefined`, return `undefined`.
 * If exactly one of the two is `undefined`, return the other.
 * If both are not `undefined`, return `f(a, b)`.
 */
export function reduceTwo<T>(a: T | undefined, b: T | undefined, f: (aa: T, bb: T) => T): T | undefined {
    if (a === undefined) return b;
    if (b === undefined) return a;
    return f(a, b);
}

/**
 * Remove `readonly` from all properties of `T`.
 */
export type Writable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * If `x` is undefined, return `undefined`.  Otherwise, return `f(x)`.
 */
export function definedMap<T, U>(x: T | undefined, f: (xx: T) => U): U | undefined {
    if (x === undefined) return undefined;
    return f(x);
}

/**
 * Returns whether `obj` has `name` as its own property.
 */
export function hasOwnProperty<T extends string>(obj: unknown, name: T): obj is { [P in T]: unknown } {
    if (obj === undefined || obj === null) return false;
    return Object.prototype.hasOwnProperty.call(obj, name);
}

/**
 * Map `f` over `iterable`, and return an array of all results
 * that are not `undefined`.
 */
export function mapFilterUndefined<T, U>(iterable: Iterable<T>, f: (x: T, i: number) => U | undefined): U[] {
    const result: U[] = [];
    let i = 0;
    for (const x of iterable) {
        const y = f(x, i);
        i += 1;
        if (y === undefined) continue;
        result.push(y);
    }
    return result;
}

export { DefaultMap, ReadonlyDefaultMap } from "./default-map";
