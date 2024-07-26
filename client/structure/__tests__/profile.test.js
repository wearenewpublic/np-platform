import { render, screen } from "@testing-library/react";
import { TestInstance } from "../../util/testutil";

test('Profile', async () => {
    render(<TestInstance globals={{initialized: true}} structureKey='profile' instanceKey='a' />);    

    screen.getByText('Alice Adams');
});

