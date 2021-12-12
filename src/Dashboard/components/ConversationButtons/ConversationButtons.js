import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    MdCallEnd,
    MdMic,
    MdMicOff,
    MdVideocam,
    MdVideocamOff,
    MdOutlineScreenShare,
    MdOutlineStopScreenShare
    // MdVideoCall,
    // MdCamera
} from 'react-icons/md';

import ConversionButton from './ConversionButton';
import { setLocalCameraEnabled, setLocalMicrophoneEnabled } from '../../../store/actions/call';
import { hangUp, switchForScreenSharingStream } from '../../../utils/webRTC/webRTCHandler';

const styles = {
   btnContainer: {
    display: 'flex',
    position: 'absolute',
    bottom: '22%',
    left: '35%'
   },
   icon: {
    width: '25px',
    height: '25px',
    fill: '#e6e5e8'
   }
};


const ConversationButtons = ({localMicrophoneEnabled, localCameraEnabled, screenSharing, groupCall}) => {
    const dispatch = useDispatch();

    const localStream = useSelector(state => state.call.localStream);

    const handleMicButtonHandler = () => {
        const micEnabled = localMicrophoneEnabled;
        localStream.getAudioTracks()[0].enabled = !micEnabled;
        dispatch(setLocalMicrophoneEnabled(!micEnabled));
    };

    const handlerCameraButtonHandler = () => {
        const cameraEnabled = localCameraEnabled;
        localStream.getVideoTracks()[0].enabled = !cameraEnabled;
        dispatch(setLocalCameraEnabled(!cameraEnabled));
    };

    const screenSharingHandler = () => {
        switchForScreenSharingStream();
    };

    const endCallHandler = () => {
        hangUp();
    }

    return (
        <div style={styles.btnContainer}>
            <ConversionButton onClickHandler={handleMicButtonHandler}>
                {localMicrophoneEnabled ? <MdMic style={styles.icon} /> : <MdMicOff style={styles.icon} />}
            </ConversionButton>
            {!groupCall && <ConversionButton onClickHandler={endCallHandler}>
                <MdCallEnd style={styles.icon} />
            </ConversionButton>}
            <ConversionButton onClickHandler={handlerCameraButtonHandler}>
                {localCameraEnabled ? <MdVideocam style={styles.icon} /> : <MdVideocamOff style={styles.icon} />}
            </ConversionButton>
            {!groupCall && <ConversionButton onClickHandler={screenSharingHandler}>
                {!screenSharing ? <MdOutlineScreenShare style={styles.icon} /> : <MdOutlineStopScreenShare style={styles.icon} />}
            </ConversionButton>}
        </div>
    );
};

export default ConversationButtons;