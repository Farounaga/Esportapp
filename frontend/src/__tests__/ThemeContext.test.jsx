import React from 'react';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

// Helper: renders a component that exposes theme context values
const ThemeConsumer = () => {
  const { theme, isDark, isLight, toggleTheme, setDarkTheme, setLightTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="isDark">{String(isDark)}</span>
      <span data-testid="isLight">{String(isLight)}</span>
      <button data-testid="toggle" onClick={toggleTheme}>toggle</button>
      <button data-testid="setDark" onClick={setDarkTheme}>dark</button>
      <button data-testid="setLight" onClick={setLightTheme}>light</button>
    </div>
  );
};

// Mock window.matchMedia (not implemented in jsdom)
const mockMatchMedia = (prefersDark) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: prefersDark
        ? query === '(prefers-color-scheme: dark)'
        : query === '(prefers-color-scheme: light)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
};

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark', 'light');
  mockMatchMedia(true); // default: system prefers dark
});

describe('ThemeContext', () => {
  test('defaults to dark when localStorage is empty and system prefers dark', () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  test('defaults to light when system prefers light and no localStorage value', () => {
    mockMatchMedia(false);
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  test('restores theme from localStorage', () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  test('toggleTheme switches from dark to light', async () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    await userEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  test('toggleTheme switches from light to dark', async () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    await userEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  test('persists theme to localStorage after toggle', async () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    await userEvent.click(screen.getByTestId('toggle'));
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('isDark is true when theme is dark', () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(screen.getByTestId('isDark').textContent).toBe('true');
    expect(screen.getByTestId('isLight').textContent).toBe('false');
  });

  test('isDark is false when theme is light', () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(screen.getByTestId('isDark').textContent).toBe('false');
    expect(screen.getByTestId('isLight').textContent).toBe('true');
  });

  test('adds "dark" class to documentElement when theme is dark', () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  test('adds "light" class to documentElement when theme is light', () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('setDarkTheme sets theme to dark', async () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    await userEvent.click(screen.getByTestId('setDark'));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  test('setLightTheme sets theme to light', async () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    await userEvent.click(screen.getByTestId('setLight'));
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  test('useTheme throws when used outside ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ThemeConsumer />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    consoleError.mockRestore();
  });
});
