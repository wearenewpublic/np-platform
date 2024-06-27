
import { act, fireEvent, getByText, render, screen, within } from "@testing-library/react";
import { TestInstance, addObject, getMatchingObject, setFeatures } from "../../util/testutil";
import { goBack } from "../../util/navigate";

jest.mock("../../util/navigate");

test('Compose with Cat', async () => {
    setFeatures({demofilter: true});
    render(<TestInstance structureKey='simplecomments' screenKey='composer' />);
    const toggle = screen.getByText('Is Cat');
    fireEvent.click(toggle);
    const text = screen.getByRole('textbox');
    fireEvent.change(text, {target: {value: 'I am a Cat'}});
    await act(async () => {
        fireEvent.click(await screen.findByRole('button', {name: 'Post'}));
    });
    expect(goBack).toHaveBeenCalled();
    getMatchingObject('comment', {text: 'I am a Cat', isCat: true});
})

test('Filter Cats', async () => {
    setFeatures({demofilter: true});
    addObject('comment', {key: 'test', from: 'a', text: 'I am a Cat', isCat: true});
    addObject('comment', {key: 'test2', from: 'a', text: 'I am a Dog', isCat: false});
    render(<TestInstance structureKey='simplecomments' />);
    screen.getByText('I am a Cat');
    screen.getByText('I am a Dog');

    const toggle = screen.getByText('Only Cats');
    fireEvent.click(toggle);
    screen.getByText('I am a Cat');
    expect(screen.queryByText('I am a Dog')).toBeNull();

    fireEvent.click(toggle);
    screen.getByText('I am a Dog');
});