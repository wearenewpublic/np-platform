import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { WithConfig, WithFeatures, WithMiniFeatures, addObject, getMatchingObject } from "../../util/testutil"
import { ActionEdit, Comment } from "../comment";
import { pushSubscreen } from "../../util/navigate";
import { Datastore } from "../../util/datastore";
import React from "react";

jest.mock("../../util/navigate");

test('View comment', () => {
    const collections = {comment: [
        {key: 'test', from: 'a', text: 'This is a comment'},
    ]}

    render(<Datastore collections={collections}><Comment commentKey='test' /></Datastore>);    
    screen.getByText('This is a comment');
})

test('Edit top level comment', async () => {
    const collections = {comment: [
        {key: 'test', from: 'a', text: 'This is a comment'},
    ]}
    const config = {commentRightActions: [ActionEdit]}

    render(<Datastore collections={collections} config={config}><Comment commentKey='test' /></Datastore>);

    const comment = screen.getByTestId('test');
    const editButton = within(comment).getByRole('button', {name: 'Edit'});
    fireEvent.click(editButton);
    expect(pushSubscreen).toHaveBeenCalledWith('composer', {commentKey: 'test'});
})

test('Edit Reply', async () => {
    const dataRef = React.createRef();
    const collections = {comment: [
        {key: 'test', from: 'b', text: 'This is a comment'},
        {key: 'reply', from: 'a', replyTo: 'test', text: 'This is a reply'},
    ]}
    const config = {commentRightActions: [ActionEdit]}

    render(<Datastore ref={dataRef} collections={collections} config={config}><Comment commentKey='reply' /></Datastore>);
    const comment = screen.getByTestId('reply');
    const editButton = within(comment).getByRole('button', {name: 'Edit'});
    fireEvent.click(editButton);

    const input = await screen.findByDisplayValue('This is a reply');
    fireEvent.change(input, {target: {value: 'My edited reply'}});     
    await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: 'Update'})); 
    });
    getMatchingObject(dataRef, 'comment', {text: 'My edited reply'});
})

test('Cancel editing reply', async () => {
    const dataRef = React.createRef();
    const collections = {
        comment: [
            {key: 'test', from: 'b', text: 'This is a comment'},
            {key: 'reply', from: 'a', replyTo: 'test', text: 'This is a reply'},
        ]
    }
    const config = {commentRightActions: [ActionEdit]}

    render(<Datastore ref={dataRef} collections={collections} config={config}><Comment commentKey='reply' /></Datastore>);  
    const comment = screen.getByTestId('reply');
    const editButton = within(comment).getByRole('button', {name: 'Edit'});
    fireEvent.click(editButton);
    const input = await screen.findByDisplayValue('This is a reply');
    fireEvent.change(input, {target: {value: 'My edited reply'}});     
    fireEvent.click(screen.getByRole('button', {name: 'Cancel'})); 
    getMatchingObject(dataRef, 'comment', {text: 'This is a comment'});
})
