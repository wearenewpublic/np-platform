import { useState } from 'react';
import { useServerCallResult } from '../util/servercall';
import { useDatastore } from '../util/datastore';
import { Container, ConversationScreen, HorizBox, LoadingScreen, Pad, PadBox } from '../component/basics';
import { Catcher } from '../system/catcher';
import { Heading, UtilityText } from '../component/text';
import { CTAButton } from '../component/button';
import { View } from 'react-native';
import { AccordionField } from '../component/form';

export const MigrationsStructure = {
    key: 'migrations',
    name: 'Migrations',
    screen: MigrationsScreen,
    subscreens: {
        migration: ({migrationKey}) => <MigrationScreen migrationKey={migrationKey} />,
        past: ({migrationKey}) => <PastExecutions migrationKey={migrationKey} />,
    }
}

function MigrationsScreen() {
    const migrationPreviews = useServerCallResult('migrations', 'getMigrationPreviews');

    if (!migrationPreviews) return <LoadingScreen />

    return <ConversationScreen>
        <Pad/>
        <PadBox horiz={20}>
            {migrationPreviews.map((migration, i) => 
                <Catcher key={i}>
                    <MigrationPreview migration={migration} />
                    <Pad size={20} />
                </Catcher>
            )}
        </PadBox>
    </ConversationScreen>
}

function MigrationPreview({migration}) {
    const datastore = useDatastore();
    return <CTAButton text={migration.name} onPress={() => datastore.pushSubscreen('migration', {migrationKey: migration.key})} />
}

function MigrationScreen({migrationKey}) {
    const migration = useServerCallResult('migrations', 'getSingleMigration', {migrationKey});
    const [forwardWrites, setForwardWrites] = useState(null);
    const [undoWrites, setUndoWrites] = useState(null);
    const [migrationLog, setMigrationLog] = useState(null);
    const [done, setDone] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const datastore = useDatastore();

    if (!migration) return <LoadingScreen />

    async function onPreviewMigration() {
        setInProgress(true);
        const result = await datastore.callServerAsync('migrations', 'runMigration', {
            migrationKey, preview: true
        });
        setInProgress(false);
        console.log('result', result);
        setForwardWrites(result.forwardWrites);
        setUndoWrites(result.undoWrites);
        setMigrationLog(result.migrationLog);
    }

    async function onRunMigration() {
        setInProgress(true);
        const result = await datastore.callServerAsync('migrations', 'runMigration', {
            migrationKey, preview: false
        });
        setInProgress(false);
        setForwardWrites(result.forwardWrites);
        setUndoWrites(result.undoWrites);
        setMigrationLog(result.migrationLog);
        setDone(true);
    }

    console.log('migrationLog', migrationLog);

    return <PadBox horiz={20} vert={20}>
        <Pad />
        <Heading text={migration.name} />
        <UtilityText text={migration.description}/>
        <Pad />
        {!done && !inProgress && 
            <HorizBox>
                <CTAButton type={forwardWrites ? 'secondary' : null} text='Preview Migration' onPress={onPreviewMigration} />
                <Pad />
                <CTAButton disabled={!forwardWrites} text='Run Migration' onPress={onRunMigration} />
                <Pad />
                <CTAButton type='secondary' text='Past Executions' onPress={() => datastore.pushSubscreen('past', {migrationKey})} />
            </HorizBox>
        }
        {inProgress && <UtilityText strong label='Migration in progress...' />}
        {done && <UtilityText strong label='Migration complete' />}
        <Pad />
        {migrationLog && <MigrationLog migrationLog={migrationLog} />}
        {forwardWrites && <MigrationChanges newMap={forwardWrites} oldMap={undoWrites} />}
    </PadBox>
}


function PastExecutions({migrationKey}) {
    const pastExecutions = useServerCallResult('migrations', 'getPastExecutions', {migrationKey});
    const sortedExecutionKeys = Object.keys(pastExecutions ?? {}).sort((x,y) => pastExecutions[y].time - pastExecutions[x].time);
    const mostRecentKey = sortedExecutionKeys[0];
    const datastore = useDatastore();
    console.log('pastExecutions', pastExecutions);

    async function onRollBack(executionKey) {
        console.log('Rolling back', executionKey);
        await datastore.callServerAsync('migrations', 'rollBackMigration', {migrationKey, executionKey});
        datastore.goBack();
    }

    console.log('Past Executions', pastExecutions);
    return <PadBox horiz={20} vert={20}>
        <Heading label='Past Executions' />
        {sortedExecutionKeys.map(key =>
            <AccordionField key={key} titleContent={<UtilityText text={new Date(pastExecutions[key].time).toLocaleString()} />} defaultOpen={false}>
                <MigrationChanges 
                    newMap={JSON.parse(pastExecutions[key].prunedWrites)} 
                    oldMap={JSON.parse(pastExecutions[key].undoWrites)} 
                />
                <Pad size={8} />
                {pastExecutions[key].rolledBack && <UtilityText strong text='Rolled back' />}
                {mostRecentKey == key && !pastExecutions[key].rolledBack && <CTAButton text='Roll Back Migration' onPress={() => onRollBack(key)} />}
            </AccordionField>
        )}
    </PadBox>
}

function stringifySorted(obj) {
    if (!obj) return 'null';
    return JSON.stringify(obj, Object.keys(obj).sort());
}

function MigrationLog({migrationLog}) {
    return <View>
        <Heading label='Migration Log' />
        <Container>
            <PadBox horiz={8} vert={4}>
                {migrationLog.map((log, i) => <UtilityText key={i} text={log} />)}
            </PadBox>
        </Container>
        <Pad />
    </View>
}


function MigrationChanges({newMap, oldMap}) {
    const keys = Object.keys({...newMap, ...oldMap});
    return <View>
        <Heading label='Migration Changes' />
        <Container>
            <PadBox horiz={8} vert={4}>
                {keys.map(key =>
                    <View key={key}> 
                        <UtilityText strong text={key} />
                        <PadBox left={20}>
                            <UtilityText text={'New: ' + stringifySorted(newMap[key])} />
                            <UtilityText text={'Old: ' + stringifySorted(oldMap[key])} />                            
                        </PadBox>
                    </View>
                )}
            </PadBox>
        </Container>
    </View>

}


