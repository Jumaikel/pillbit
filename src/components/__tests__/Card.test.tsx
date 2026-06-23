import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '../Card';

describe('Card component', () => {
  it('renders children correctly in static mode', () => {
    render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );

    expect(screen.getByText('Card Content')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull(); // Should not be pressable
  });

  it('renders as a pressable card when onPress is provided', () => {
    const onPressMock = jest.fn();
    render(
      <Card onPress={onPressMock} accessibilityLabel="Tap card">
        <Text>Interactive Content</Text>
      </Card>
    );

    expect(screen.getByText('Interactive Content')).toBeTruthy();
    
    const cardButton = screen.getByRole('button', { name: 'Tap card' });
    expect(cardButton).toBeTruthy();

    fireEvent.press(cardButton);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
