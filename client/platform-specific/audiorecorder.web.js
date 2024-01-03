import React, { useContext } from "react";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Clickable, Pad, PrimaryButton, StatusButtonlikeMessage } from "../component/basics";
import { PrototypeContext } from "../organizer/PrototypeContext";
import { makeStorageUrl, useDatastore, usePersonaKey } from "../util/datastore";
import { callServerMultipartApiAsync } from "../util/servercall";
import { getFirebaseUser } from "../util/firebase";
import { QuietSystemMessage } from "../component/message";


export function AudioRecorder({action='Record Audio', onSubmitRecording}) {
    const s = VideoCameraStyle;
    const [recorderShown, setRecorderShown] = useState(false);
    const {isLive} = useContext(PrototypeContext);
    const [uploading, setUploding] = useState(false);
    const datastore = useDatastore();

    console.log('isLive', isLive);

    async function onSubmit({blob, url}) {
        setRecorderShown(false);
        if (isLive) {
            setUploding(true);
            const result = await callServerMultipartApiAsync({datastore, component: 'storage', funcname: 'uploadFile', 
                params: {contentType: 'audio/webm', extension: 'webm'}, 
                fileParams: {file: {blob, filename: 'audio.webm'}}
            });
            const storageUrl = makeStorageUrl({datastore, userId: result.userId, fileKey: result.fileKey, extension: 'webm'});
            onSubmitRecording({blob, url: storageUrl});
            setUploding(false);
        } else {
            onSubmitRecording({blob, url});
        }
    }

    if (uploading) {
        return <StatusButtonlikeMessage label='Uploading...' />
    } else if (recorderShown) {
        return <LiveAudioRecorder onSubmitRecording={onSubmit} />
    } else {
        return <PrimaryButton 
            onPress={() => setRecorderShown(true)}
            icon={<FontAwesome name='microphone' size={24} color='white' />}
            label={action}/>
    }
}

const VideoCameraStyle = StyleSheet.create({
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
        alignSelf: 'flex-start'
    },
    label: {
        fontSize: 15,
        marginLeft: 16,
        fontWeight: 'bold'
    }
})

export function LiveAudioRecorder({size, onSubmitRecording}) {
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedBlobsRef = useRef([]);
    const [recording, setRecording] = useState(false);  
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        initializeMedia();
      }, []);

    const startRecording = () => {
        recordedBlobsRef.current = [];
        const stream = streamRef.current;
        console.log('stream', {stream, streamRef});
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' });

        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
        mediaRecorderRef.current.onstop = handleStop;

        mediaRecorderRef.current.start();
        setRecording(true);
    };
    
    const stopRecording = () => {
        mediaRecorderRef.current.stop();
    };
    
    const handleDataAvailable = (event) => {
        if (event.data && event.data.size > 0) {
            recordedBlobsRef.current.push(event.data);
        }
    };

    const handleStop = () => {
        const blob = new Blob(recordedBlobsRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        recordedBlobsRef.current = [];
        console.log('recorderd audio uri', url);
        onSubmitRecording({blob, url});
    };
    
    const handleSuccess = (stream) => {
        streamRef.current = stream;
        // videoRef.current.srcObject = stream;
        setInitialized(true);
    };
    
    const handleError = (error) => {
        console.error('Error accessing media devices:', error);
    };

    const initializeMedia = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(handleSuccess)
            .catch(handleError);
    };
    
    return (
        <View>
            {initialized ? 
                (recording ?
                    <PrimaryButton
                        icon={<Entypo name='controller-stop' size={24} color='white' />} 
                        onPress={stopRecording} label='Stop Recording' />
                :
                   <PrimaryButton 
                        icon={<Entypo name='controller-record' size={24} color='white' />} 
                        onPress={startRecording} label='Start Recording' />
                )
            : 
                <div>Initializing Microphone...</div>
            }
        </View>
    );
}
