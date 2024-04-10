import { findByRole, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { TestInstance, addObject, checkPressable, getMatchingObject, getObject, getSharedData, isPressable, objectExists, resetSharedData } from "../../util/testutil";
import { goBack, pushSubscreen } from "../../util/navigate";
import { SharedData } from "../../util/shareddata";

jest.mock("../../util/navigate");

test('Empty', () => {
    render(<TestInstance structureKey='simplecomments' />);
});

test('Comment and Reply', () => {
    addObject('comment', {key: 'test', from: 'a', text: 'This is a comment'});
    render(<TestInstance structureKey='simplecomments' />);
    
    screen.getByText('This is a comment');    
});


test('Composer opens', () => {
    render(<TestInstance structureKey='simplecomments' />);
    screen.getByText('Share your thoughts...').click();
    expect(pushSubscreen).toHaveBeenCalledWith('composer', {about: null});
});

test('Composer saves comment', async () => {
    render(<TestInstance structureKey='simplecomments' screenKey='composer' />);
    const input = screen.getByPlaceholderText('Share your thoughts...');
    fireEvent.change(input, {target: {value: 'This is a test comment'}});
    fireEvent.click(await findByRole(document.body, 'button', {name: 'Post'}));
    expect(goBack).toHaveBeenCalled();

    getMatchingObject('comment', {text: 'This is a test comment'});
})

test('Comment renders', async () => {
    addObject('comment', {key: 'test', from: 'a', text: 'This is a comment'});
    render(<TestInstance structureKey='simplecomments' />);
    screen.getByText('This is a comment');    
})

test('Reply to a comment', async () => {
    addObject('comment', {key: 'test', from: 'b', text: 'This is a comment'});
    render(<TestInstance structureKey='simplecomments' />);
    const comment = screen.getByTestId('test');
    const replyButton = within(comment).getByRole('button', {name: 'Reply'});
    fireEvent.click(replyButton);
    const input = screen.getByPlaceholderText('Reply to Bob...');
    fireEvent.change(input, {target: {value: 'My reply'}});
    fireEvent.click(screen.getByRole('button', {name: 'Post'}));
    getMatchingObject('comment', {text: 'My reply', replyTo: 'test'});
    screen.getByText('My reply');
})

test('Teaser', async () => {
    addObject('comment', {key: 'test', from: 'a', text: 'This is a comment'});
    render(<TestInstance structureKey='simplecomments' screenKey='teaser' />);
    screen.getByText('No teaser screen configured');    
})
