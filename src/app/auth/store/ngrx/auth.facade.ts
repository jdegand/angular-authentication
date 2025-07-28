import { Injectable, computed, Signal } from '@angular/core';

import { AuthUser, INgRxAuthFacade, TokenStatus } from '../../models';

import { AuthStore } from './auth.store';

@Injectable({
  providedIn: 'root',
})
export class NgRxAuthFacade implements INgRxAuthFacade {
  private store = new AuthStore(); // Get store instance

  // Signals exposed via computed wrappers
  user: Signal<AuthUser | undefined> = computed(() => this.store.user?.());
  isLoggedIn: Signal<boolean> = computed(() => this.store.isLoggedIn());
  accessTokenStatus: Signal<TokenStatus> = computed(() => this.store.accessTokenStatus());
  refreshTokenStatus: Signal<TokenStatus> = computed(() =>
    this.store.refreshTokenStatus()
  );
  isLoadingLogin: Signal<boolean> = computed(() => this.store.isLoadingLogin());
  hasLoginError: Signal<boolean> = computed(() => this.store.hasLoginError());

  // Methods delegate to store
  login(username: string, password: string): Promise<void> {
    return this.store.login(username, password);
  }

  logout(): Promise<void> {
    return this.store.logout();
  }

  refreshToken(): Promise<void> {
    return this.store.refreshToken();
  }

  getAuthUser(): Promise<void> {
    return this.store.getAuthUser();
  }
}
