import { act, fireEvent, render, screen } from "@testing-library/react";
import { signInWithGoogle } from "../../util/firebase";
import { WithEnv } from "../../util/testutil";
import { Datastore } from "../../util/datastore";
import { default_fbUser } from "../../component/demo";
import { LoginScreen } from "../login";

jest.mock("../../util/navigate");

test('Login', async () => {
    signInWithGoogle.mockResolvedValue({user: {uid: 'testuser'}});
    render(<Datastore personaKey={null} firebaseUser={default_fbUser}><LoginScreen /></Datastore>);
    const googleButton = screen.getByRole('button', {name: 'Continue with Google'});
    await act(async () => {
        await fireEvent.click(googleButton);
    });
    expect(signInWithGoogle).toHaveBeenCalled(); 
});

test('Login with Action', () => {
    render(<WithEnv personaKey={null}><LoginScreen action='ask a question' /></WithEnv>);
    screen.getByText('Log in to ask a question');
})
