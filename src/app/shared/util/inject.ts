import { isDevMode, inject as angularInject, ProviderToken } from '@angular/core';

export class Inject {
  private static map: Map<ProviderToken<any>, any> = new Map<ProviderToken<unknown>, unknown>();

  static mock<T>(token: ProviderToken<T>, value: T) {
    this.map.set(token, value);
  }

  static get<T>(token: ProviderToken<T>): T {
    return this.map.get(token);
  }

  static has<T>(token: ProviderToken<T>): boolean {
    return this.map.has(token);
  }

  static inject<T>(token: ProviderToken<T>): T {
    if (isDevMode() && Inject.has<T>(token)) {
      return Inject.get(token);
    }
    return angularInject<T>(token);
  }
}
