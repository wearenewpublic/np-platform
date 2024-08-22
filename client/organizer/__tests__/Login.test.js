import { act, fireEvent, render, screen } from "@testing-library/react";
import { LoginScreen } from "../Login";
import { signInWithGoogle, signInWithPopup } from "../../util/firebase";
import { WithEnv } from "../../util/testutil";
import { Datastore } from "../../util/datastore";
import { default_fbUser } from "../../component/demo";

jest.mock("../../util/navigate");

test('Login', async () => {
    signInWithGoogle.mockResolvedValue({user: {uid: 'testuser'}});
    render(<Datastore firebaseUser={default_fbUser}><LoginScreen /></Datastore>);
    const googleButton = screen.getByRole('button', {name: 'Continue with Google'});
    await act(async () => {
        await fireEvent.click(googleButton);
    });
    expect(signInWithGoogle).toHaveBeenCalled(); 
});

test('Login with Action', () => {
    render(<WithEnv><LoginScreen action='ask a question' /></WithEnv>);
    screen.getByText('Log in to ask a question');
})
