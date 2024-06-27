import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { WithFeatures, addObject, getMatchingObject } from "../../util/testutil"
import { Comment } from "../comment";
import { pushSubscreen } from "../../util/navigate";

jest.mock("../../util/navigate");

test('View comment', () => {
    addObject('comment', {key: 'test', from: 'a', text: 'This is a comment'});

    render(<WithFeatures><Comment commentKey='test' /></WithFeatures>);    

    screen.getByText('This is a comment');
})

test('Edit top level comment', async () => {
    addObject('comment', {key: 'test', from: 'a', text: 'This is a comment'});
    render(<WithFeatures features={{lengthlimit: false}}><Comment commentKey='test' /></WithFeatures>);  
    const comment = screen.getByTestId('test');
    const editButton = within(comment).getByRole('button', {name: 'Edit'});
    fireEvent.click(editButton);
    expect(pushSubscreen).toHaveBeenCalledWith('composer', {commentKey: 'test'});
})

test('Edit Reply', async () => {
    addObject('comment', {key: 'test', from: 'b', text: 'This is a comment'});
    addObject('comment', {key: 'reply', from: 'a', replyTo: 'test', text: 'This is a reply'});
    render(<WithFeatures features={{lengthlimit: false}}><Comment commentKey='reply' /></WithFeatures>);  
    const comment = screen.getByTestId('reply');
    const editButton = within(comment).getByRole('button', {name: 'Edit'});
    fireEvent.click(editButton);

    const input = await screen.findByDisplayValue('This is a reply');
    fireEvent.change(input, {target: {value: 'My edited reply'}});     
    await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: 'Update'})); 
    });
    getMatchingObject('comment', {text: 'My edited reply'});
})

test('Cancel editing reply', async () => {
    addObject('comment', {key: 'test', from: 'b', text: 'This is a comment'});
    addObject('comment', {key: 'reply', from: 'a', replyTo: 'test', text: 'This is a reply'});
    render(<WithFeatures features={{lengthlimit: false}}><Comment commentKey='reply' /></WithFeatures>);  
    const comment = screen.getByTestId('reply');
    const editButton = within(comment).getByRole('button', {name: 'Edit'});
    fireEvent.click(editButton);
    const input = await screen.findByDisplayValue('This is a reply');
    fireEvent.change(input, {target: {value: 'My edited reply'}});     
    fireEvent.click(screen.getByRole('button', {name: 'Cancel'})); 
    getMatchingObject('comment', {text: 'This is a comment'});
})
