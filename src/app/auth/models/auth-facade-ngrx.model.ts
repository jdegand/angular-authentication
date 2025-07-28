import { Signal } from '@angular/core';

import { AuthUser, TokenStatus } from '.';

export interface INgRxAuthFacade {
  // Signals representing state
  readonly user: Signal<AuthUser | undefined>;
  readonly isLoggedIn: Signal<boolean>;
  readonly accessTokenStatus: Signal<TokenStatus>;
  readonly refreshTokenStatus: Signal<TokenStatus>;
  readonly isLoadingLogin: Signal<boolean>;
  readonly hasLoginError: Signal<boolean>;

  // Methods
  login(username: string, password: string): Promise<void>;
  logout(): Promise<void>;
  refreshToken(): Promise<void>;
  getAuthUser(): Promise<void>;
}
