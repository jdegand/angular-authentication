import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { AUTH_FACADE } from '../tokens';

import { AuthFacade } from './ngrx/auth.facade';
import { AuthStore } from './ngrx/auth.store';

export function provideAuthStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: AUTH_FACADE,
      useClass: AuthFacade,
    },
    AuthStore,
  ]);
}
