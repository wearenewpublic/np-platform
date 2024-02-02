import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Pressable, Text } from 'react-native';
import '@testing-library/jest-native/extend-expect';


function MyButton ({onPress, title}) {
  return <Pressable role='button' onPress={onPress}>
    <Text>{title}</Text>
  </Pressable>
};

test('button press', () => {
    const onPress = jest.fn();
    render(<MyButton onPress={onPress} title="Press Me" />);

    fireEvent.click(screen.getByText('Press Me'));
    expect(onPress).toHaveBeenCalled();
});

test('press using role and text', () => {
    const onPress = jest.fn();
    render(<MyButton onPress={onPress} title="Press Me" />);
    
    fireEvent.click(screen.getByRole('button', {name: 'Press Me'}));
    expect(onPress).toHaveBeenCalled();
})

function MyAsyncButton() {
    const [title, setTitle] = React.useState('Hello');
    async function onPress() {
        setTitle('World');
    }
    return <Pressable testID='foo' role='button' onPress={onPress}><Text>{title}</Text></Pressable>
}

test('async button press', async () => {
    render(<MyAsyncButton />);
    fireEvent.click(screen.getByText('Hello'));
    await screen.findByText('World');
})

test('async press using testID', async () => {
    render(<MyAsyncButton />);
    fireEvent.click(screen.getByTestId('foo'));
    await screen.findByText('World');
})

