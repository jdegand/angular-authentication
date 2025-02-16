// Unit tests for: getAuthUser

import { Store } from '@ngrx/store';
import { AuthUserActions } from '../auth.actions';
import { AuthFacade } from '../auth.facade';

import { TestBed } from '@angular/core/testing';

describe('AuthFacade.getAuthUser() getAuthUser method', () => {
  let facade: AuthFacade;
  let store: Store;

  beforeEach(() => {
    const storeMock = {
      dispatch: jest.fn(),
      select: jest.fn().mockReturnValue({
        subscribe: jest.fn(),
      }),
    };

    TestBed.configureTestingModule({
      providers: [AuthFacade, { provide: Store, useValue: storeMock }],
    });

    facade = TestBed.inject(AuthFacade);
    store = TestBed.inject(Store);
  });

  describe('Happy paths', () => {
    it('should dispatch AuthUserActions.request when getAuthUser is called', () => {
      // Test to ensure that the getAuthUser method dispatches the correct action
      facade.getAuthUser();
      expect(store.dispatch).toHaveBeenCalledWith(AuthUserActions.request());
    });
  });

  describe('Edge cases', () => {
    it('should handle multiple calls to getAuthUser gracefully', () => {
      // Test to ensure that multiple calls to getAuthUser do not cause issues
      facade.getAuthUser();
      facade.getAuthUser();
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(AuthUserActions.request());
    });

    it('should not throw an error if store is not initialized', () => {
      // Test to ensure that calling getAuthUser does not throw an error even if store is not properly initialized
      const uninitializedFacade = new AuthFacade();
      expect(() => uninitializedFacade.getAuthUser()).not.toThrow();
    });
  });
});

// End of unit tests for: getAuthUser
