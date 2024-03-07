const { render,  screen } = require("@testing-library/react");
const { useIsAdmin } = require("../admin");
const { UtilityText } = require("../text");
const { setModulePublicData, WithEnv } = require("../../util/testutil");

function IsAdmin() {
    const isAdmin = useIsAdmin();
    if (isAdmin) {
        return <UtilityText label='Is Admin' />
    } else {
        return <UtilityText label='Not Admin' />
    }
}

test('useIsAdmin', () => {    
    render(<WithEnv><IsAdmin /></WithEnv>);
    screen.getByText('Not Admin');
})

test('useIsAdmin', () => {    
    setModulePublicData({moduleKey: 'admin', data: {adminEmails: 'bob@bob.org, alice@adams.org'}});
    render(<WithEnv><IsAdmin /></WithEnv>);
    screen.getByText('Is Admin');
})
