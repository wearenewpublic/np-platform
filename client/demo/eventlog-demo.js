import { get } from "firebase/database"
import { StructureDemo } from "../util/instance"
import { expandDataList } from "../util/util"
import { personaA } from "../data/personas"
import { UtilityText } from "../component/text"
import { DemoSection } from "../component/demo"
import { Datastore } from "../util/datastore"
import { EventLogScreen, EventTypesScreen, LogEvent, SessionListScreen, SessionPreview } from "../structure/eventlog"

export const EventlogDemoFeature = {
    key: 'demo_eventlog',
    name: 'Eventlog Demo',
    config: {
        componentSections: [
            {label: 'Internal Tools', key: 'internal', pages: [
                {label: 'Event Log', key: 'eventlog', screen: EventLogComponentsScreen},
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
        console.log('getEvents', {sessionKey, eventType});
        const filteredEvents = events.filter(event => 
            (!sessionKey || event.sessionKey == sessionKey) &&
            (!eventType || event.eventType == eventType)
        );
        console.log('filteredEvents', filteredEvents);
        return expandDataList(filteredEvents);
    },    
}}

function EventLogDemoScreen() {    
    return <StructureDemo structureKey='eventlog' serverCall={serverCall} />
}


function EventLogComponentsScreen() {
    return <Datastore serverCall={serverCall} isAdmin>
        <DemoSection label='Session Preview'>
            <SessionPreview session={sessions[0]} />
            <UtilityText label='Session' />
        </DemoSection>

        <DemoSection label='Log Event'>
            <LogEvent event={events[0]} />
            <Datastore sessionData={{'event-selected-key': 'b'}}>
                <LogEvent event={events[1]} />
            </Datastore>
        </DemoSection>

        <DemoSection label='Session List Screen'>
            <SessionListScreen />
        </DemoSection>

        <DemoSection label='Event Log Screen'>
            <EventLogScreen sessionKey='1' />
        </DemoSection>

        <DemoSection label='Event Types Screen'>
            <EventTypesScreen />
        </DemoSection>
    </Datastore>
}

