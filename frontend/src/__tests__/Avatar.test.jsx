import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Avatar from '../components/common/Avatar';

describe('Avatar', () => {
  test('renders an img element', () => {
    const { getByRole } = render(<Avatar username="Alice" />);
    expect(getByRole('img')).toBeInTheDocument();
  });

  test('uses the provided src prop', () => {
    const { getByRole } = render(
      <Avatar src="https://example.com/pic.png" username="Bob" />
    );
    expect(getByRole('img')).toHaveAttribute('src', 'https://example.com/pic.png');
  });

  test('falls back to ui-avatars.com when no src is provided', () => {
    const { getByRole } = render(<Avatar username="Charlie" />);
    const img = getByRole('img');
    expect(img.getAttribute('src')).toContain('ui-avatars.com');
    expect(img.getAttribute('src')).toContain('Charlie');
  });

  test('uses "User" as fallback when username is omitted', () => {
    const { getByRole } = render(<Avatar />);
    const img = getByRole('img');
    expect(img.getAttribute('src')).toContain('User');
  });

  test('sets alt to username', () => {
    const { getByRole } = render(<Avatar username="Dave" />);
    expect(getByRole('img')).toHaveAttribute('alt', 'Dave');
  });

  test('sets alt to "User" when username is omitted', () => {
    const { getByRole } = render(<Avatar />);
    expect(getByRole('img')).toHaveAttribute('alt', 'User');
  });

  test('onError replaces src with the default avatar URL', () => {
    const { getByRole } = render(
      <Avatar src="bad-url.png" username="Eve" />
    );
    const img = getByRole('img');
    fireEvent.error(img);
    expect(img.getAttribute('src')).toContain('ui-avatars.com');
  });

  test('applies the size to inline style', () => {
    const { getByRole } = render(<Avatar username="Frank" size={64} />);
    const img = getByRole('img');
    expect(img).toHaveStyle({ width: '64px', height: '64px' });
  });

  test('defaults to size 40', () => {
    const { getByRole } = render(<Avatar username="Grace" />);
    const img = getByRole('img');
    expect(img).toHaveStyle({ width: '40px', height: '40px' });
  });

  test('encodes special characters in the username for the URL', () => {
    const { getByRole } = render(<Avatar username="Jean Dupont" />);
    const src = getByRole('img').getAttribute('src');
    expect(src).toContain('Jean%20Dupont');
  });
});
