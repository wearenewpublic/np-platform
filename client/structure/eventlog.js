import { useIsAdmin } from "../component/admin";
import { ConversationScreen, HorizBox, HoverSelectBox, HoverView, Pad, PadBox, Separator, WindowTitle } from "../component/basics"
import { CTAButton, TextButton } from "../component/button";
import { formatDate } from "../component/date";
import { Byline } from "../component/people";
import { RichText } from "../component/richtext";
import { Heading, Paragraph, UtilityText } from "../component/text"
import { useDatastore, useSessionData } from "../util/datastore";
import { eventTypes, getLogEventsAsync, getSessionsAsync } from "../util/eventlog";
import { useState, useEffect } from "react";
import { View } from 'react-native';
import { gotoInstance, pushSubscreen } from "../util/navigate";
import { colorTextGrey } from "../component/color";

// TODO: Make this code less hideous. Written in haste before going on vacation.


export const EventLogStructure = {
    key: 'eventlog',
    name: 'Event Log',
    screen: HomeScreen,
    subscreens: {
        eventlog: EventLogScreen,
        sessions: SessionListScreen,
        events: EventListScreen,
    }
}

function HomeScreen() {
    return <ConversationScreen>
        <WindowTitle title='Log Dashboard' />
        <Pad />
        <Heading level={1} label='Logs Dashboard' />
        <Pad />
        <CTAButton label='Sessions' onPress={() => pushSubscreen('sessions')}/>
        <Pad />
        <CTAButton label='Events' onPress={() => pushSubscreen('events')} />
    </ConversationScreen>
}

function EventListScreen() {
    return <ConversationScreen>
        <WindowTitle title='Events' />
        <Pad />
        <Heading level={1} label='Events' />
        <Pad />
        {Object.keys(eventTypes).map((eventType, i) => <PadBox vert={4} key={i}><EventType eventType={eventType} /></PadBox>)}
    </ConversationScreen>
}

function EventType({eventType}) {
    const [hover, setHover] = useState(false);
    return <HoverView setHover={setHover} onPress={() => pushSubscreen('eventlog', {eventType})}>
        <UtilityText strong label={eventType} underline={hover} />
        <UtilityText color={colorTextGrey} label={eventTypes[eventType]} />
    </HoverView>
}

function SessionListScreen() {
    const [sessions, setSessions] = useState([]);
    const [limit, setLimit] = useState(100);

    async function onRefresh() {
        const sessions = await getSessionsAsync();
        console.log('Sessions', sessions);
        setSessions(sessions);
    }

    useEffect(() => {
        onRefresh();
    }, []);

    return <ConversationScreen>
        <WindowTitle title='Sessions' />
        <Pad />
        <HorizBox spread center>
            <Heading level={1} label='Sessions' />
            <CTAButton label='Refresh' onPress={onRefresh} />
        </HorizBox>
        <Pad />
        {sessions.map((session, i) => <PadBox vert={4} key={i}><Session session={session} /></PadBox>)}
        {sessions.length > limit && <CTAButton label='Load more' onPress={() => setLimit(limit * 2)} />}
    </ConversationScreen>
}

function Session({session}) {
    console.log('Session', session, session.userName, session.time);
    return <HoverView onPress={() => pushSubscreen('eventlog', {sessionKey: session.key})}>
        <Byline name={session.userName} photo={session.userPhoto} clickable={false} time={session.endTime ?? session.startTime} />
    </HoverView>
    return <UtilityText label={JSON.stringify(session)} />
}

function EventLogScreen({eventType, sessionKey, siloKey}) {
    console.log('EventLog screen');
    const isAdmin = useIsAdmin();
    const [events, setEvents] = useState([]); 
    const [limit, setLimit] = useState(100);

    async function onRefresh() {
        console.log('Refresh');
        const events = await getLogEventsAsync({sessionKey, siloKey, eventType});
        console.log('Events', events);
        setEvents(events);
    }

    useEffect(() => {
        onRefresh();
    }, []);

    console.log('events', events);

    const sortedEvents = events.sort((a, b) => b.time - a.time).slice(0, limit);
    const filteredEvents = sortedEvents.filter(event => 
        (!eventType || event.eventType == eventType) &&
        (!sessionKey || event.sessionKey == sessionKey) &&
        (!siloKey || event.siloKey == siloKey)
    );

    if (!isAdmin) {
        return <ConversationScreen>
            <UtilityText label='Not authorized' />
        </ConversationScreen>
    }
    return <ConversationScreen>
        <Pad />
        <HorizBox spread center>
            <Heading level={1} label='Event Log' />
            <CTAButton label='Refresh' onPress={onRefresh} />
        </HorizBox>
        <Pad />
        {filteredEvents.map((event, i) => <PadBox vert={4} key={i}><LogEvent event={event} /></PadBox>)}
        {filteredEvents.length > limit && <CTAButton label='Load more' onPress={() => setLimit(limit * 2)} />}
    </ConversationScreen>
}

function LogEvent({event}) {
    const datastore = useDatastore();
    const selectedIdx = useSessionData(['event-selected-key']);
    const selected = selectedIdx == event.key;

    function onSelect() {
        datastore.setSessionData(['event-selected-key'], event.key);
    }

    return <HoverSelectBox selected={selected} onPress={onSelect}>    
        {selected ? <ExpandedEvent event={event} /> : <EventPreview event={event} />}
    </HoverSelectBox>
}

function EventPreview({event}) {
    const time = formatDate(event.time);
    return <PadBox horiz={8} vert={8}>
        <RichText label='**{eventType}** - {userName} - {siloKey} - {time} ' formatParams={{...event, time, userName: event.userName ?? 'anon'}}/>        
    </PadBox>
}

function ExpandedEvent({event}) {
    return <View>
        <EventPreview event={event} />
        <Separator />
        <PadBox horiz={10} vert={10}>
            {event.eventType && <LinkedField label='Event Type' value={event.eventType} onPress={() => pushSubscreen('eventlog', {eventType: event.eventType})} />}
            {event.sessionKey && <LinkedField label='Session' value={event.sessionKey} onPress={() => pushSubscreen('eventlog', {sessionKey: event.sessionKey})} />} 
            {event.structureKey && event.instanceKey && <LinkedField label='Instance' value={event.structureKey + '/' + event.instanceKey} onPress={() => gotoInstance({structureKey: event.structureKey, instanceKey: event.instanceKey})} />} 
            {event.url && <LinkedField label='URL' value={event.url} onPress={() => window.open(event.url, '_blank')} />}
            {event.text && <Paragraph text={event.text} />}
        </PadBox>
    </View>
}

function LinkedField({label, value, onPress}) {
    return <View>
        <HorizBox>
            <UtilityText type='large' strong label={label + ': '} />
            {onPress && <TextButton onPress={onPress} text={value} />}
            {!onPress && <Paragraph type='large' label={value} />}
       </HorizBox>
       <Pad size={4} />
    </View>
}