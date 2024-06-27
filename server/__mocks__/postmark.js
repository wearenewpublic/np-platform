


class ServerClientMock {
    constructor(apiToken) {
      this.apiToken = apiToken;
    }
  
    sendEmail(emailDetails) {
      return Promise.resolve({
        To: emailDetails.To,
        SubmittedAt: new Date().toISOString(),
        MessageID: 'mocked-message-id',
        ErrorCode: 0,
        Message: 'OK'
      });
    }
}
  
module.exports = {
    ServerClient: ServerClientMock
};


