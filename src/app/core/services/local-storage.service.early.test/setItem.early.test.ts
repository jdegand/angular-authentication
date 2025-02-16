// Unit tests for: setItem

import { LocalStorageService } from '../local-storage.service';

describe('LocalStorageService.setItem() setItem method', () => {
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    localStorageService = new LocalStorageService();
    // Clear localStorage before each test
    localStorage.clear();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should store a string value in localStorage', () => {
      const key = 'testKey';
      const value = 'testValue';

      localStorageService.setItem(key, value);

      expect(localStorage.getItem(`${LocalStorageService.APP_PREFIX}${key}`)).toBe(
        JSON.stringify(value)
      );
    });

    it('should store an object value in localStorage', () => {
      const key = 'testKey';
      const value = { name: 'testName', age: 30 };

      localStorageService.setItem(key, value);

      expect(localStorage.getItem(`${LocalStorageService.APP_PREFIX}${key}`)).toBe(
        JSON.stringify(value)
      );
    });

    it('should store a number value in localStorage', () => {
      const key = 'testKey';
      const value = 123;

      localStorageService.setItem(key, value);

      expect(localStorage.getItem(`${LocalStorageService.APP_PREFIX}${key}`)).toBe(
        JSON.stringify(value)
      );
    });

    it('should store a boolean value in localStorage', () => {
      const key = 'testKey';
      const value = true;

      localStorageService.setItem(key, value);

      expect(localStorage.getItem(`${LocalStorageService.APP_PREFIX}${key}`)).toBe(
        JSON.stringify(value)
      );
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle undefined value gracefully', () => {
      const key = 'testKey';
      const value = undefined;

      localStorageService.setItem(key, value);

      expect(localStorage.getItem(`${LocalStorageService.APP_PREFIX}${key}`)).toBe(
        'undefined'
      );
    });

    it('should handle null value gracefully', () => {
      const key = 'testKey';
      const value = null;

      localStorageService.setItem(key, value);

      expect(localStorage.getItem(`${LocalStorageService.APP_PREFIX}${key}`)).toBe(
        'null'
      );
    });

    it('should handle non-serializable value by storing it as a string', () => {
      const key = 'testKey';
      const value = Symbol('testSymbol');

      localStorageService.setItem(key, value);

      expect(localStorage.getItem(`${LocalStorageService.APP_PREFIX}${key}`)).toBe(
        'Symbol(testSymbol)'
      );
    });

    it('should handle large objects without throwing an error', () => {
      const key = 'testKey';
      const value = { data: 'x'.repeat(1024 * 1024) }; // 1MB string

      expect(() => localStorageService.setItem(key, value)).not.toThrow();
    });

    it('should handle special characters in key', () => {
      const key = 'test!@#$%^&*()_+';
      const value = 'testValue';

      localStorageService.setItem(key, value);

      expect(localStorage.getItem(`${LocalStorageService.APP_PREFIX}${key}`)).toBe(
        JSON.stringify(value)
      );
    });
  });
});

// End of unit tests for: setItem
