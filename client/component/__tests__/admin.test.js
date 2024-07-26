import React from 'react';
import { render, screen } from "@testing-library/react";
import { UtilityText } from "../text";
import { useIsAdmin } from "../admin";
import { WithEnv } from "../../util/testutil";
import { Datastore } from '../../util/datastore';

function IsAdmin() {
    const isAdmin = useIsAdmin();
    if (isAdmin) {
        return <UtilityText label='Is Admin' />
    } else {
        return <UtilityText label='Not Admin' />
    }
}

test('not admin', () => {    
    render(<Datastore><IsAdmin /></Datastore>);
    screen.getByText('Not Admin');
})

test('is Admin', async () => {    
    render(<Datastore isAdmin><IsAdmin /></Datastore>);
    await screen.findByText('Is Admin');
})
