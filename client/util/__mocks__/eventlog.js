
export const useLogEvent = jest.fn();
export const logEventAsync = jest.fn();
export const getLogEventsAsync = jest.fn();
export const setSessionUserAsync = jest.fn();
export const getSessionsAsync = jest.fn();

export var eventTypes = {
    'error': 'An error occurred',
    'login-screen': 'Open the Login Screen',
    'login-request': 'Request to login'
}
