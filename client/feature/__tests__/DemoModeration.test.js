import { fireEvent, getByText, render, screen, within } from "@testing-library/react";
import { TestInstance, addObject, getMatchingObject, setFeatures } from "../../util/testutil";
import { goBack } from "../../util/navigate";

jest.mock("../../util/navigate");

test('Cat is blocked', async () => {
    setFeatures({demomoderation: true});
    render(<TestInstance structureKey='simplecomments' screenKey='composer'/>);
    const text = screen.getByRole('textbox');
    fireEvent.change(text, {target: {value: 'I love my Cat'}});
    fireEvent.click(await screen.findByRole('button', {name: 'Post'}));
 
    await screen.findByText('Your post contains a bad word:');
});
