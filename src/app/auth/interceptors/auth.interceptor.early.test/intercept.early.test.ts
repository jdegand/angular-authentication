// Unit tests for: intercept

import { HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { AuthInterceptor } from '../auth.interceptor';

// Mock classes
class MockHttpRequest {
  public url: string = '';
  public clone = jest.fn().mockReturnThis();
}

class MockHttpHandler {
  public handle = jest
    .fn()
    .mockReturnValue(EMPTY as any as Observable<HttpEvent<unknown>>);
}

// Mock services
const mockTokenStorageService = {
  getAccessToken: jest.fn(),
};

const mockAuthFacade = {
  logout: jest.fn(),
};

describe('AuthInterceptor.intercept() intercept method', () => {
  let interceptor: AuthInterceptor;
  let mockRequest: MockHttpRequest;
  let mockHandler: MockHttpHandler;

  beforeEach(() => {
    interceptor = new AuthInterceptor(
      mockAuthFacade as any,
      mockTokenStorageService as any
    );
    mockRequest = new MockHttpRequest() as any;
    mockHandler = new MockHttpHandler() as any;
  });

  describe('intercept', () => {
    // Happy path: Test when access token is available
    it('should add Authorization header when access token is available', () => {
      mockTokenStorageService.getAccessToken.mockReturnValue('test-token');
      mockRequest.url = '/api/test';

      interceptor.intercept(mockRequest as any, mockHandler as any);

      expect(mockRequest.clone).toHaveBeenCalledWith({
        setHeaders: { Authorization: 'Bearer test-token' },
      });
      expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
    });

    // Happy path: Test when no access token is available
    it('should not add Authorization header when no access token is available', () => {
      mockTokenStorageService.getAccessToken.mockReturnValue(null);
      mockRequest.url = '/api/test';

      interceptor.intercept(mockRequest as any, mockHandler as any);

      expect(mockRequest.clone).not.toHaveBeenCalled();
      expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
    });

    // Edge case: Test when request URL includes '/auth/'
    it('should rethrow error for URLs including "/auth/"', () => {
      const errorResponse = new HttpErrorResponse({ status: 401 });
      mockHandler.handle.mockReturnValue(throwError(() => errorResponse) as any);
      mockRequest.url = '/auth/login';

      interceptor.intercept(mockRequest as any, mockHandler as any).subscribe({
        error: error => {
          expect(error).toBe(errorResponse);
        },
      });
    });

    // Edge case: Test handling of 401 error
    it('should call handle401 and return EMPTY for 401 error', () => {
      const errorResponse = new HttpErrorResponse({ status: 401 });
      mockHandler.handle.mockReturnValue(throwError(() => errorResponse) as any);
      mockRequest.url = '/api/test';

      const handle401Spy = jest.spyOn(interceptor as any, 'handle401');

      interceptor.intercept(mockRequest as any, mockHandler as any).subscribe({
        next: result => {
          expect(result).toBe(EMPTY);
        },
      });

      expect(handle401Spy).toHaveBeenCalled();
      expect(mockAuthFacade.logout).toHaveBeenCalled();
    });

    // Edge case: Test handling of non-401 error
    it('should rethrow non-401 errors', () => {
      const errorResponse = new HttpErrorResponse({ status: 403 });
      mockHandler.handle.mockReturnValue(throwError(() => errorResponse) as any);
      mockRequest.url = '/api/test';

      interceptor.intercept(mockRequest as any, mockHandler as any).subscribe({
        error: error => {
          expect(error).toBe(errorResponse);
        },
      });
    });
  });
});

/*
import { HttpErrorResponse, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EMPTY, Observable, throwError } from 'rxjs';
import { AuthInterceptor } from '../auth.interceptor';
import { TokenStorageService } from '../../../core/services';
import { AuthFacade } from '../../store/auth.facade';

class MockHttpRequest extends HttpRequest<any> {
  constructor() {
    super('GET', '/');
  }
  override clone = jest.fn().mockReturnThis();
}

class MockHttpHandler extends HttpHandler {
  handle = jest.fn().mockReturnValue(EMPTY as Observable<HttpEvent<any>>);
}

const mockTokenStorageService = {
  getAccessToken: jest.fn(),
};

const mockAuthFacade = {
  logout: jest.fn(),
};

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let mockRequest: MockHttpRequest;
  let mockHandler: MockHttpHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: TokenStorageService, useValue: mockTokenStorageService },
        { provide: AuthFacade, useValue: mockAuthFacade },
      ],
    });

    interceptor = TestBed.inject(AuthInterceptor);
    mockRequest = new MockHttpRequest() as any;
    mockHandler = new MockHttpHandler() as any;
  });

  describe('intercept', () => {
    it('should add Authorization header when access token is available', () => {
      mockTokenStorageService.getAccessToken.mockReturnValue('test-token');
      mockRequest.url = '/api/test';

      interceptor.intercept(mockRequest as any, mockHandler as any).subscribe();

      expect(mockRequest.clone).toHaveBeenCalledWith({
        setHeaders: { Authorization: 'Bearer test-token' },
      });
      expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
    });

    it('should not add Authorization header when no access token is available', () => {
      mockTokenStorageService.getAccessToken.mockReturnValue(null);
      mockRequest.url = '/api/test';

      interceptor.intercept(mockRequest as any, mockHandler as any).subscribe();

      expect(mockRequest.clone).not.toHaveBeenCalled();
      expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
    });

    it('should rethrow error for URLs including "/auth/"', () => {
      const errorResponse = new HttpErrorResponse({ status: 401 });
      mockHandler.handle.mockReturnValue(throwError(() => errorResponse) as any);
      mockRequest.url = '/auth/login';

      interceptor.intercept(mockRequest as any, mockHandler as any).subscribe({
        error: error => {
          expect(error).toBe(errorResponse);
        },
      });
    });

    it('should call handle401 and return EMPTY for 401 error', () => {
      const errorResponse = new HttpErrorResponse({ status: 401 });
      mockHandler.handle.mockReturnValue(throwError(() => errorResponse) as any);
      mockRequest.url = '/api/test';

      const handle401Spy = jest.spyOn(interceptor as any, 'handle401');

      interceptor.intercept(mockRequest as any, mockHandler as any).subscribe({
        next: result => {
          expect(result).toBe(EMPTY);
        },
      });

      expect(handle401Spy).toHaveBeenCalled();
      expect(mockAuthFacade.logout).toHaveBeenCalled();
    });

    it('should rethrow non-401 errors', () => {
      const errorResponse = new HttpErrorResponse({ status: 403 });
      mockHandler.handle.mockReturnValue(throwError(() => errorResponse) as any);
      mockRequest.url = '/api/test';

      interceptor.intercept(mockRequest as any, mockHandler as any).subscribe({
        error: error => {
          expect(error).toBe(errorResponse);
        },
      });
    });
  });
});
*/

// End of unit tests for: intercept
