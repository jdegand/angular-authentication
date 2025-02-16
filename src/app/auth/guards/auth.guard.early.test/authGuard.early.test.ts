// Unit tests for: authGuard

//import { inject } from '@angular/core';
import { Inject } from '../../../shared/util';
import { createUrlTreeFromSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthFacade } from '../../store/auth.facade';
import { authGuard } from '../auth.guard';

import { of } from 'rxjs';

// Mock classes for ActivatedRouteSnapshot and RouterStateSnapshot
class MockActivatedRouteSnapshot {
  // Add necessary properties and methods
  public url: string = '/some-path';
}

class MockRouterStateSnapshot {
  // Add necessary properties and methods
  public url: string = '/some-path';
}

describe('authGuard() authGuard method', () => {
  let mockAuthFacade: jest.Mocked<AuthFacade>;

  beforeEach(() => {
    mockAuthFacade = {
      isLoggedIn$: of(true), // Default to logged in
    } as any;
    jest.spyOn(Inject, 'inject').mockReturnValue(mockAuthFacade as any);
  });

  describe('Happy paths', () => {
    it('should allow the route when the user is logged in', done => {
      // Test description: Ensure the route is allowed when the user is logged in
      mockAuthFacade.isLoggedIn$ = of(true);

      const result$ = authGuard(
        new MockActivatedRouteSnapshot() as any,
        new MockRouterStateSnapshot() as any
      );

      result$.subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should redirect to login page with return URL when the user is not logged in', done => {
      // Test description: Ensure redirection to login page when the user is not logged in
      mockAuthFacade.isLoggedIn$ = of(false);

      const result$ = authGuard(
        new MockActivatedRouteSnapshot() as any,
        new MockRouterStateSnapshot() as any
      );

      result$.subscribe(result => {
        expect(result).toEqual(
          createUrlTreeFromSnapshot(
            new MockActivatedRouteSnapshot() as any,
            ['/auth/login'],
            { returnUrl: '/some-path' }
          )
        );
        done();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle the case when isLoggedIn$ emits an error', done => {
      // Test description: Ensure proper handling when isLoggedIn$ emits an error
      mockAuthFacade.isLoggedIn$ = of(false).pipe(
        map(() => {
          throw new Error('Test error');
        })
      );

      const result$ = authGuard(
        new MockActivatedRouteSnapshot() as any,
        new MockRouterStateSnapshot() as any
      );

      result$.subscribe({
        next: () => {
          // This should not be called
          done.fail('Expected an error to be thrown');
        },
        error: error => {
          expect(error).toEqual(new Error('Test error'));
          done();
        },
      });
    });

    it('should handle the case when isLoggedIn$ is empty', done => {
      // Test description: Ensure proper handling when isLoggedIn$ is empty
      mockAuthFacade.isLoggedIn$ = of();

      const result$ = authGuard(
        new MockActivatedRouteSnapshot() as any,
        new MockRouterStateSnapshot() as any
      );

      result$.subscribe(result => {
        expect(result).toEqual(
          createUrlTreeFromSnapshot(
            new MockActivatedRouteSnapshot() as any,
            ['/auth/login'],
            { returnUrl: '/some-path' }
          )
        );
        done();
      });
    });
  });
});

// End of unit tests for: authGuard
