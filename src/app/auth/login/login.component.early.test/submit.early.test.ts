// Unit tests for: submit

import { ReactiveFormsModule } from '@angular/forms';
import { AuthFacade } from '../../store/auth.facade';
import { LoginComponent } from '../login.component';

import { TestBed } from '@angular/core/testing';

describe('LoginComponent.submit() submit method', () => {
  let component: LoginComponent;
  let authFacadeMock: jest.Mocked<AuthFacade>;

  beforeEach(() => {
    authFacadeMock = {
      login: jest.fn(),
      isLoadingLogin$: jest.fn(),
      hasLoginError$: jest.fn(),
    } as unknown as jest.Mocked<AuthFacade>;

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [{ provide: AuthFacade, useValue: authFacadeMock }],
    });

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  describe('Happy paths', () => {
    it('should call authFacade.login with correct username and password when form is valid', () => {
      // Arrange: Set valid form values
      component.loginForm.setValue({ username: 'testuser', password: 'testpass' });

      // Act: Call the submit method
      component.submit();

      // Assert: Ensure login is called with correct parameters
      expect(authFacadeMock.login).toHaveBeenCalledWith('testuser', 'testpass');
    });
  });

  describe('Edge cases', () => {
    it('should not call authFacade.login if username is missing', () => {
      // Arrange: Set form with missing username
      component.loginForm.setValue({ username: '', password: 'testpass' });

      // Act: Call the submit method
      component.submit();

      // Assert: Ensure login is not called
      expect(authFacadeMock.login).not.toHaveBeenCalled();
    });

    it('should not call authFacade.login if password is missing', () => {
      // Arrange: Set form with missing password
      component.loginForm.setValue({ username: 'testuser', password: '' });

      // Act: Call the submit method
      component.submit();

      // Assert: Ensure login is not called
      expect(authFacadeMock.login).not.toHaveBeenCalled();
    });

    it('should not call authFacade.login if both username and password are missing', () => {
      // Arrange: Set form with missing username and password
      component.loginForm.setValue({ username: '', password: '' });

      // Act: Call the submit method
      component.submit();

      // Assert: Ensure login is not called
      expect(authFacadeMock.login).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: submit
