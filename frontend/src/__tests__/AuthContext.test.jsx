import React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Mock the apiClient exported from services
jest.mock('../services', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

import { apiClient } from '../services';

// Helper: renders a component that exposes auth context actions
const AuthConsumer = () => {
  const { user, loading, login, register, logout, updateUser } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? JSON.stringify(user) : 'null'}</span>
      <span data-testid="loading">{String(loading)}</span>
      <button data-testid="login" onClick={() => login('test@example.com', 'password123')}>login</button>
      <button data-testid="register" onClick={() => register({ username: 'Alice', email: 'test@example.com', password: 'password123' })}>register</button>
      <button data-testid="logout" onClick={logout}>logout</button>
      <button data-testid="updateUser" onClick={() => updateUser({ id: 1, username: 'Updated' })}>updateUser</button>
    </div>
  );
};

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  // Prevent window.location.href assignment error in jsdom
  delete window.location;
  window.location = { href: '' };
});

describe('AuthContext', () => {
  test('user is null when localStorage is empty', async () => {
    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  test('restores user from localStorage on mount', async () => {
    const savedUser = { id: 1, username: 'Alice' };
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify(savedUser));

    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('user').textContent).toContain('Alice');
  });

  test('loading is false after mount', async () => {
    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
  });

  test('login success: stores token, sets user state', async () => {
    const fakeUser = { id: 1, username: 'Alice' };
    apiClient.post.mockResolvedValueOnce({ data: { token: 'jwt-token', user: fakeUser } });

    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    await userEvent.click(screen.getByTestId('login'));

    await waitFor(() => expect(screen.getByTestId('user').textContent).toContain('Alice'));
    expect(localStorage.getItem('token')).toBe('jwt-token');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(fakeUser);
  });

  test('login success: returns { success: true }', async () => {
    const fakeUser = { id: 1, username: 'Alice' };
    apiClient.post.mockResolvedValueOnce({ data: { token: 'jwt-token', user: fakeUser } });

    let result;
    const Wrapper = () => {
      const { login } = useAuth();
      return (
        <button onClick={async () => { result = await login('a@b.com', 'pass'); }}>
          login
        </button>
      );
    };
    render(<AuthProvider><Wrapper /></AuthProvider>);
    await userEvent.click(screen.getByRole('button'));
    expect(result).toEqual({ success: true });
  });

  test('login failure: returns error from API detail', async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { detail: 'Identifiants invalides' } },
    });

    let result;
    const Wrapper = () => {
      const { login } = useAuth();
      return (
        <button onClick={async () => { result = await login('a@b.com', 'bad'); }}>
          login
        </button>
      );
    };
    render(<AuthProvider><Wrapper /></AuthProvider>);
    await userEvent.click(screen.getByRole('button'));
    expect(result).toEqual({ success: false, error: 'Identifiants invalides' });
  });

  test('login failure: returns fallback message when no detail', async () => {
    apiClient.post.mockRejectedValueOnce({ response: { data: {} } });

    let result;
    const Wrapper = () => {
      const { login } = useAuth();
      return (
        <button onClick={async () => { result = await login('a@b.com', 'bad'); }}>
          login
        </button>
      );
    };
    render(<AuthProvider><Wrapper /></AuthProvider>);
    await userEvent.click(screen.getByRole('button'));
    expect(result).toEqual({ success: false, error: 'Login failed' });
  });

  test('register success: stores token and sets user', async () => {
    const fakeUser = { id: 2, username: 'Bob' };
    apiClient.post.mockResolvedValueOnce({ data: { token: 'reg-token', user: fakeUser } });

    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    await userEvent.click(screen.getByTestId('register'));

    await waitFor(() => expect(screen.getByTestId('user').textContent).toContain('Bob'));
    expect(localStorage.getItem('token')).toBe('reg-token');
  });

  test('logout: clears localStorage and sets user to null', async () => {
    localStorage.setItem('token', 'jwt-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'Alice' }));

    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('user').textContent).toContain('Alice'));

    await userEvent.click(screen.getByTestId('logout'));

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  test('updateUser: updates state and localStorage', async () => {
    localStorage.setItem('token', 'jwt-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'Alice' }));

    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('user').textContent).toContain('Alice'));

    await userEvent.click(screen.getByTestId('updateUser'));

    expect(screen.getByTestId('user').textContent).toContain('Updated');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 1, username: 'Updated' });
  });

  test('useAuth throws when used outside AuthProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AuthConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );
    consoleError.mockRestore();
  });
});
