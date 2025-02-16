// Unit tests for: saveRefreshToken

import { ConfigService } from '../config.service';
import { LocalStorageService } from '../local-storage.service';
import { TokenStorageService } from '../token-storage.service';

import { TestBed } from '@angular/core/testing';

describe('TokenStorageService.saveRefreshToken() saveRefreshToken method', () => {
  let tokenStorageService: TokenStorageService;
  let localStorageService: LocalStorageService;
  let configService: ConfigService;

  beforeEach(() => {
    const configServiceMock = {
      getAuthSettings: jest.fn().mockReturnValue({
        accessTokenKey: 'accessToken',
        refreshTokenKey: 'refreshToken',
      }),
    };

    const localStorageServiceMock = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TokenStorageService,
        { provide: ConfigService, useValue: configServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
      ],
    });

    tokenStorageService = TestBed.inject(TokenStorageService);
    localStorageService = TestBed.inject(LocalStorageService);
    configService = TestBed.inject(ConfigService);
  });

  describe('Happy Paths', () => {
    it('should save the refresh token to local storage with the correct key', () => {
      // Arrange
      const refreshToken = 'sampleRefreshToken';

      // Act
      tokenStorageService.saveRefreshToken(refreshToken);

      // Assert
      expect(localStorageService.setItem).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken
      );
    });

    it('should use the refreshTokenKey from configService if provided', () => {
      // Arrange
      const customRefreshTokenKey = 'customRefreshTokenKey';
      jest.spyOn(configService, 'getAuthSettings').mockReturnValue({
        accessTokenKey: 'accessToken',
        refreshTokenKey: customRefreshTokenKey,
      });
      const refreshToken = 'sampleRefreshToken';

      // Act
      tokenStorageService.saveRefreshToken(refreshToken);

      // Assert
      expect(localStorageService.setItem).toHaveBeenCalledWith(
        customRefreshTokenKey,
        refreshToken
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle saving an empty refresh token', () => {
      // Arrange
      const emptyRefreshToken = '';

      // Act
      tokenStorageService.saveRefreshToken(emptyRefreshToken);

      // Assert
      expect(localStorageService.setItem).toHaveBeenCalledWith(
        'refreshToken',
        emptyRefreshToken
      );
    });

    it('should handle saving a null refresh token', () => {
      // Arrange
      const nullRefreshToken = null;

      // Act
      tokenStorageService.saveRefreshToken(nullRefreshToken as any);

      // Assert
      expect(localStorageService.setItem).toHaveBeenCalledWith(
        'refreshToken',
        nullRefreshToken
      );
    });

    it('should handle saving a refresh token with special characters', () => {
      // Arrange
      const specialCharRefreshToken = '!@#$%^&*()_+';

      // Act
      tokenStorageService.saveRefreshToken(specialCharRefreshToken);

      // Assert
      expect(localStorageService.setItem).toHaveBeenCalledWith(
        'refreshToken',
        specialCharRefreshToken
      );
    });
  });
});

// End of unit tests for: saveRefreshToken
