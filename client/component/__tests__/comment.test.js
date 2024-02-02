import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { WithFeatures, addObject, getMatchingObject } from "../../util/testutil"
import { Comment } from "../comment";

test('View comment', () => {
    addObject('comment', {key: 'test', from: 'a', text: 'This is a comment'});
    render(<WithFeatures><Comment commentKey='test' /></WithFeatures>);    
})

test('Edit comment', async () => {
    addObject('comment', {key: 'test', from: 'a', text: 'This is a comment'});
    render(<WithFeatures features={{lengthlimit: false}}><Comment commentKey='test' /></WithFeatures>);  
    const comment = screen.getByTestId('test');
    const editButton = within(comment).getByRole('button', {name: 'Edit'});
    fireEvent.click(editButton);
    const input = await screen.findByDisplayValue('This is a comment');
    fireEvent.change(input, {target: {value: 'My edited comment'}});     
    fireEvent.click(screen.getByRole('button', {name: 'Update'})); 
    getMatchingObject('comment', {text: 'My edited comment'});
})

test('Cancel editing', async () => {
    addObject('comment', {key: 'test', from: 'a', text: 'This is a comment'});
    render(<WithFeatures features={{lengthlimit: false}}><Comment commentKey='test' /></WithFeatures>);  
    const comment = screen.getByTestId('test');
    const editButton = within(comment).getByRole('button', {name: 'Edit'});
    fireEvent.click(editButton);
    const input = await screen.findByDisplayValue('This is a comment');
    fireEvent.change(input, {target: {value: 'My edited comment'}});     
    fireEvent.click(screen.getByRole('button', {name: 'Cancel'})); 
    getMatchingObject('comment', {text: 'This is a comment'});
})
