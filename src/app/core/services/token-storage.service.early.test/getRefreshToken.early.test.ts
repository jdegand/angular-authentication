// Unit tests for: getRefreshToken

import { ConfigService } from '../config.service';
import { LocalStorageService } from '../local-storage.service';
import { TokenStorageService } from '../token-storage.service';

import { TestBed } from '@angular/core/testing';

describe('TokenStorageService.getRefreshToken() getRefreshToken method', () => {
  let tokenStorageService: TokenStorageService;
  let mockConfigService: Partial<ConfigService>;
  let mockLocalStorageService: Partial<LocalStorageService>;

  beforeEach(() => {
    mockConfigService = {
      getAuthSettings: jest.fn().mockReturnValue({
        accessTokenKey: 'accessToken',
        refreshTokenKey: 'refreshToken',
      }),
    };

    mockLocalStorageService = {
      getItem: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TokenStorageService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
      ],
    });

    tokenStorageService = TestBed.inject(TokenStorageService);
  });

  describe('Happy paths', () => {
    it('should return the refresh token from local storage when it exists', () => {
      // Arrange: Set up the mock to return a specific token
      const expectedToken = 'mockRefreshToken';
      mockLocalStorageService.getItem = jest.fn().mockReturnValue(expectedToken);

      // Act: Call the method under test
      const refreshToken = tokenStorageService.getRefreshToken();

      // Assert: Verify the token is returned correctly
      expect(refreshToken).toBe(expectedToken);
      expect(mockLocalStorageService.getItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('Edge cases', () => {
    it('should return null when the refresh token does not exist in local storage', () => {
      // Arrange: Set up the mock to return null
      mockLocalStorageService.getItem = jest.fn().mockReturnValue(null);

      // Act: Call the method under test
      const refreshToken = tokenStorageService.getRefreshToken();

      // Assert: Verify that null is returned
      expect(refreshToken).toBeNull();
      expect(mockLocalStorageService.getItem).toHaveBeenCalledWith('refreshToken');
    });

    it('should handle undefined return value from local storage gracefully', () => {
      // Arrange: Set up the mock to return undefined
      mockLocalStorageService.getItem = jest.fn().mockReturnValue(undefined);

      // Act: Call the method under test
      const refreshToken = tokenStorageService.getRefreshToken();

      // Assert: Verify that undefined is handled and returned
      expect(refreshToken).toBeUndefined();
      expect(mockLocalStorageService.getItem).toHaveBeenCalledWith('refreshToken');
    });
  });
});

// End of unit tests for: getRefreshToken
