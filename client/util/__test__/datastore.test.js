import { Datastore, lookupFromIndex, makeIndex } from "../datastore";


const data = [
    {key: 1, from: 'a', text: 'This is a comment'},
    {key: 2, from: 'a', text: 'This is another comment'},
    {key: 3, from: 'b', replyTo: 'a', text: 'This is a reply'},
    {key: 4, from: 'b', replyTo: 'c', text: 'This is a reply to a reply'},
];

describe('makeIndex', () => {

    test('one key', () => {
        const index = makeIndex(['from'], data);
        expect(index).toEqual({
            a: [
                {key: 1, from: 'a', text: 'This is a comment'},
                {key: 2, from: 'a', text: 'This is another comment'},    
            ],
            b: [
                {key: 3, from: 'b', replyTo: 'a', text: 'This is a reply'},
                {key: 4, from: 'b', replyTo: 'c', text: 'This is a reply to a reply'},
            ]
        });
    })

    test('two keys', () => {
        const index2 = makeIndex(['from', 'replyTo'], data);
        expect(index2).toEqual({
            'a-': [
                {key: 1, from: 'a', text: 'This is a comment'},
                {key: 2, from: 'a', text: 'This is another comment'},
            ],
            'b-a': [
                {key: 3, from: 'b', replyTo: 'a', text: 'This is a reply'}
            ],
            'b-c': [
                {key: 4, from: 'b', replyTo: 'c', text: 'This is a reply to a reply'}
            ]
        });    
    })
});

describe('lookupFromIndex', () => {

    test('one key', () => {
        const index = makeIndex(['from'], data);
        const result = lookupFromIndex(['from'], index, {from: 'a'});
        expect(result).toEqual([
            {key: 1, from: 'a', text: 'This is a comment'},
            {key: 2, from: 'a', text: 'This is another comment'},    
        ]);
    });

    test('two keys', () => {
        const index = makeIndex(['from', 'replyTo'], data);
        const result = lookupFromIndex(['from', 'replyTo'], index, {from: 'b', replyTo: 'c'});
        expect(result).toEqual([
            {key: 4, from: 'b', replyTo: 'c', text: 'This is a reply to a reply'},
        ]);
    });
});

const serverCall = {
    admin: {
        getMyRoles: () => ['Owner'],
    },
    profile: {
        linkInstance: () => {},
    },
    derivedviews: {
        runTriggers: () => {},
    }
}

function makeTestDatastore() {
    return new Datastore({
        siloKey: 'test', structureKey: 'test', instanceKey: 'test', 
        isLive: true,
        serverCall})
}


describe('Datastore', () => {
    test('mount', async () => {
        const datastore = makeTestDatastore();
        datastore.componentDidMount();

        datastore.props.instanceKey = 'new';
        datastore.componentDidUpdate({siloKey: 'test', structureKey: 'test', instanceKey: 'test'});
        // await flushPromises();
    })

    test('addObject', async () => {
        const datastore = makeTestDatastore();
        datastore.componentDidMount();

        await datastore.addObject('comment', {text: 'This is a comment'});
        expect(datastore.getObject('comment', 1).text).toEqual('This is a comment');
    });

    test('modifyObject', async () => {
        const datastore = makeTestDatastore();
        
        await datastore.addObjectWithKey('comment', 1, {text: 'This is a comment'});
        await datastore.modifyObject('comment', 1, comment => ({...comment, text: 'New text'}));
        expect(datastore.getObject('comment', 1).text).toEqual('New text');
    });
})