import { fireEvent, render, screen } from "@testing-library/react";
import { LoginScreen } from "../Login";
import { signInWithPopup } from "../../util/firebase";
import { WithEnv } from "../../util/testutil";

jest.mock("../../util/navigate");

test('Login', () => {
    render(<WithEnv><LoginScreen /></WithEnv>);
    const googleButton = screen.getByRole('button', {name: 'Continue with Google'});
    fireEvent.click(googleButton);
    expect(signInWithPopup).toHaveBeenCalled(); 
});

test('Login with Action', () => {
    render(<WithEnv><LoginScreen action='ask a question' /></WithEnv>);
    screen.getByText('Log in to ask a question');
})
