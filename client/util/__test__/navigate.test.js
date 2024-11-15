
import { addGlobalParamsToQuery, closeSidebar, getGlobalParams, getScreenStackForUrl, gotoInstance, gotoInstanceScreen, makeQueryForParams, openSidebar, pushSubscreen, removeInvisibleParentsFromScreenStack, replaceInstance, UNSAFE_setGlobalUrlWatcher } from '../navigate';
import { getParamsWithSuffix } from '../navigate';
// import * as urlMod from '../../platform-specific/url';

afterEach(() => {
    jest.restoreAllMocks();
});

test('getGlobalParams', () => {
    const url = "https://www.example.com?foo=bar&baz=qux&bla_g=blu";
    const result = getGlobalParams(url);
    expect(result).toEqual({bla: 'blu'});  
})

test('getParamsWithSuffix', () => {
    const urlParams = new URLSearchParams('foo=bar&baz=qux&bla_g=blu');
    const result = getParamsWithSuffix(urlParams, '_g');
    expect(result).toEqual({bla: 'blu'});
})

test('closeSidebar and openSidebar', () => {
    Object.defineProperty(window, 'parent', {
        value: {
            postMessage: jest.fn(),
        },
        writable: true,
    });

    closeSidebar();
    expect(window.parent.postMessage).toHaveBeenCalledWith('psi-close-sidebar', '*');

    openSidebar();
    expect(window.parent.postMessage).toHaveBeenCalledWith('psi-open-sidebar', '*');
});

test('makeQueryForParams', () => {
    const index = 0;
    const params = {foo: 'bar', baz: 'qux'};
    const query = makeQueryForParams(index, params);
    expect(query.toString()).toEqual('foo=bar&baz=qux');
});

test('addGlobalParamsToQuery', () => {
    const globalParams = {bla: 'blu'};
    const query = new URLSearchParams();
    addGlobalParamsToQuery(globalParams, query);
    expect(query.toString()).toEqual('bla_g=blu');
})

test('addGlobalParamsToQuery with null globalParams', () => {
    const query = new URLSearchParams();
    addGlobalParamsToQuery(null, query);
    expect(query.toString()).toEqual('');
})

test('getGlobalParams', () => {
    const url = 'https://www.example.com?foo=bar&baz=qux&bla_g=blu';
    const result = getGlobalParams(url);
    expect(result).toEqual({bla: 'blu'});
})

describe('navigation', () => {
    Object.defineProperty(window, 'location', {
        value: {
            pathname: '/silo/struct/inst',
            search: '',
            href: 'https://www.example.com/silo/struct/inst',
        },
        writable: true,
    });

    const watcher = jest.fn();
    UNSAFE_setGlobalUrlWatcher(watcher);

    test('pushSubscreen not teaser', () => {    
        pushSubscreen('screen', {foo: 'bar'});
        const url = 'https://www.example.com/silo/struct/inst/screen?foo1=bar';
        expect(watcher).toHaveBeenCalledWith(url);
    })
    
    test('gotoInstance', () => {
        gotoInstance({structureKey: 'newstruct', instanceKey: 'newinst', params: {foo: 'bar'}});
        const url = 'https://www.example.com/silo/newstruct/newinst?foo=bar';
        expect(watcher).toHaveBeenCalledWith(url);
    })

    test('gotoInstanceScreen', () => {
        gotoInstanceScreen({structureKey: 'newstruct', instanceKey: 'newinst', 
            screenKey: 'newscreen', params: {foo: 'bar'}
        });
        const url = 'https://www.example.com/silo/newstruct/newinst/newscreen?foo1=bar';
        expect(watcher).toHaveBeenCalledWith(url);
    });

    test('replaceInstance', () => {
        const url = 'https://www.example.com/silo/newstruct/newinst';
        replaceInstance({structureKey: 'newstruct', instanceKey: 'newinst'});
        expect(watcher).toHaveBeenCalledWith(url);
    });
})

test('removeInvisibleParentsFromScreenStack', () => {
    const screenStack = [
        {screenKey: 'teaser'},
        {screenKey: 'screen1'},
        {screenKey: 'screen2'},
    ];
    const newStack = removeInvisibleParentsFromScreenStack(screenStack);
    expect(newStack).toEqual([{screenKey: 'screen1'}, {screenKey: 'screen2'}]);
});

test('getScreenStackForUrl', () => {
    const url = 'https://www.example.com/silo/struct/inst/screen1/screen2';
    const result = getScreenStackForUrl(url);
    expect(result).toEqual({siloKey: 'silo', structureKey: 'struct', instanceKey: 'inst', 
        screenStack: expect.arrayContaining([])});
});
