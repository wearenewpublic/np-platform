import { fireEvent, render, screen, within } from "@testing-library/react";
import { getMatchingObject } from "../../util/testutil";
import { Comment } from "../../component/comment";
import { Datastore } from "../../util/datastore";
import { ActionUpvote } from "../UpvoteFeature";
import React from "react";

test('Upvote to comment', async () => {
    const dataRef = React.createRef();
    const collections = {comment: [
        {key: 'test', from: 'b', text: 'This is a comment'},
    ]}
    const config = {commentActions: [ActionUpvote]}

    render(<Datastore ref={dataRef} collections={collections} config={config}><Comment commentKey='test' /></Datastore>);
    const comment = screen.getByTestId('test');
    const upvoteButton = within(comment).getByLabelText('upvote');
    fireEvent.click(upvoteButton);
    getMatchingObject(dataRef, 'upvote', {comment: 'test'});

    fireEvent.click(upvoteButton);
})


