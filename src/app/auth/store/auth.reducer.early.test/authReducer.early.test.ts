// Unit tests for: authReducer

import {
  AuthUserActions,
  LoginActions,
  LogoutAction,
  RefreshTokenActions,
} from '../auth.actions';
import { TokenStatus } from '../auth.models';
import { authReducer, initialState } from '../auth.reducer';

// MockAction interface to simulate the Action behavior
interface MockAction {
  type: string;
  error?: any;
  user?: any;
}

describe('authReducer() authReducer method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should handle LoginActions.request and update state correctly', () => {
      const mockAction: MockAction = { type: LoginActions.request.type } as any;
      const result = authReducer(initialState, mockAction);
      expect(result).toEqual({
        ...initialState,
        accessTokenStatus: TokenStatus.VALIDATING,
        isLoadingLogin: true,
        hasLoginError: false,
      });
    });

    it('should handle RefreshTokenActions.request and update state correctly', () => {
      const mockAction: MockAction = { type: RefreshTokenActions.request.type } as any;
      const result = authReducer(initialState, mockAction);
      expect(result).toEqual({
        ...initialState,
        refreshTokenStatus: TokenStatus.VALIDATING,
      });
    });

    it('should handle LoginActions.success and update state correctly', () => {
      const mockAction: MockAction = { type: LoginActions.success.type } as any;
      const result = authReducer(initialState, mockAction);
      expect(result).toEqual({
        ...initialState,
        isLoggedIn: true,
        isLoadingLogin: false,
        accessTokenStatus: TokenStatus.VALID,
        refreshTokenStatus: TokenStatus.VALID,
      });
    });

    it('should handle LogoutAction and reset state to initialState', () => {
      const mockAction: MockAction = { type: LogoutAction.type } as any;
      const result = authReducer(initialState, mockAction);
      expect(result).toEqual(initialState);
    });

    it('should handle AuthUserActions.success and update user in state', () => {
      const mockUser = { id: 1, name: 'Test User' };
      const mockAction: MockAction = {
        type: AuthUserActions.success.type,
        user: mockUser,
      } as any;
      const result = authReducer(initialState, mockAction);
      expect(result).toEqual({
        ...initialState,
        user: mockUser,
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle LoginActions.failure and update state with error', () => {
      const mockError = new Error('Login failed');
      const mockAction: MockAction = {
        type: LoginActions.failure.type,
        error: mockError,
      } as any;
      const result = authReducer(initialState, mockAction);
      expect(result).toEqual({
        ...initialState,
        isLoadingLogin: false,
        accessTokenStatus: TokenStatus.INVALID,
        refreshTokenStatus: TokenStatus.INVALID,
        hasLoginError: true,
      });
    });

    it('should handle RefreshTokenActions.failure and update state without login error', () => {
      const mockAction: MockAction = { type: RefreshTokenActions.failure.type } as any;
      const result = authReducer(initialState, mockAction);
      expect(result).toEqual({
        ...initialState,
        isLoadingLogin: false,
        accessTokenStatus: TokenStatus.INVALID,
        refreshTokenStatus: TokenStatus.INVALID,
        hasLoginError: false,
      });
    });

    it('should handle AuthUserActions.failure and reset state to initialState', () => {
      const mockAction: MockAction = { type: AuthUserActions.failure.type } as any;
      const result = authReducer(initialState, mockAction);
      expect(result).toEqual(initialState);
    });
  });
});

// End of unit tests for: authReducer
