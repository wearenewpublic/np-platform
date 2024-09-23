import React from 'react';
import { render, screen } from "@testing-library/react";
import { UtilityText } from "../text";
import { makeCapabilityMap, useIsAdmin } from "../admin";
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
    render(<Datastore roles={['Owner']}><IsAdmin /></Datastore>);
    await screen.findByText('Is Admin');
})

test('makeCapabilityMap', async () => {
    const roles = {
        Owner: {allCapabilities: true},
        Developer: {inherits: ['Peon'], can: ['circus/swallow-swords']},
        Peon: {can: ['peon:grovel']},
    }
    const cap_map = makeCapabilityMap(roles);
    expect(cap_map).toEqual({
        Owner: {},
        Developer: {'circus/swallow-swords': true, 'peon:grovel': true},
        Peon: {'peon:grovel': true},
    });
});
