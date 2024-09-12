import { render } from "@testing-library/react";
import { WithFeatures } from "../../util/testutil";
import { TopBar } from "../topbar";

test('TopBar Renders', () => {
    render(<WithFeatures><TopBar /></WithFeatures>);
});
