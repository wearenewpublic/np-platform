import { fireEvent, getByText, render, screen, within } from "@testing-library/react";
import { TestInstance, addObject, getMatchingObject } from "../../util/testutil";

test('Upvote to comment', async () => {
    addObject('comment', {key: 'test', from: 'b', text: 'This is a comment'});
    render(<TestInstance structureKey='simplecomments' />);
    const comment = screen.getByTestId('test');
    const upvoteButton = within(comment).getByRole('button', {name: 'Upvote'});
    fireEvent.click(upvoteButton);
    screen.getByText('Upvoted (1)');
    getMatchingObject('upvote', {comment: 'test'});

    fireEvent.click(upvoteButton);
    screen.getByText('Upvote');
})


