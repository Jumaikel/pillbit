import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button component', () => {
  it('renders the label correctly', () => {
    render(<Button label="Click Me" onPress={() => {}} />);
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    render(<Button label="Submit" onPress={onPressMock} />);
    
    fireEvent.press(screen.getByRole('button', { name: 'Submit' }));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    render(<Button label="Submit" onPress={onPressMock} disabled />);
    
    fireEvent.press(screen.getByRole('button', { name: 'Submit' }));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows loading indicator and disables press when loading is true', () => {
    const onPressMock = jest.fn();
    render(
      <Button label="Submit" onPress={onPressMock} loading />
    );
    
    expect(screen.getByLabelText('Loading')).toBeTruthy();
    expect(screen.queryByText('Submit')).toBeNull();

    fireEvent.press(screen.getByLabelText('Loading'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
