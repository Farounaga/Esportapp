import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import Toast, { ToastContainer } from '../components/common/Toast';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('Toast', () => {
  describe('rendering', () => {
    test('renders the message text', () => {
      render(<Toast message="Succès !" type="success" duration={4000} onClose={() => {}} />);
      expect(screen.getByText('Succès !')).toBeInTheDocument();
    });

    test('renders the success icon (✓)', () => {
      render(<Toast message="ok" type="success" duration={4000} onClose={() => {}} />);
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    test('renders the error icon (✕)', () => {
      render(<Toast message="err" type="error" duration={4000} onClose={() => {}} />);
      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    test('renders the info icon (ℹ)', () => {
      render(<Toast message="info" type="info" duration={4000} onClose={() => {}} />);
      expect(screen.getByText('ℹ')).toBeInTheDocument();
    });

    test('renders the warning icon (⚠)', () => {
      render(<Toast message="warn" type="warning" duration={4000} onClose={() => {}} />);
      expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    test('defaults to success style when type is unknown', () => {
      render(<Toast message="test" type="unknown" duration={4000} onClose={() => {}} />);
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    test('is initially visible', () => {
      const { container } = render(
        <Toast message="visible" type="success" duration={4000} onClose={() => {}} />
      );
      const wrapper = container.firstChild;
      expect(wrapper.className).toContain('opacity-100');
    });
  });

  describe('auto-close', () => {
    test('calls onClose after duration + animation delay', () => {
      const onClose = jest.fn();
      render(<Toast message="test" type="success" duration={4000} onClose={onClose} />);

      act(() => jest.advanceTimersByTime(4000));
      // Not yet called — 300ms animation delay still pending
      expect(onClose).not.toHaveBeenCalled();

      act(() => jest.advanceTimersByTime(300));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('becomes invisible after duration elapses', () => {
      const { container } = render(
        <Toast message="test" type="success" duration={4000} onClose={() => {}} />
      );
      const wrapper = container.firstChild;

      act(() => jest.advanceTimersByTime(4000));
      expect(wrapper.className).toContain('opacity-0');
    });
  });

  describe('close button', () => {
    test('close button is rendered', () => {
      render(<Toast message="test" type="success" duration={4000} onClose={() => {}} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('clicking close button triggers onClose after animation', () => {
      const onClose = jest.fn();
      render(<Toast message="test" type="error" duration={4000} onClose={onClose} />);

      fireEvent.click(screen.getByRole('button'));
      expect(onClose).not.toHaveBeenCalled(); // animation not done yet

      act(() => jest.advanceTimersByTime(300));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});

describe('ToastContainer', () => {
  test('renders multiple toasts', () => {
    const toasts = [
      { id: 1, message: 'First', type: 'success', duration: 4000 },
      { id: 2, message: 'Second', type: 'error', duration: 4000 },
    ];
    render(<ToastContainer toasts={toasts} removeToast={() => {}} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  test('calls removeToast with the correct id when a toast closes', () => {
    const removeToast = jest.fn();
    const toasts = [{ id: 42, message: 'Hi', type: 'info', duration: 500 }];
    render(<ToastContainer toasts={toasts} removeToast={removeToast} />);

    act(() => jest.advanceTimersByTime(500));
    act(() => jest.advanceTimersByTime(300));

    expect(removeToast).toHaveBeenCalledWith(42);
  });

  test('renders nothing when toasts array is empty', () => {
    const { container } = render(<ToastContainer toasts={[]} removeToast={() => {}} />);
    // No Toast elements rendered
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
