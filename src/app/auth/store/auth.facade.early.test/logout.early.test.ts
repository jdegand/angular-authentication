// Unit tests for: logout

import { Store } from '@ngrx/store';
import { LogoutAction } from '../auth.actions';
import { AuthFacade } from '../auth.facade';

import { TestBed } from '@angular/core/testing';

describe('AuthFacade.logout() logout method', () => {
  let authFacade: AuthFacade;
  let store: Store;

  beforeEach(() => {
    // Mock the Store
    const storeMock = {
      dispatch: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [AuthFacade, { provide: Store, useValue: storeMock }],
    });

    authFacade = TestBed.inject(AuthFacade);
    store = TestBed.inject(Store);
  });

  describe('Happy paths', () => {
    it('should dispatch LogoutAction when logout is called', () => {
      // Test description: This test ensures that the logout method dispatches the LogoutAction correctly.

      // Act
      authFacade.logout();

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(LogoutAction());
    });
  });

  describe('Edge cases', () => {
    it('should handle multiple logout calls gracefully', () => {
      // Test description: This test checks if multiple calls to logout still result in the correct action being dispatched each time.

      // Act
      authFacade.logout();
      authFacade.logout();

      // Assert
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenNthCalledWith(1, LogoutAction());
      expect(store.dispatch).toHaveBeenNthCalledWith(2, LogoutAction());
    });

    it('should not throw an error if store is not initialized', () => {
      // Test description: This test ensures that calling logout does not throw an error even if the store is not properly initialized.

      // Arrange
      const faultyStoreMock = {
        dispatch: jest.fn().mockImplementation(() => {
          throw new Error('Store not initialized');
        }),
      };
      TestBed.overrideProvider(Store, { useValue: faultyStoreMock });

      // Act & Assert
      expect(() => authFacade.logout()).not.toThrow();
    });
  });
});

// End of unit tests for: logout
