import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input component', () => {
  it('renders the label and placeholder correctly', () => {
    render(
      <Input label="Name" placeholder="Enter name" />
    );

    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter name')).toBeTruthy();
  });

  it('renders error message when provided', () => {
    render(
      <Input label="Email" errorMessage="Invalid email address" />
    );

    const errorElement = screen.getByText('Invalid email address');
    expect(errorElement).toBeTruthy();
    
    // Check accessibility role
    const alert = screen.getByRole('alert');
    expect(alert).toBeTruthy();
  });

  it('reflects disabled state accurately', () => {
    render(<Input label="Disabled Field" disabled />);
    const input = screen.getByLabelText('Disabled Field');
    
    expect(input.props.editable).toBe(false);
    expect(input.props.accessibilityState?.disabled).toBe(true);
  });
});
