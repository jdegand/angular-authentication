// Unit tests for: getAccessToken

import { ConfigService } from '../config.service';
import { LocalStorageService } from '../local-storage.service';
import { TokenStorageService } from '../token-storage.service';

import { TestBed } from '@angular/core/testing';

describe('TokenStorageService.getAccessToken() getAccessToken method', () => {
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

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return the access token from local storage when it exists', () => {
      // Arrange: Set up the mock to return a specific token
      const expectedToken = 'mockAccessToken';
      mockLocalStorageService.getItem = jest.fn().mockReturnValue(expectedToken);

      // Act: Call the method under test
      const accessToken = tokenStorageService.getAccessToken();

      // Assert: Verify the token is returned as expected
      expect(accessToken).toBe(expectedToken);
      expect(mockLocalStorageService.getItem).toHaveBeenCalledWith('accessToken');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return null if the access token does not exist in local storage', () => {
      // Arrange: Set up the mock to return null
      mockLocalStorageService.getItem = jest.fn().mockReturnValue(null);

      // Act: Call the method under test
      const accessToken = tokenStorageService.getAccessToken();

      // Assert: Verify that null is returned
      expect(accessToken).toBeNull();
      expect(mockLocalStorageService.getItem).toHaveBeenCalledWith('accessToken');
    });

    it('should return undefined if the access token key is not set in config', () => {
      // Arrange: Modify the mock config service to return undefined for accessTokenKey
      mockConfigService.getAuthSettings = jest.fn().mockReturnValue({
        accessTokenKey: undefined,
        refreshTokenKey: 'refreshToken',
      });

      // Act: Call the method under test
      const accessToken = tokenStorageService.getAccessToken();

      // Assert: Verify that undefined is returned
      expect(accessToken).toBeUndefined();
      expect(mockLocalStorageService.getItem).toHaveBeenCalledWith('accessToken');
    });
  });
});

// End of unit tests for: getAccessToken
