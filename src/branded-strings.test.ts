import { describe, test, expect } from 'vitest';
import { BrandedString, brandString, makeBrandString } from './branded-strings';

describe('BrandedString', () => {
  test('brandString correctly brands a string', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type AppleType = BrandedString<'apple'>;
    
    const apple = brandString<'apple'>('Pink Lady');
    
    // Type checking: The branded string should be assignable to a string
    const str: string = apple;
    expect(str).toBe('Pink Lady');
    
    // Runtime check: The value should remain the same
    expect(apple).toBe('Pink Lady');
  });
  
  test('brandString preserves string contents', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type UserId = BrandedString<'user-id'>;
    
    const id = brandString<'user-id'>('user-123');
    
    expect(id).toBe('user-123');
    expect(typeof id).toBe('string');
    
    // Should support all string methods
    expect(id.toUpperCase()).toBe('USER-123');
    expect(id.includes('123')).toBe(true);
  });
  
  test('makeBrandString creates a branding function', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type OrangeType = BrandedString<'orange'>;
    
    // Create a function to brand orange strings
    const makeOrange = makeBrandString<OrangeType>();
    
    // Use the function to brand a string
    const orange = makeOrange('Navel');
    
    // Type checking: It should be assignable to string
    const str: string = orange;
    expect(str).toBe('Navel');
    
    // Runtime check: Value remains the same
    expect(orange).toBe('Navel');
  });
});