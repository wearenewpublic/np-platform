
import { act, fireEvent, render, screen } from "@testing-library/react";
import { TestInstance, getMatchingObject } from "../../util/testutil";
import { goBack } from "../../util/navigate";
import React from "react";

jest.mock("../../util/navigate");

test('Compose with Cat', async () => {
    const dataRef = React.createRef();
    render(<TestInstance dataRef={dataRef} features={{demofilter: true}} structureKey='simplecomments' screenKey='composer' />);
    const toggle = screen.getByText('Is Cat');
    fireEvent.click(toggle);
    const text = screen.getByRole('textbox');
    fireEvent.change(text, {target: {value: 'I am a Cat'}});
    await act(async () => {
        fireEvent.click(await screen.findByRole('button', {name: 'Post'}));
    });
    expect(goBack).toHaveBeenCalled();
    getMatchingObject(dataRef, 'comment', {text: 'I am a Cat', isCat: true});
})

test('Filter Cats', async () => {
    const collections = {comment: [
        {key: 'test', from: 'a', text: 'I am a Cat', isCat: true},
        {key: 'test2', from: 'a', text: 'I am a Dog', isCat: false},
    ]}
    render(<TestInstance features={{demofilter: true}} collections={collections} structureKey='simplecomments' />);
    screen.getByText('I am a Cat');
    screen.getByText('I am a Dog');

    const toggle = screen.getByText('Only Cats');
    fireEvent.click(toggle);
    screen.getByText('I am a Cat');
    expect(screen.queryByText('I am a Dog')).toBeNull();

    fireEvent.click(toggle);
    screen.getByText('I am a Dog');
});
