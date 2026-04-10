import React, { useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from '../components/common/FormInput';

// Controlled wrapper so FormInput receives live value updates
const ControlledInput = ({ initialValue = '', ...props }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <FormInput
      name="test"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
};

describe('FormInput', () => {
  describe('rendering', () => {
    test('renders a text input by default', () => {
      render(<ControlledInput />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('renders a label when provided', () => {
      render(<ControlledInput label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    test('shows asterisk when validation includes required', () => {
      render(<ControlledInput label="Email" validation={['required']} />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    test('does not show asterisk when required is not set', () => {
      render(<ControlledInput label="Email" validation={['email']} />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    test('renders a textarea when type is "textarea"', () => {
      render(<ControlledInput type="textarea" />);
      expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
    });

    test('disables the input when disabled prop is true', () => {
      render(<ControlledInput disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    test('renders hint text when hint prop is provided', () => {
      render(<ControlledInput hint="Au moins 8 caractères" />);
      expect(screen.getByText('Au moins 8 caractères')).toBeInTheDocument();
    });
  });

  describe('validation — no error before blur', () => {
    test('does not show error before the field is touched', () => {
      render(<ControlledInput validation={['required']} />);
      expect(screen.queryByText('Ce champ est requis')).not.toBeInTheDocument();
    });
  });

  describe('required rule', () => {
    test('shows error after blur with empty value', () => {
      render(<ControlledInput validation={['required']} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
    });

    test('no error after blur with non-empty value', () => {
      render(<ControlledInput initialValue="hello" validation={['required']} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.queryByText('Ce champ est requis')).not.toBeInTheDocument();
    });
  });

  describe('email rule', () => {
    test('shows error for invalid email after blur', () => {
      render(<ControlledInput initialValue="notanemail" validation={['email']} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.getByText('Email invalide')).toBeInTheDocument();
    });

    test('no error for valid email', () => {
      render(<ControlledInput initialValue="user@example.com" validation={['email']} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.queryByText('Email invalide')).not.toBeInTheDocument();
    });
  });

  describe('password rule', () => {
    test('shows error when password is shorter than 8 characters', () => {
      render(<ControlledInput initialValue="abc1" validation={['password']} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.getByText('Minimum 8 caractères')).toBeInTheDocument();
    });

    test('shows error when password has no digit', () => {
      render(<ControlledInput initialValue="abcdefgh" validation={['password']} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.getByText('Doit contenir un chiffre')).toBeInTheDocument();
    });

    test('shows error when password has no letter', () => {
      render(<ControlledInput initialValue="12345678" validation={['password']} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.getByText('Doit contenir une lettre')).toBeInTheDocument();
    });

    test('no error for valid password', () => {
      render(<ControlledInput initialValue="Secure99" validation={['password']} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.queryByText(/Minimum|lettre|chiffre/)).not.toBeInTheDocument();
    });
  });

  describe('minLength rule', () => {
    test('shows error when value is too short', () => {
      render(
        <ControlledInput
          initialValue="ab"
          validation={[{ type: 'minLength', value: 5 }]}
        />
      );
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.getByText('Minimum 5 caractères')).toBeInTheDocument();
    });

    test('no error when value meets minimum length', () => {
      render(
        <ControlledInput
          initialValue="abcde"
          validation={[{ type: 'minLength', value: 5 }]}
        />
      );
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.queryByText('Minimum 5 caractères')).not.toBeInTheDocument();
    });
  });

  describe('maxLength rule', () => {
    test('shows error when value exceeds maximum length', () => {
      render(
        <ControlledInput
          initialValue="abcdefgh"
          validation={[{ type: 'maxLength', value: 5 }]}
        />
      );
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.getByText('Maximum 5 caractères')).toBeInTheDocument();
    });

    test('no error when value is within maximum length', () => {
      render(
        <ControlledInput
          initialValue="abc"
          validation={[{ type: 'maxLength', value: 5 }]}
        />
      );
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.queryByText('Maximum 5 caractères')).not.toBeInTheDocument();
    });
  });

  describe('match rule', () => {
    test('shows error when value does not match', () => {
      render(
        <ControlledInput
          initialValue="abc"
          validation={[{ type: 'match', value: 'xyz', fieldName: 'mot de passe' }]}
        />
      );
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.getByText('Doit correspondre à mot de passe')).toBeInTheDocument();
    });

    test('no error when value matches', () => {
      render(
        <ControlledInput
          initialValue="abc"
          validation={[{ type: 'match', value: 'abc', fieldName: 'mot de passe' }]}
        />
      );
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.queryByText(/Doit correspondre/)).not.toBeInTheDocument();
    });
  });

  describe('url rule', () => {
    test('shows error for invalid URL', () => {
      render(<ControlledInput initialValue="not-a-url" validation={['url']} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.getByText('URL invalide')).toBeInTheDocument();
    });

    test('no error for valid URL', () => {
      render(
        <ControlledInput initialValue="https://example.com" validation={['url']} />
      );
      fireEvent.blur(screen.getByRole('textbox'));
      expect(screen.queryByText('URL invalide')).not.toBeInTheDocument();
    });
  });

  describe('onValidationChange callback', () => {
    test('is called with (name, false) when value is invalid', () => {
      const onValidationChange = jest.fn();
      render(
        <ControlledInput
          name="email"
          initialValue="bad"
          validation={['email']}
          onValidationChange={onValidationChange}
        />
      );
      fireEvent.blur(screen.getByRole('textbox'));
      expect(onValidationChange).toHaveBeenCalledWith('email', false);
    });

    test('is called with (name, true) when value is valid', () => {
      const onValidationChange = jest.fn();
      render(
        <ControlledInput
          name="email"
          initialValue="user@example.com"
          validation={['email']}
          onValidationChange={onValidationChange}
        />
      );
      fireEvent.blur(screen.getByRole('textbox'));
      expect(onValidationChange).toHaveBeenCalledWith('email', true);
    });
  });

  describe('character counter', () => {
    test('shows counter when showCounter and maxLength are set', () => {
      render(
        <ControlledInput initialValue="hello" showCounter maxLength={20} />
      );
      expect(screen.getByText('5/20')).toBeInTheDocument();
    });
  });
});
