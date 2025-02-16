// Unit tests for: noAuthGuard

import { inject } from '@angular/core';
import { createUrlTreeFromSnapshot } from '@angular/router';
import { AuthFacade } from '../../store/auth.facade';
import { noAuthGuard } from '../no-auth.guard';

import { of } from 'rxjs';

// Mock class for ActivatedRouteSnapshot
class MockActivatedRouteSnapshot {
  // Add any necessary properties or methods here
  public url: string = '/mock-url';
}

describe('noAuthGuard() noAuthGuard method', () => {
  let mockAuthFacade: jest.Mocked<AuthFacade>;
  let mockRoute: MockActivatedRouteSnapshot;

  beforeEach(() => {
    mockAuthFacade = {
      isLoggedIn$: of(false), // Default to not logged in
    } as any;

    mockRoute = new MockActivatedRouteSnapshot() as any;

    jest.spyOn(inject, 'inject').mockReturnValue(mockAuthFacade as any);
  });

  // Happy Path: User is not logged in, should allow the route
  it('should allow the route if the user is not logged in', done => {
    mockAuthFacade.isLoggedIn$ = of(false);

    noAuthGuard(mockRoute as any).subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });

  // Happy Path: User is logged in, should redirect to home page
  it('should redirect to home page if the user is logged in', done => {
    mockAuthFacade.isLoggedIn$ = of(true);

    noAuthGuard(mockRoute as any).subscribe(result => {
      expect(result).toEqual(createUrlTreeFromSnapshot(mockRoute as any, ['/']));
      done();
    });
  });

  // Edge Case: Ensure the observable completes after one emission
  it('should complete the observable after one emission', done => {
    const spy = jest.fn();
    mockAuthFacade.isLoggedIn$ = of(false);

    noAuthGuard(mockRoute as any).subscribe({
      next: spy,
      complete: () => {
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      },
    });
  });

  // Edge Case: Handle unexpected values in isLoggedIn$
  it('should handle unexpected values in isLoggedIn$', done => {
    mockAuthFacade.isLoggedIn$ = of(null as any);

    noAuthGuard(mockRoute as any).subscribe(result => {
      expect(result).toBe(true); // Default to allowing the route
      done();
    });
  });
});

// End of unit tests for: noAuthGuard
