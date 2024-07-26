import { act, findByRole, fireEvent, render, screen, within } from "@testing-library/react";
import { TestInstance, getMatchingObject } from "../../util/testutil";
import { goBack, pushSubscreen } from "../../util/navigate";
import React from "react";

jest.mock("../../util/navigate");

test('Empty', () => {
    render(<TestInstance structureKey='simplecomments' />);
});

test('Comment and Reply', () => {
    const collections = {comment: [
        {key: 'test', from: 'b', text: 'This is a comment'},
    ]}

    render(<TestInstance collections={collections} structureKey='simplecomments' />);    
    screen.getByText('This is a comment');    
});


test('Composer opens', () => {
    render(<TestInstance structureKey='simplecomments' />);
    screen.getByText('Share your thoughts...').click();
    expect(pushSubscreen).toHaveBeenCalledWith('composer', {about: null});
});

test('Composer saves comment', async () => {
    const dataRef = React.createRef();
    render(<TestInstance dataRef={dataRef} structureKey='simplecomments' screenKey='composer' />);
    const input = screen.getByPlaceholderText('Share your thoughts...');
    fireEvent.change(input, {target: {value: 'This is a test comment'}});
    
    await act(async () => {
       fireEvent.click(await findByRole(document.body, 'button', {name: 'Post'}));
    });
    expect(goBack).toHaveBeenCalled();

    getMatchingObject(dataRef, 'comment', {text: 'This is a test comment'});
})

test('Comment renders', async () => {
    const collections = {comment: [
        {key: 'test', from: 'a', text: 'This is a comment'}
    ]}
    render(<TestInstance collections={collections} structureKey='simplecomments' />);
    screen.getByText('This is a comment');    
})

test('Reply to a comment', async () => {
    const dataRef = React.createRef();
    const collections = {comment: [
        {key: 'test', from: 'b', text: 'This is a comment'}
    ]}
    render(<TestInstance dataRef={dataRef} collections={collections} structureKey='simplecomments' />);
    const comment = screen.getByTestId('test');
    const replyButton = within(comment).getByRole('button', {name: 'Reply'});
    fireEvent.click(replyButton);
    const input = screen.getByPlaceholderText('Reply to Bob...');
    fireEvent.change(input, {target: {value: 'My reply'}});

    await act(() => {
        fireEvent.click(screen.getByRole('button', {name: 'Post'}));
    })
    getMatchingObject(dataRef, 'comment', {text: 'My reply', replyTo: 'test'});
    screen.getByText('My reply');
})

test('Teaser', async () => {
    const collections = {comment: [
        {key: 'test', from: 'a', text: 'This is a comment'}
    ]}
    render(<TestInstance collections={collections} structureKey='simplecomments' screenKey='teaser' />);
    screen.getByText('No teaser screen configured');    
})
