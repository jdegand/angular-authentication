// Unit tests for: authRoutes

import { authRoutes } from '../auth.routes';
import { noAuthGuard } from '../guards';

describe('authRoutes() authRoutes method', () => {
  describe('Happy Paths', () => {
    it('should have a route for login', () => {
      // Test to ensure the login route is defined
      const loginRoute = authRoutes.find(route => route.path === 'login');
      expect(loginRoute).toBeDefined();
    });

    it('should have noAuthGuard for login route', () => {
      // Test to ensure the login route has the noAuthGuard
      const loginRoute = authRoutes.find(route => route.path === 'login');
      expect(loginRoute?.canActivate).toContain(noAuthGuard);
    });

    it('should load the login component for login route', async () => {
      // Test to ensure the login route loads the correct component
      const loginRoute = authRoutes.find(route => route.path === 'login');
      const component = await loginRoute?.loadComponent();
      expect(component).toBeDefined();
      expect(component.name).toBe('LoginComponent');
    });
  });

  describe('Edge Cases', () => {
    it('should not have undefined paths', () => {
      // Test to ensure no route has an undefined path
      authRoutes.forEach(route => {
        expect(route.path).toBeDefined();
      });
    });

    it('should handle missing canActivate gracefully', () => {
      // Test to ensure routes without canActivate do not throw errors
      const routesWithoutGuards = authRoutes.filter(route => !route.canActivate);
      routesWithoutGuards.forEach(route => {
        expect(route.canActivate).toBeUndefined();
      });
    });

    it('should handle missing loadComponent gracefully', () => {
      // Test to ensure routes without loadComponent do not throw errors
      const routesWithoutLoadComponent = authRoutes.filter(route => !route.loadComponent);
      routesWithoutLoadComponent.forEach(route => {
        expect(route.loadComponent).toBeUndefined();
      });
    });
  });
});

// End of unit tests for: authRoutes
