import { fireEvent, render, screen } from "@testing-library/react";
import { TestInstance } from "../../util/testutil";

jest.mock("../../util/navigate");

test('Cat is blocked', async () => {
    render(<TestInstance features={{demomoderation: true}} 
        structureKey='simplecomments' screenKey='composer'/>);
    const text = screen.getByRole('textbox');
    fireEvent.change(text, {target: {value: 'I love my Cat'}});
    fireEvent.click(await screen.findByRole('button', {name: 'Post'}));
 
    await screen.findByText('Your post contains a bad word:');
});

