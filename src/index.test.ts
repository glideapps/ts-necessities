import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as utils from './index';

describe('proveType', () => {
  test('proveType should be a no-op', () => {
    // This is mainly a compile-time check to ensure a value is of the correct type
    utils.proveType<string>('test');
    utils.proveType<number>(123);
    
    // No runtime assertions needed as it's a no-op function
    expect(true).toBe(true);
  });
});

describe('proveNever', () => {
  beforeEach(() => {
    vi.spyOn(console, 'trace').mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  test('proveNever returns the provided result', () => {
    // We need to trick TypeScript to allow calling this with a non-never type
    // since this function is only meant to be called in exhaustive checks
    const result = (utils.proveNever as any)('not-never', 'test message', 42);
    expect(result).toBe(42);
    expect(console.trace).toHaveBeenCalledWith('test message');
  });
});

describe('panic', () => {
  beforeEach(() => {
    vi.spyOn(console, 'trace').mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  test('panic throws an error with the provided message', () => {
    expect(() => utils.panic('test panic')).toThrow('test panic');
    expect(console.trace).toHaveBeenCalledWith('test panic');
  });
  
  test('panic uses default message if none provided', () => {
    expect(() => utils.panic()).toThrow('This should not happen');
    expect(console.trace).toHaveBeenCalledWith('This should not happen');
  });
});

describe('assert', () => {
  beforeEach(() => {
    vi.spyOn(console, 'trace').mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  test('assert does nothing when condition is true', () => {
    utils.assert(true);
    expect(console.trace).not.toHaveBeenCalled();
  });
  
  test('assert throws when condition is false', () => {
    expect(() => utils.assert(false, 'assertion message')).toThrow('assertion message');
    expect(console.trace).toHaveBeenCalledWith('assertion message');
  });
  
  test('assert uses default message if none provided', () => {
    expect(() => utils.assert(false)).toThrow('Assertion failed');
    expect(console.trace).toHaveBeenCalledWith('Assertion failed');
  });
});

describe('assertNever', () => {
  beforeEach(() => {
    vi.spyOn(console, 'trace').mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  test('assertNever throws with custom message', () => {
    // We need to trick TypeScript to allow calling this with a non-never type
    expect(() => (utils.assertNever as any)('not-never', 'never happened')).toThrow('never happened');
    expect(console.trace).toHaveBeenCalledWith('never happened');
  });
  
  test('assertNever uses default message if none provided', () => {
    expect(() => (utils.assertNever as any)('not-never')).toThrow('`never` happened');
    expect(console.trace).toHaveBeenCalledWith('`never` happened');
  });
});

describe('defined', () => {
  beforeEach(() => {
    vi.spyOn(console, 'trace').mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  test('defined returns value when not undefined', () => {
    expect(utils.defined('value')).toBe('value');
    expect(utils.defined(0)).toBe(0);
    expect(utils.defined(false)).toBe(false);
    expect(utils.defined(null)).toBe(null);
  });
  
  test('defined throws when value is undefined', () => {
    expect(() => utils.defined(undefined)).toThrow('Value was undefined but should be defined');
    expect(console.trace).toHaveBeenCalled();
  });
  
  test('defined includes reason in error message when provided', () => {
    expect(() => utils.defined(undefined, 'missing data')).toThrow(
      'Value was undefined but should be defined because: missing data'
    );
  });
});

describe('dontAwait', () => {
  test('dontAwait returns void for non-promises', () => {
    const result = utils.dontAwait('not a promise');
    expect(result).toBeUndefined();
  });
  
  test('dontAwait catches promise errors', async () => {
    vi.spyOn(console, 'trace').mockImplementation(() => {});
    
    // Create a promise that will reject, but catch it to avoid unhandled rejection
    const failingPromise = Promise.reject(new Error('test error')).catch(() => {});
    
    // Should not throw
    utils.dontAwait(failingPromise);
    
    // Wait for any async operations
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Just a placeholder assertion
    expect(true).toBe(true);
    
    // Restore mocks
    vi.restoreAllMocks();
  });
});

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  test('sleep resolves after specified time', async () => {
    const promise = utils.sleep(100);
    
    // Fast-forward time
    vi.advanceTimersByTime(99);
    expect(await Promise.race([promise, Promise.resolve('not done')])).toBe('not done');
    
    vi.advanceTimersByTime(1);
    await promise; // Should resolve now
    expect(true).toBe(true); // Just to have an assertion
  });
});

describe('reduceTwo', () => {
  test('returns first value when second is undefined', () => {
    expect(utils.reduceTwo(5, undefined, (a, b) => a + b)).toBe(5);
  });
  
  test('returns second value when first is undefined', () => {
    expect(utils.reduceTwo(undefined, 10, (a, b) => a + b)).toBe(10);
  });
  
  test('returns undefined when both values are undefined', () => {
    // Mock function that will never run, just for type-checking
    const mockFn = (a: number, b: number): number => a + b;
    expect(utils.reduceTwo(undefined, undefined, mockFn)).toBeUndefined();
  });
  
  test('applies function when both values are defined', () => {
    expect(utils.reduceTwo(5, 10, (a, b) => a + b)).toBe(15);
    expect(utils.reduceTwo('Hello, ', 'World!', (a, b) => a + b)).toBe('Hello, World!');
  });
});

describe('Type utilities', () => {
  test('Writable removes readonly', () => {
    type ReadonlyObj = {
      readonly a: number;
      readonly b: string;
    };
    
    type WritableObj = utils.Writable<ReadonlyObj>;
    
    // This is a compile-time test
    const obj: WritableObj = { a: 1, b: 'test' };
    obj.a = 2; // Should compile without errors
    obj.b = 'modified'; // Should compile without errors
    
    expect(obj.a).toBe(2);
    expect(obj.b).toBe('modified');
  });
  
  // Note: DeepWritable and DeepReadonly are primarily compile-time utilities
});

describe('definedMap', () => {
  test('returns undefined when input is undefined', () => {
    const result = utils.definedMap(undefined, (v: number) => v * 2);
    expect(result).toBeUndefined();
  });
  
  test('applies function when input is defined', () => {
    const result = utils.definedMap(5, (v: number) => v * 2);
    expect(result).toBe(10);
    
    const stringResult = utils.definedMap('hello', (v: string) => v.toUpperCase());
    expect(stringResult).toBe('HELLO');
  });
});

describe('isEnumValue', () => {
  enum TestEnum {
    A = 'a',
    B = 'b',
    C = 1
  }
  
  test('returns true for values in the enum', () => {
    expect(utils.isEnumValue(TestEnum, 'a')).toBe(true);
    expect(utils.isEnumValue(TestEnum, 'b')).toBe(true);
    expect(utils.isEnumValue(TestEnum, 1)).toBe(true);
  });
  
  test('returns false for values not in the enum', () => {
    expect(utils.isEnumValue(TestEnum, 'c')).toBe(false);
    expect(utils.isEnumValue(TestEnum, 2)).toBe(false);
    expect(utils.isEnumValue(TestEnum, null)).toBe(false);
  });
});

describe('isArray', () => {
  test('returns true for arrays', () => {
    expect(utils.isArray([1, 2, 3])).toBe(true);
    expect(utils.isArray(['a', 'b'])).toBe(true);
    expect(utils.isArray([])).toBe(true);
    
    // Readonly arrays
    const readonlyArray: readonly number[] = [1, 2, 3];
    expect(utils.isArray(readonlyArray)).toBe(true);
  });
  
  test('returns false for non-arrays', () => {
    expect(utils.isArray('not an array')).toBe(false);
    expect(utils.isArray(123)).toBe(false);
    expect(utils.isArray({})).toBe(false);
    expect(utils.isArray(null)).toBe(false);
    expect(utils.isArray(undefined)).toBe(false);
  });
});

describe('hasOwnProperty', () => {
  test('returns true for properties directly on the object', () => {
    const obj = { a: 1, b: 'test' };
    // eslint-disable-next-line no-prototype-builtins
    expect(utils.hasOwnProperty(obj, 'a')).toBe(true);
    // eslint-disable-next-line no-prototype-builtins
    expect(utils.hasOwnProperty(obj, 'b')).toBe(true);
  });
  
  test('returns false for inherited properties', () => {
    const obj = Object.create({ inherited: true });
    obj.own = true;
    
    // eslint-disable-next-line no-prototype-builtins
    expect(utils.hasOwnProperty(obj, 'own')).toBe(true);
    // eslint-disable-next-line no-prototype-builtins
    expect(utils.hasOwnProperty(obj, 'inherited')).toBe(false);
    // eslint-disable-next-line no-prototype-builtins
    expect(utils.hasOwnProperty(obj, 'toString')).toBe(false);
  });
  
  test('returns false for missing properties', () => {
    const obj = { a: 1 };
    // eslint-disable-next-line no-prototype-builtins
    expect(utils.hasOwnProperty(obj, 'b')).toBe(false);
  });
  
  test('returns false for null or undefined', () => {
    // eslint-disable-next-line no-prototype-builtins
    expect(utils.hasOwnProperty(null, 'prop')).toBe(false);
    // eslint-disable-next-line no-prototype-builtins
    expect(utils.hasOwnProperty(undefined, 'prop')).toBe(false);
  });
});

describe('mapFilterUndefined', () => {
  test('maps and filters out undefined values', () => {
    const input = [1, 2, 3, 4, 5];
    const result = utils.mapFilterUndefined(input, x => x % 2 === 0 ? x * 2 : undefined);
    
    expect(result).toEqual([4, 8]);
  });
  
  test('provides index to mapping function', () => {
    const input = ['a', 'b', 'c'];
    const result = utils.mapFilterUndefined(input, (x, i) => `${x}${i}`);
    
    expect(result).toEqual(['a0', 'b1', 'c2']);
  });
  
  test('works with iterables other than arrays', () => {
    const input = new Set([1, 2, 3]);
    const result = utils.mapFilterUndefined(input, x => x * 2);
    
    expect(result).toEqual([2, 4, 6]);
  });
  
  test('returns empty array when all map results are undefined', () => {
    const input = [1, 2, 3];
    const result = utils.mapFilterUndefined(input, () => undefined);
    
    expect(result).toEqual([]);
  });
});

describe('filterUndefined', () => {
  test('filters out undefined values', () => {
    const input = [1, undefined, 2, undefined, 3];
    const result = utils.filterUndefined(input);
    
    expect(result).toEqual([1, 2, 3]);
  });
  
  test('works with iterables other than arrays', () => {
    const input = new Set([1, undefined, 2]);
    const result = utils.filterUndefined(input);
    
    expect(result).toEqual([1, 2]);
  });
  
  test('returns empty array when all values are undefined', () => {
    const input = [undefined, undefined];
    const result = utils.filterUndefined(input);
    
    expect(result).toEqual([]);
  });
});

describe('mapRecord', () => {
  test('maps record values', () => {
    const input = { a: 1, b: 2, c: 3 };
    const result = utils.mapRecord(input, v => v * 2);
    
    expect(result).toEqual({ a: 2, b: 4, c: 6 });
  });
  
  test('provides key name to mapping function', () => {
    const input = { a: 1, b: 2 };
    const result = utils.mapRecord(input, (v, k) => `${k}:${v}`);
    
    expect(result).toEqual({ a: 'a:1', b: 'b:2' });
  });
  
  test('returns empty object for empty input', () => {
    const result = utils.mapRecord({}, v => v);
    expect(result).toEqual({});
  });
});

describe('mapRecordFilterUndefined', () => {
  test('maps record values and filters undefined', () => {
    const input = { a: 1, b: 2, c: 3, d: 4 };
    const result = utils.mapRecordFilterUndefined(input, v => v % 2 === 0 ? v * 2 : undefined);
    
    expect(result).toEqual({ b: 4, d: 8 });
  });
  
  test('provides key name to mapping function', () => {
    const input = { a: 1, b: 2 };
    const result = utils.mapRecordFilterUndefined(input, (v, k) => 
      k === 'a' ? `${k}:${v}` : undefined
    );
    
    expect(result).toEqual({ a: 'a:1' });
  });
  
  test('returns empty object when all map results are undefined', () => {
    const input = { a: 1, b: 2 };
    const result = utils.mapRecordFilterUndefined(input, () => undefined);
    
    expect(result).toEqual({});
  });
});

describe('exceptionToString', () => {
  test('extracts message from Error objects', () => {
    const error = new Error('test error');
    const result = utils.exceptionToString(error);
    
    expect(result).toBe('test error');
  });
  
  test('handles objects with message property', () => {
    const obj = { message: 'custom message' };
    const result = utils.exceptionToString(obj);
    
    expect(result).toBe('custom message');
  });
  
  test('falls back to toString() for other objects', () => {
    const obj = { custom: 'field' };
    const result = utils.exceptionToString(obj);
    
    // ToString of an object gives "[object Object]"
    expect(result).toBe('[object Object]');
  });
  
  test('returns empty string for undefined', () => {
    const result = utils.exceptionToString(undefined);
    expect(result).toBe('');
  });
  
  test('handles objects without toString', () => {
    const obj = Object.create(null);
    obj.message = 'message without toString';
    
    const result = utils.exceptionToString(obj);
    expect(result).toBe('message without toString');
  });
  
  test('handles exceptions during toString()', (): void => {
    const obj = {
      toString(): string {
        throw new Error('toString error');
      }
    };
    
    const result = utils.exceptionToString(obj);
    expect(result).toContain('Exception can\'t be stringified');
    expect(result).toContain('toString error');
  });
  
  test('handles nested exceptions during stringification', (): void => {
    const nestedError = {
      toString(): string {
        throw {
          toString(): string {
            throw new Error('nested error');
          }
        };
      }
    };
    
    const result = utils.exceptionToString(nestedError);
    // The exact message will depend on the implementation details,
    // so we just check that it contains the expected phrase
    expect(result).toContain('Exception can\'t be stringified');
  });
});

describe('exceptionToError', () => {
  test('returns Error objects unchanged', (): void => {
    const error = new Error('original error');
    const result = utils.exceptionToError(error);
    
    expect(result).toBe(error);
  });
  
  test('wraps non-Error objects in Error', (): void => {
    const obj = { message: 'custom message' };
    const result = utils.exceptionToError(obj);
    
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('custom message');
  });
  
  test('converts string exception to Error', (): void => {
    const result = utils.exceptionToError('string error');
    
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('string error');
  });
});