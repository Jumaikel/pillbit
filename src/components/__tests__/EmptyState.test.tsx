import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { EmptyState } from '../EmptyState';

describe('EmptyState component', () => {
  it('renders title and description correctly', () => {
    render(
      <EmptyState title="No items" description="Please add some items" />
    );

    const titleElement = screen.getByRole('header');
    expect(titleElement.props.children).toBe('No items');
    expect(screen.getByText('Please add some items')).toBeTruthy();
  });

  it('renders action button and triggers onPress', () => {
    const onPressMock = jest.fn();
    const action = {
      label: 'Add Item',
      onPress: onPressMock,
    };

    render(
      <EmptyState title="No items" action={action} />
    );

    const button = screen.getByRole('button', { name: 'Add Item' });
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not render description or button if not provided', () => {
    render(
      <EmptyState title="Only Title" />
    );

    expect(screen.queryByRole('button')).toBeNull();
  });
});
