// Unit tests for: removeTokens

import { ConfigService } from '../config.service';
import { LocalStorageService } from '../local-storage.service';
import { TokenStorageService } from '../token-storage.service';

import { TestBed } from '@angular/core/testing';

describe('TokenStorageService.removeTokens() removeTokens method', () => {
  let tokenStorageService: TokenStorageService;
  let localStorageService: jest.Mocked<LocalStorageService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    const localStorageServiceMock = {
      removeItem: jest.fn(),
      getItem: jest.fn(),
      setItem: jest.fn(),
    };

    const configServiceMock = {
      getAuthSettings: jest.fn().mockReturnValue({
        accessTokenKey: 'accessToken',
        refreshTokenKey: 'refreshToken',
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        TokenStorageService,
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    });

    tokenStorageService = TestBed.inject(TokenStorageService);
    localStorageService = TestBed.inject(
      LocalStorageService
    ) as jest.Mocked<LocalStorageService>;
    configService = TestBed.inject(ConfigService) as jest.Mocked<ConfigService>;
  });

  describe('Happy Paths', () => {
    it('should remove both access and refresh tokens from local storage', () => {
      // Arrange: Ensure tokens are set in local storage
      localStorageService.setItem('accessToken', 'dummyAccessToken');
      localStorageService.setItem('refreshToken', 'dummyRefreshToken');

      // Act: Call removeTokens
      tokenStorageService.removeTokens();

      // Assert: Verify that removeItem was called for both tokens
      expect(localStorageService.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorageService.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('Edge Cases', () => {
    it('should handle the case where access token key is missing gracefully', () => {
      // Arrange: Simulate missing access token key
      configService.getAuthSettings.mockReturnValueOnce({
        accessTokenKey: '',
        refreshTokenKey: 'refreshToken',
      });

      // Act: Call removeTokens
      tokenStorageService.removeTokens();

      // Assert: Verify that removeItem was not called for access token
      expect(localStorageService.removeItem).not.toHaveBeenCalledWith('');
      expect(localStorageService.removeItem).toHaveBeenCalledWith('refreshToken');
    });

    it('should handle the case where refresh token key is missing gracefully', () => {
      // Arrange: Simulate missing refresh token key
      configService.getAuthSettings.mockReturnValueOnce({
        accessTokenKey: 'accessToken',
        refreshTokenKey: '',
      });

      // Act: Call removeTokens
      tokenStorageService.removeTokens();

      // Assert: Verify that removeItem was not called for refresh token
      expect(localStorageService.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorageService.removeItem).not.toHaveBeenCalledWith('');
    });

    it('should handle the case where both token keys are missing gracefully', () => {
      // Arrange: Simulate missing both token keys
      configService.getAuthSettings.mockReturnValueOnce({
        accessTokenKey: '',
        refreshTokenKey: '',
      });

      // Act: Call removeTokens
      tokenStorageService.removeTokens();

      // Assert: Verify that removeItem was not called for any token
      expect(localStorageService.removeItem).not.toHaveBeenCalledWith('');
    });
  });
});

// End of unit tests for: removeTokens
