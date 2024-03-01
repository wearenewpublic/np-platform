import { lookupFromIndex, makeIndex } from "../datastore";

const data = [
    {key: 1, from: 'a', text: 'This is a comment'},
    {key: 2, from: 'a', text: 'This is another comment'},
    {key: 3, from: 'b', replyTo: 'a', text: 'This is a reply'},
    {key: 4, from: 'b', replyTo: 'c', text: 'This is a reply to a reply'},
];


test('makeIndex - one key', () => {
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

test('makeIndex - two keys', () => {
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

test('lookupFromIndex - one key', () => {
    const index = makeIndex(['from'], data);
    const result = lookupFromIndex(['from'], index, {from: 'a'});
    expect(result).toEqual([
        {key: 1, from: 'a', text: 'This is a comment'},
        {key: 2, from: 'a', text: 'This is another comment'},    
    ]);
});

test('lookupFromIndex - two keys', () => {
    const index = makeIndex(['from', 'replyTo'], data);
    const result = lookupFromIndex(['from', 'replyTo'], index, {from: 'b', replyTo: 'c'});
    expect(result).toEqual([
        {key: 4, from: 'b', replyTo: 'c', text: 'This is a reply to a reply'},
    ]);
});

