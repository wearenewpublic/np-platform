import { render, screen } from "@testing-library/react";
import { TestInstance } from "../../util/testutil";

test('Teaser', () => {
    render(<TestInstance features={{basicteaser: true}} structureKey='simplecomments' screenKey='teaser' />);
    screen.getByText('Join the Conversation');
})
