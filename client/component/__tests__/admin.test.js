import React from 'react';
import { render, screen } from "@testing-library/react";
import { UtilityText } from "../text";
import { useIsAdmin } from "../admin";
import { WithEnv } from "../../util/testutil";

function IsAdmin() {
    const isAdmin = useIsAdmin();
    if (isAdmin) {
        return <UtilityText label='Is Admin' />
    } else {
        return <UtilityText label='Not Admin' />
    }
}

test('not admin', () => {    
    render(<WithEnv><IsAdmin /></WithEnv>);
    screen.getByText('Not Admin');
})

test('is Admin', async () => {    
    render(<WithEnv isAdmin><IsAdmin /></WithEnv>);
    await screen.findByText('Is Admin');
})
