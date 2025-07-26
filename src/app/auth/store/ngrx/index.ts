import {
  computed,
  EnvironmentProviders,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { lastValueFrom, take } from 'rxjs';

import { TokenStatus } from '../../models';

import { AuthStore } from './auth.store';

const initializeAuth = () => {
  const authStore = inject(AuthStore);

  // Trigger token refresh
  authStore.refreshToken();

  // Create a omreactive computed to monitor token status + user availability
  const authReady$ = toObservable(
    computed(() => {
      const status = authStore.refreshTokenStatus();
      const user = authStore.user?.();
      return status === TokenStatus.INVALID || (status === TokenStatus.VALID && !!user);
    })
  );

  // Return as a promise to block app init until auth status is ready
  return lastValueFrom(authReady$.pipe(effect => effect, take(1)));
};

export const provideAuthInit = (): EnvironmentProviders => {
  return provideAppInitializer(initializeAuth);
};
