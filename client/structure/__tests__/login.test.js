import { act, fireEvent, render, screen } from "@testing-library/react";
import { signInWithGoogle, firebaseWriteAsync, signInWithTokenAsync } from "../../util/firebase";
import { WithEnv } from "../../util/testutil";
import { LoginScreen, TokenRedirectScreen } from "../login";
import { default_fbUser } from "../../util/testpersonas";

describe('Login', () => {

    test('Sign in with Google', async () => {
        signInWithGoogle.mockResolvedValue({user: {uid: 'testuser'}});
        render(<WithEnv personaKey={null} firebaseUser={default_fbUser}><LoginScreen /></WithEnv>);
        const googleButton = screen.getByRole('button', {name: 'Continue with Google'});
        await act(async () => {
            await fireEvent.click(googleButton);
        });
        expect(signInWithGoogle).toHaveBeenCalled(); 
    })

    test('User has setup profile', async () => {
        const goBack = jest.fn();
        firebaseWriteAsync([
            'silo', 'test', 'structure', 'profile', 
            'instance', 'a', 'global', 'preview'], {
            name: 'Alice Admin'
        });
        await act(async () => {
            render(<WithEnv goBack={goBack} personaKey='a'><LoginScreen /></WithEnv>);
        });
        expect(goBack).toHaveBeenCalled();
    })

    test('Login with Action', () => {
        render(<WithEnv personaKey={null}><LoginScreen action='ask a question' /></WithEnv>);
        screen.getByText('Join the conversation to ask a question');
    })
});

test('Token Redirect', async () => {
    const closeWindow = jest.fn();
    await act(async () => {
        render(<WithEnv closeWindow={closeWindow}><TokenRedirectScreen token='token' provider='provider' email='email' /></WithEnv>);
    });
    expect(signInWithTokenAsync).toHaveBeenCalledWith('token');
    expect(closeWindow).toHaveBeenCalled();
});
