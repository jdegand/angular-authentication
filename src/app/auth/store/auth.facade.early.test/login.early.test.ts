// Unit tests for: login

import { Store } from '@ngrx/store';
import { LoginActions } from '../auth.actions';
import { AuthFacade } from '../auth.facade';

import { TestBed } from '@angular/core/testing';

describe('AuthFacade.login() login method', () => {
  let authFacade: AuthFacade;
  let store: Store;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);
    TestBed.configureTestingModule({
      providers: [AuthFacade, { provide: Store, useValue: storeSpy }],
    });

    authFacade = TestBed.inject(AuthFacade);
    store = TestBed.inject(Store);
  });

  describe('Happy paths', () => {
    it('should dispatch LoginActions.request with correct username and password', () => {
      // Test to ensure the login method dispatches the correct action with valid inputs
      const username = 'testUser';
      const password = 'testPassword';

      authFacade.login(username, password);

      expect(store.dispatch).toHaveBeenCalledWith(
        LoginActions.request({ username, password })
      );
    });

    it('should handle multiple login attempts with different credentials', () => {
      // Test to ensure multiple login attempts with different credentials are handled correctly
      const firstUsername = 'firstUser';
      const firstPassword = 'firstPassword';
      const secondUsername = 'secondUser';
      const secondPassword = 'secondPassword';

      authFacade.login(firstUsername, firstPassword);
      expect(store.dispatch).toHaveBeenCalledWith(
        LoginActions.request({ username: firstUsername, password: firstPassword })
      );

      authFacade.login(secondUsername, secondPassword);
      expect(store.dispatch).toHaveBeenCalledWith(
        LoginActions.request({ username: secondUsername, password: secondPassword })
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle empty username and password', () => {
      // Test to ensure the login method handles empty strings for username and password
      const username = '';
      const password = '';

      authFacade.login(username, password);

      expect(store.dispatch).toHaveBeenCalledWith(
        LoginActions.request({ username, password })
      );
    });

    it('should handle null username and password', () => {
      // Test to ensure the login method handles null values for username and password
      const username = null;
      const password = null;

      authFacade.login(username as any, password as any);

      expect(store.dispatch).toHaveBeenCalledWith(
        LoginActions.request({ username, password })
      );
    });

    it('should handle undefined username and password', () => {
      // Test to ensure the login method handles undefined values for username and password
      const username = undefined;
      const password = undefined;

      authFacade.login(username as any, password as any);

      expect(store.dispatch).toHaveBeenCalledWith(
        LoginActions.request({ username, password })
      );
    });

    it('should handle special characters in username and password', () => {
      // Test to ensure the login method handles special characters in username and password
      const username = 'user!@#';
      const password = 'pass$%^';

      authFacade.login(username, password);

      expect(store.dispatch).toHaveBeenCalledWith(
        LoginActions.request({ username, password })
      );
    });
  });
});

// End of unit tests for: login
