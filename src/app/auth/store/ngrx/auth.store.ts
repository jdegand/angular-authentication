import { inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { TokenStorageService } from '../../../core/services';
import { AuthService } from '../../auth.service';
import { AuthStateModel, TokenStatus } from '../../models';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthStateModel>(() => ({
    user: undefined,
    isLoggedIn: false,
    accessTokenStatus: TokenStatus.PENDING,
    refreshTokenStatus: TokenStatus.PENDING,
    isLoadingLogin: false,
    hasLoginError: false,
  })),
  withMethods(store => {
    const authService = inject(AuthService);
    const tokenStorage = inject(TokenStorageService);
    const router = inject(Router);
    const activatedRoute = inject(ActivatedRoute);

    const getAuthUser = async () => {
      try {
        const user = await firstValueFrom(authService.getAuthUser());
        patchState(store, { user });
      } catch (error) {
        console.error('Fetching user failed:', error);
        patchState(store, {
          user: undefined,
          isLoggedIn: false,
        });
      }
    };

    return {
      async login(username: string, password: string): Promise<void> {
        patchState(store, {
          accessTokenStatus: TokenStatus.VALIDATING,
          isLoadingLogin: true,
          hasLoginError: false,
        });

        try {
          const data = await firstValueFrom(authService.login(username, password));
          tokenStorage.saveTokens(data.access_token, data.refresh_token);

          patchState(store, {
            isLoggedIn: true,
            accessTokenStatus: TokenStatus.VALID,
            refreshTokenStatus: TokenStatus.VALID,
            isLoadingLogin: false,
          });

          const returnUrl = activatedRoute.snapshot.queryParams['returnUrl'] || '/';
          await router.navigateByUrl(returnUrl);

          await getAuthUser();
        } catch (error) {
          console.error('Login error:', error);
          patchState(store, {
            isLoadingLogin: false,
            accessTokenStatus: TokenStatus.INVALID,
            refreshTokenStatus: TokenStatus.INVALID,
            hasLoginError: true,
          });
          tokenStorage.removeTokens();
        }
      },

      async logout(): Promise<void> {
        try {
          await firstValueFrom(authService.logout());
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          tokenStorage.removeTokens();
          patchState(store, {
            user: undefined,
            isLoggedIn: false,
            accessTokenStatus: TokenStatus.PENDING,
            refreshTokenStatus: TokenStatus.PENDING,
            isLoadingLogin: false,
            hasLoginError: false,
          });
          await router.navigateByUrl('/');
        }
      },

      async refreshToken(): Promise<void> {
        patchState(store, { refreshTokenStatus: TokenStatus.VALIDATING });
        try {
          const data = await firstValueFrom(authService.refreshToken());
          tokenStorage.saveTokens(data.access_token, data.refresh_token);
          patchState(store, { refreshTokenStatus: TokenStatus.VALID });
          await getAuthUser();
        } catch (error) {
          console.error('Token refresh failed:', error);
          patchState(store, { refreshTokenStatus: TokenStatus.INVALID });
          tokenStorage.removeTokens();
        }
      },

      getAuthUser,
    };
  })
);
