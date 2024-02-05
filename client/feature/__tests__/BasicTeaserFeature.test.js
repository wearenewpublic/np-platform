import { getByText, render, screen } from "@testing-library/react";
import { TestInstance, setFeatures } from "../../util/testutil";

test('Teaser', () => {
    setFeatures({basicteaser: true});
    render(<TestInstance structureKey='simplecomments' screenKey='teaser' />);
    screen.getByText('Join the Conversation');
})
