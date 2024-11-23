import { render, act, screen } from "@testing-library/react";
import React from "react";
import { getScreenStackForUrl } from "../navigate";
import { getStructureForKey, ScreenStack } from "../instance";

jest.mock('../../system/servercall');

test('ScreenStack', async () => {
    const url = 'https://psi.newpublic.org/global/componentdemo/demo/page?pageKey1=button';
    const {siloKey, structureKey, instanceKey, screenStack} = getScreenStackForUrl(url);
    const serverCall = {
        admin: {
            getMyRoles: () => ['Owner']
        }
    }
    await act(async () => {
        render(<ScreenStack url={url} siloKey={siloKey} structureKey={structureKey} 
            instanceKey={instanceKey} screenStack={screenStack} props={{serverCall}}
        />)  
    }); 
    screen.getByText('Buttons & Links');
});

test('getStructureForKey null', async () => {
    expect(getStructureForKey(null)).toBe(null);
});

// test('Screenstack with error', async () => {
//     const url = 'https://psi.newpublic.org/global/nostruct/demo/page?pageKey1=button';
//     const {siloKey, structureKey, instanceKey, screenStack} = getScreenStackForUrl(url);
//     const serverCall = {}
//     await expect(async () => {
//         render(<ScreenStack url={url} siloKey={siloKey} structureKey={structureKey} 
//             instanceKey={instanceKey} screenStack={screenStack} props={{serverCall}}
//         />)  
//     }).rejects.toThrow('Structure not found: nostruct');
// })