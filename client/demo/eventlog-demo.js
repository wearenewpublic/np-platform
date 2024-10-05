import { StructureDemo } from "../util/instance"
import { personaA } from "../util/testpersonas"
import { CLICK } from "../system/demo"
import { EventLogScreen, EventTypesScreen, SessionListScreen } from "../structure/eventlog"
import { expandDataList } from "../util/datastore"

export const EventlogDemoFeature = {
    key: 'demo_eventlog',
    name: 'Eventlog Demo',
    config: {
        componentSections: [
            {label: 'Internal Tools', key: 'internal', pages: [
                {
                    label: 'Event Log', key: 'eventlog', 
                    storySets: eventLogStorySets
                },
            ]}
        ],
        structureSections: [
            {label: 'Internal Tools', key: 'internal', pages: [
                {label: 'Event Log', key: 'eventlog', screen: EventLogDemoScreen},
            ]}
        ]
    }
}

const events = [
    {eventType: 'login-success', sessionKey: '1', userName: 'Alice Adams', time: 1000, key: 'a'},
    {eventType: 'reply-start', sessionKey: '1', userName: 'Alice Adams', time: 2000, key: 'b'},
]

const sessions = [
    {
        key: '1', siloKey: 'demo', userName: 'Alice Adams', userPhoto: personaA.photoUrl,
        startTime: 10, endTime: 1000, deviceInfo: {
            browserName: 'Chrome', browserVersion: '127.0.1', os: 'MacOS', 
            screenHeight: 1080, screenWidth: 1920
        }
    },
]

const serverCall = {eventlog: {
    getSessions: async () => expandDataList(sessions),
    getSingleSession: async ({sessionKey}) => {
        return sessions.find(session => session.key == sessionKey);
    },
    getEvents: async ({sessionKey, eventType}) => {
        const filteredEvents = events.filter(event => 
            (!sessionKey || event.sessionKey == sessionKey) &&
            (!eventType || event.eventType == eventType)
        );
        return expandDataList(filteredEvents);
    },    
}}

function EventLogDemoScreen() {    
    return <StructureDemo roles={['Analyst']} structureKey='eventlog' serverCall={serverCall} />
}

function eventLogStorySets() {return [
    {
        label: 'Event Log Screen', 
        serverCall,
        roles: ['Analyst'],
        content: <EventLogScreen sessionKey='1' />,
        stories: [{
            label: 'Select Event', actions: [
                CLICK('b'), CLICK('a'), CLICK('b')
            ]}
        ]
    },
    {
        label: 'Session List Screen',
        serverCall, roles: ['Analyst'],
        content: <SessionListScreen />,
    },
    {
        label: 'Session List Screen (Access Denied)',
        serverCall,
        content: <SessionListScreen />,
    },
    {
        label: 'Event types screen',
        roles: ['Analyst'],
        content: <EventTypesScreen />,
    }
]}