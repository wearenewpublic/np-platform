import { render, screen } from "@testing-library/react";
import { TestInstance, getSharedData, setGlobal } from "../../util/testutil";

test('Profile', async () => {
    setGlobal('initialized', true);
    render(<TestInstance structureKey='profile' instanceKey='a' />);    

    screen.getByText('Alice Adams');
});

