import { describe, test, expect, vi } from 'vitest';
import { DefaultMap } from './default-map';
import type { ReadonlyDefaultMap } from './default-map';

describe('DefaultMap', () => {
  test('get returns default value for missing keys', () => {
    const defaultValue = 0;
    const map = new DefaultMap<string, number>(() => defaultValue);
    
    expect(map.get('nonexistent')).toBe(defaultValue);
    expect(map.size).toBe(1); // DefaultMap stores the default value when accessed
  });
  
  test('factory function is called for each missing key', () => {
    const factory = vi.fn().mockReturnValue(42);
    const map = new DefaultMap<string, number>(factory);
    
    expect(map.get('key1')).toBe(42);
    expect(map.get('key2')).toBe(42);
    
    expect(factory).toHaveBeenCalledTimes(2);
  });
  
  test('set stores values', () => {
    const map = new DefaultMap<string, number>(() => 0);
    
    map.set('key1', 10);
    map.set('key2', 20);
    
    expect(map.get('key1')).toBe(10);
    expect(map.get('key2')).toBe(20);
    expect(map.size).toBe(2);
  });
  
  test('works with complex values', () => {
    interface User { name: string; visits: number }
    
    const createUser = (name: string): User => ({ name, visits: 0 });
    const map = new DefaultMap<string, User>(key => createUser(key));
    
    const user = map.get('john');
    expect(user.name).toBe('john');
    expect(user.visits).toBe(0);
    
    // Modify the returned value
    user.visits++;
    
    // Get the same object again
    const sameUser = map.get('john');
    expect(sameUser.visits).toBe(1);
  });
  
  test('clear removes all entries', () => {
    const map = new DefaultMap<string, number>(() => 0);
    
    map.set('key1', 10);
    map.set('key2', 20);
    
    map.clear();
    
    expect(map.size).toBe(0);
    expect(map.get('key1')).toBe(0); // Should return default again
  });
  
  test('delete removes specific entry', () => {
    const map = new DefaultMap<string, number>(() => 0);
    
    map.set('key1', 10);
    map.set('key2', 20);
    
    map.delete('key1');
    
    expect(map.size).toBe(1);
    expect(map.get('key1')).toBe(0); // Should return default again
    expect(map.get('key2')).toBe(20); // This one remains
  });
  
  test('get handles the case where a key exists with undefined value', () => {
    // This tests the edge case mentioned in the code comments
    const map = new DefaultMap<string, number | undefined>(() => 42);
    
    // Set undefined as a value for a key
    map.set('exists-but-undefined', undefined);
    
    // Even though the value is undefined, get should return it
    // rather than calling the default function
    expect(map.has('exists-but-undefined')).toBe(true);
    expect(map.get('exists-but-undefined')).toBeUndefined();
  });
  
  test('supports update method', () => {
    const map = new DefaultMap<string, number>(() => 0);
    
    // Update a non-existent key
    map.update('counter', value => value + 1);
    expect(map.get('counter')).toBe(1);
    
    // Update an existing key
    map.update('counter', value => value + 1);
    expect(map.get('counter')).toBe(2);
  });
});

describe('ReadonlyDefaultMap', () => {
  test('interface can be implemented', () => {
    // ReadonlyDefaultMap is an interface not a class, so we test that 
    // DefaultMap implements it correctly
    const map = new DefaultMap<string, number>(() => 0) as ReadonlyDefaultMap<string, number>;
    
    // We should be able to use get
    expect(map.get('test')).toBe(0);
    
    // Should compile without errors since it's read-only
    const readonlyCheck: ReadonlyMap<string, number> = map;
    expect(readonlyCheck).toBeDefined();
  });
});