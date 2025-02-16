// Unit tests for: getItem

import { LocalStorageService } from '../local-storage.service';

describe('LocalStorageService.getItem() getItem method', () => {
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    localStorageService = new LocalStorageService();
    // Clear localStorage before each test to ensure a clean state
    localStorage.clear();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return the parsed object when a valid JSON string is stored', () => {
      // Arrange
      const key = 'testKey';
      const value = { name: 'John', age: 30 };
      localStorage.setItem(
        `${LocalStorageService.APP_PREFIX}${key}`,
        JSON.stringify(value)
      );

      // Act
      const result = localStorageService.getItem(key);

      // Assert
      expect(result).toEqual(value);
    });

    it('should return the string value when a non-JSON string is stored', () => {
      // Arrange
      const key = 'testKey';
      const value = 'simpleString';
      localStorage.setItem(`${LocalStorageService.APP_PREFIX}${key}`, value);

      // Act
      const result = localStorageService.getItem(key);

      // Assert
      expect(result).toBe(value);
    });

    it('should return null when the key does not exist in localStorage', () => {
      // Arrange
      const key = 'nonExistentKey';

      // Act
      const result = localStorageService.getItem(key);

      // Assert
      expect(result).toBeNull();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return null when the stored value is null', () => {
      // Arrange
      const key = 'testKey';
      localStorage.setItem(`${LocalStorageService.APP_PREFIX}${key}`, 'null');

      // Act
      const result = localStorageService.getItem(key);

      // Assert
      expect(result).toBeNull();
    });

    it('should return undefined when the stored value is undefined', () => {
      // Arrange
      const key = 'testKey';
      localStorage.setItem(`${LocalStorageService.APP_PREFIX}${key}`, 'undefined');

      // Act
      const result = localStorageService.getItem(key);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle malformed JSON gracefully and return the raw string', () => {
      // Arrange
      const key = 'testKey';
      const malformedJson = '{name: John, age: 30}'; // Missing quotes around keys
      localStorage.setItem(`${LocalStorageService.APP_PREFIX}${key}`, malformedJson);

      // Act
      const result = localStorageService.getItem(key);

      // Assert
      expect(result).toBe(malformedJson);
    });

    it('should return an empty string when the stored value is an empty string', () => {
      // Arrange
      const key = 'testKey';
      const value = '';
      localStorage.setItem(`${LocalStorageService.APP_PREFIX}${key}`, value);

      // Act
      const result = localStorageService.getItem(key);

      // Assert
      expect(result).toBe(value);
    });
  });
});

// End of unit tests for: getItem
