// Unit tests for: saveTokens

import { ConfigService } from '../config.service';
import { LocalStorageService } from '../local-storage.service';
import { TokenStorageService } from '../token-storage.service';

import { TestBed } from '@angular/core/testing';

describe('TokenStorageService.saveTokens() saveTokens method', () => {
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
        TokenStorageService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
      ],
    });

    tokenStorageService = TestBed.inject(TokenStorageService);
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should save both access and refresh tokens correctly', () => {
      // Arrange
      const accessToken = 'testAccessToken';
      const refreshToken = 'testRefreshToken';

      // Act
      tokenStorageService.saveTokens(accessToken, refreshToken);

      // Assert
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
        'accessToken',
        accessToken
      );
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken
      );
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle empty strings as tokens', () => {
      // Arrange
      const accessToken = '';
      const refreshToken = '';

      // Act
      tokenStorageService.saveTokens(accessToken, refreshToken);

      // Assert
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
        'accessToken',
        accessToken
      );
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken
      );
    });

    it('should handle null values as tokens', () => {
      // Arrange
      const accessToken = null;
      const refreshToken = null;

      // Act
      tokenStorageService.saveTokens(accessToken as any, refreshToken as any);

      // Assert
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
        'accessToken',
        accessToken
      );
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken
      );
    });

    it('should handle undefined values as tokens', () => {
      // Arrange
      const accessToken = undefined;
      const refreshToken = undefined;

      // Act
      tokenStorageService.saveTokens(accessToken as any, refreshToken as any);

      // Assert
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
        'accessToken',
        accessToken
      );
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken
      );
    });
  });
});

// End of unit tests for: saveTokens
