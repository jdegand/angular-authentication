// Unit tests for: authServiceInitProvider

import { throwError } from 'rxjs';
import { AuthService, authServiceInitProvider } from '../auth.service';
import { RefreshTokenActions } from '../store/auth.actions';
import { AuthState, TokenStatus } from '../store/auth.models';
import * as AuthSelectors from '../store/auth.selectors';

import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('authServiceInitProvider() authServiceInitProvider method', () => {
  let authService: AuthService;
  let store: MockStore;
  const initialState: AuthState = {
    refreshTokenStatus: TokenStatus.INVALID,
    user: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideMockStore({ initialState }),
        authServiceInitProvider,
      ],
    });

    authService = TestBed.inject(AuthService);
    store = TestBed.inject(MockStore);
  });

  describe('Happy Paths', () => {
    it('should dispatch RefreshTokenActions.request and resolve when refreshTokenStatus is INVALID', async () => {
      // Arrange
      const expectedAuthState: AuthState = {
        refreshTokenStatus: TokenStatus.INVALID,
        user: null,
      };
      store.overrideSelector(AuthSelectors.selectAuth, expectedAuthState);

      // Act
      const result = await authService.init();

      // Assert
      expect(result).toEqual(expectedAuthState);
      expect(store.dispatch).toHaveBeenCalledWith(RefreshTokenActions.request());
    });

    it('should resolve when refreshTokenStatus is VALID and user is present', async () => {
      // Arrange
      const expectedAuthState: AuthState = {
        refreshTokenStatus: TokenStatus.VALID,
        user: { id: '123', name: 'Test User' },
      };
      store.overrideSelector(AuthSelectors.selectAuth, expectedAuthState);

      // Act
      const result = await authService.init();

      // Assert
      expect(result).toEqual(expectedAuthState);
    });
  });

  describe('Edge Cases', () => {
    it('should handle case where auth state is not immediately available', async () => {
      // Arrange
      const delayedAuthState: AuthState = {
        refreshTokenStatus: TokenStatus.VALID,
        user: { id: '123', name: 'Test User' },
      };
      store.overrideSelector(AuthSelectors.selectAuth, delayedAuthState);

      // Act
      const result = await authService.init();

      // Assert
      expect(result).toEqual(delayedAuthState);
    });

    it('should throw an error if the store selector throws an error', async () => {
      // Arrange
      store.overrideSelector(
        AuthSelectors.selectAuth,
        throwError(() => new Error('Selector error'))
      );

      // Act & Assert
      await expect(authService.init()).rejects.toThrow('Selector error');
    });
  });
});

// End of unit tests for: authServiceInitProvider
