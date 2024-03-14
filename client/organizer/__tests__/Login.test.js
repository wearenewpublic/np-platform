const { fireEvent, render, screen } = require("@testing-library/react");
const { goBack } = require("../../util/navigate");
const { LoginScreen } = require("../Login");
const { signInWithPopup } = require("../../util/firebase");

jest.mock("../../util/navigate");

test('Login', () => {
    render(<LoginScreen />);
    const googleButton = screen.getByRole('button', {name: 'Continue with Google'});
    fireEvent.click(googleButton);
    expect(signInWithPopup).toHaveBeenCalled(); 
});

test('Login with Action', () => {
    render(<LoginScreen action='ask a question' />);
    screen.getByText('Log in to ask a question');
})
