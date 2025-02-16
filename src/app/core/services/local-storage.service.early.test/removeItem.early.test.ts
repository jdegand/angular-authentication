// Unit tests for: removeItem

import { LocalStorageService } from '../local-storage.service';

describe('LocalStorageService.removeItem() removeItem method', () => {
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    localStorageService = new LocalStorageService();
    // Clear localStorage before each test to ensure a clean slate
    localStorage.clear();
  });

  describe('Happy Paths', () => {
    it('should remove an item from local storage when a valid key is provided', () => {
      // Arrange
      const key = 'testKey';
      const prefixedKey = `${LocalStorageService.APP_PREFIX}${key}`;
      localStorage.setItem(prefixedKey, 'testValue');

      // Act
      localStorageService.removeItem(key);

      // Assert
      expect(localStorage.getItem(prefixedKey)).toBeNull();
    });

    it('should not throw an error if the key does not exist in local storage', () => {
      // Arrange
      const key = 'nonExistentKey';

      // Act & Assert
      expect(() => localStorageService.removeItem(key)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle removing an item with an empty string as a key', () => {
      // Arrange
      const key = '';
      const prefixedKey = `${LocalStorageService.APP_PREFIX}${key}`;
      localStorage.setItem(prefixedKey, 'testValue');

      // Act
      localStorageService.removeItem(key);

      // Assert
      expect(localStorage.getItem(prefixedKey)).toBeNull();
    });

    it('should handle removing an item with a key that has special characters', () => {
      // Arrange
      const key = '!@#$%^&*()_+';
      const prefixedKey = `${LocalStorageService.APP_PREFIX}${key}`;
      localStorage.setItem(prefixedKey, 'testValue');

      // Act
      localStorageService.removeItem(key);

      // Assert
      expect(localStorage.getItem(prefixedKey)).toBeNull();
    });

    it('should handle removing an item with a very long key', () => {
      // Arrange
      const key = 'a'.repeat(1000);
      const prefixedKey = `${LocalStorageService.APP_PREFIX}${key}`;
      localStorage.setItem(prefixedKey, 'testValue');

      // Act
      localStorageService.removeItem(key);

      // Assert
      expect(localStorage.getItem(prefixedKey)).toBeNull();
    });
  });
});

// End of unit tests for: removeItem
