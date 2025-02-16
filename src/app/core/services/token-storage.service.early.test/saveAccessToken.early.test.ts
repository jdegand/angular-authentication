// Unit tests for: saveAccessToken

import { ConfigService } from '../config.service';
import { LocalStorageService } from '../local-storage.service';
import { TokenStorageService } from '../token-storage.service';

import { TestBed } from '@angular/core/testing';

describe('TokenStorageService.saveAccessToken() saveAccessToken method', () => {
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
      setItem: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        TokenStorageService,
      ],
    });

    tokenStorageService = TestBed.inject(TokenStorageService);
  });

  describe('Happy Paths', () => {
    it('should save the access token using the default key', () => {
      // Arrange
      const token = 'sampleAccessToken';

      // Act
      tokenStorageService.saveAccessToken(token);

      // Assert
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith('accessToken', token);
    });

    it('should save the access token using a custom key from config', () => {
      // Arrange
      const customAccessTokenKey = 'customAccessTokenKey';
      const token = 'sampleAccessToken';
      mockConfigService.getAuthSettings = jest.fn().mockReturnValue({
        accessTokenKey: customAccessTokenKey,
        refreshTokenKey: 'refreshToken',
      });

      // Re-inject the service to apply the new config
      tokenStorageService = TestBed.inject(TokenStorageService);

      // Act
      tokenStorageService.saveAccessToken(token);

      // Assert
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
        customAccessTokenKey,
        token
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle saving an empty string as the access token', () => {
      // Arrange
      const token = '';

      // Act
      tokenStorageService.saveAccessToken(token);

      // Assert
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith('accessToken', token);
    });

    it('should handle saving a very long access token', () => {
      // Arrange
      const token = 'a'.repeat(1000); // A very long token

      // Act
      tokenStorageService.saveAccessToken(token);

      // Assert
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith('accessToken', token);
    });

    it('should handle saving a token with special characters', () => {
      // Arrange
      const token = '!@#$%^&*()_+|}{":?><,./;\'[]\\=-`~';

      // Act
      tokenStorageService.saveAccessToken(token);

      // Assert
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith('accessToken', token);
    });
  });
});

// End of unit tests for: saveAccessToken
