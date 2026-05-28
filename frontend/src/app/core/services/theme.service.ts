import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';
  private current: 'light' | 'dark' = 'light';

  constructor() {
    this.init();
  }

  private init(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY) as 'light' | 'dark' | null;
    if (stored === 'light' || stored === 'dark') {
      this.current = stored;
    } else {
      this.current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    this.apply();
  }

  getTheme(): 'light' | 'dark' {
    return this.current;
  }

  isDark(): boolean {
    return this.current === 'dark';
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.current = theme;
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.apply();
  }

  toggleTheme(): void {
    this.setTheme(this.current === 'dark' ? 'light' : 'dark');
  }

  private apply(): void {
    document.documentElement.setAttribute('data-theme', this.current);
  }
}
