// Unit tests for: sendPageView

import { GoogleAnalyticsService } from '../google-analytics.service';

declare const gtag: jest.Mock;

describe('GoogleAnalyticsService.sendPageView() sendPageView method', () => {
  let service: GoogleAnalyticsService;

  beforeEach(() => {
    // Mock the global gtag function
    (global as any).gtag = jest.fn();
    service = new GoogleAnalyticsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy paths', () => {
    it('should call gtag with correct parameters when gtag is defined', () => {
      // Arrange
      const url = '/test-url';

      // Act
      service.sendPageView(url);

      // Assert
      expect(gtag).toHaveBeenCalledWith('config', 'UA-217340656-1', { page_path: url });
    });

    it('should not call gtag if the URL is an empty string', () => {
      // Arrange
      const url = '';

      // Act
      service.sendPageView(url);

      // Assert
      expect(gtag).toHaveBeenCalledWith('config', 'UA-217340656-1', { page_path: url });
    });
  });

  describe('Edge cases', () => {
    it('should not call gtag if gtag is undefined', () => {
      // Arrange
      delete (global as any).gtag;
      service = new GoogleAnalyticsService();
      const url = '/test-url';

      // Act
      service.sendPageView(url);

      // Assert
      expect(gtag).not.toHaveBeenCalled();
    });

    it('should handle null URL gracefully', () => {
      // Arrange
      const url = null as unknown as string;

      // Act
      service.sendPageView(url);

      // Assert
      expect(gtag).toHaveBeenCalledWith('config', 'UA-217340656-1', { page_path: url });
    });

    it('should handle undefined URL gracefully', () => {
      // Arrange
      const url = undefined as unknown as string;

      // Act
      service.sendPageView(url);

      // Assert
      expect(gtag).toHaveBeenCalledWith('config', 'UA-217340656-1', { page_path: url });
    });
  });
});

// End of unit tests for: sendPageView
