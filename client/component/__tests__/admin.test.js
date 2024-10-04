import React from 'react';
import { render, screen } from "@testing-library/react";
import { UtilityText } from "../text";
import { makeCapabilityMap, mergeRoles, useIsAdmin } from "../admin";
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

test('mergeRoles', () => {
    const oldRoles = {
        Owner: {allCapabilities: true},
        Developer: {inherits: ['Peon'], can: ['circus/swallow-swords']},
        Peon: {can: ['peon:grovel']},
    }
    const newRoles = {
        Wizard: {allCapabilities: true},
        Developer: {inherits: ['Farmer'], can: ['circus/juggle']},
        Farmer: {can: ['farm:corn', 'farm:wheat']},
    }
    const mergedRoles = mergeRoles(oldRoles, newRoles);
    expect(mergedRoles).toEqual({
        Owner: {allCapabilities: true},
        Developer: {inherits: ['Peon', 'Farmer'], can: ['circus/swallow-swords', 'circus/juggle']},
        Peon: {can: ['peon:grovel']},
        Wizard: {allCapabilities: true},
        Farmer: {can: ['farm:corn', 'farm:wheat']},
    });

});

test('extendRoles', async () => {

})