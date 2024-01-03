import { Entypo } from "@expo/vector-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Clickable, Pad, PrimaryButton, StatusButtonlikeMessage } from "../component/basics";
import { callServerMultipartApiAsync } from "../util/servercall";
import { makeStorageUrl, useDatastore, usePersonaKey } from "../util/datastore";
import { PrototypeContext } from "../organizer/PrototypeContext";
import { gotoLogin } from "../util/navigate";

const video_mimetype = 'video/webm; codecs=vp9';  // this works for Chrome, and Firefox, but not Safari

export function VideoCamera({size=200, action='Record Video', onSubmitRecording}) {
    const s = VideoCameraStyle;
    const [cameraShown, setCameraShown] = useState(false);
    const {isLive} = useContext(PrototypeContext);
    const [uploading, setUploding] = useState(false);
    const datastore = useDatastore();
    const personaKey = usePersonaKey();

    if (!personaKey) {
        return <LoginToRecord />
    }

    async function onSubmit({blob, url}) {
        setCameraShown(false);
        if (isLive) {
            setUploding(true);
            const result = await callServerMultipartApiAsync({datastore, component: 'storage', funcname: 'uploadFile', 
                params: {contentType: 'video/webm', extension: 'webm'}, 
                fileParams: {file: {blob, filename: 'video.webm'}}
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
    } else if (cameraShown) {
        return <LiveVideoCamera size={size} onSubmitRecording={onSubmit} />
    } else {
        return <PrimaryButton 
            onPress={() => setCameraShown(true)}
            icon={<Entypo name='video-camera' size={24} color='white' />}
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

function LoginToRecord() {
    return <PrimaryButton onPress={gotoLogin} label='Log in to record a video' />
}

export function LiveVideoCamera({size, onSubmitRecording}) {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedBlobsRef = useRef([]);
    const [recording, setRecording] = useState(false);  
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        initializeMediaAsync();
      }, []);

    const startRecording = () => {
        recordedBlobsRef.current = [];
        const stream = videoRef.current.srcObject;
        console.log('stream', {stream, videoRef});
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: video_mimetype });

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
        const blob = new Blob(recordedBlobsRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        recordedBlobsRef.current = [];
        console.log('recorderd video uri', url);
        onSubmitRecording({blob, url});
    };
    
    async function initializeMediaAsync() {   
        const stream = await navigator.mediaDevices.getUserMedia(
            { 
                video: {
                    width: {ideal: size}, 
                    height: {ideal: size}
                }, 
                audio: true 
            });
        videoRef.current.srcObject = stream;
        setInitialized(true);
    };
    
    return (
        <View>
            <video 
                ref={videoRef} 
                style={{width: size, height: size, objectFit: "cover"}} autoPlay muted 
            />
            <Pad />
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
                <div>Initializing Camera...</div>
            }
        </View>
    );
}
