import { render } from "@testing-library/react";
import { TestInstance, setGlobal } from "../../util/testutil";

test('Profile', async () => {
    setGlobal('name', 'Alice');
    setGlobal('photoUrl', 'url');
    setGlobal('initialized', true);
    render(<TestInstance structureKey='profile' instanceKey='a' />);    
});

