import { Injectable, computed } from '@angular/core';

import { AuthStore } from './auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private store = new AuthStore(); // Call once to get the store instance

  // Expose signals as computed signals or observables
  user$ = computed(() => this.store.user);
  isLoggedIn$ = computed(() => this.store.isLoggedIn);
  accessTokenStatus$ = computed(() => this.store.accessTokenStatus);
  refreshTokenStatus$ = computed(() => this.store.refreshTokenStatus);
  isLoadingLogin$ = computed(() => this.store.isLoadingLogin);
  hasLoginError$ = computed(() => this.store.hasLoginError);

  // Wrapper methods to call store methods
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
