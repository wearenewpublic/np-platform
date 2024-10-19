

var global_lastEmailDetails = null;

class ServerClientMock {
    constructor(apiToken) {
        this.apiToken = apiToken;
    }

    sendEmail(emailDetails) {
        global_lastEmailDetails = emailDetails;
        return Promise.resolve({
            To: emailDetails.To,
            SubmittedAt: new Date().toISOString(),
            MessageID: 'mocked-message-id',
            ErrorCode: 0,
            Message: 'OK'
        });
    }
}

function getLastEmailSent() {
    return global_lastEmailDetails;
}

module.exports = {
    ServerClient: ServerClientMock,
    getLastEmailSent
}
