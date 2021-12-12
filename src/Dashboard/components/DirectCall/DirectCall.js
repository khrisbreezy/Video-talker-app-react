import React from 'react';
import { useSelector } from 'react-redux';
import IncomingCallDialog from '../IncomingCallDialog/IncomingCallDialog';
import CallRejectDialog from '../CallRejectedDialog/CallRejectedDialog';
import CallingDialog from '../CallingDialog/CallingDialog';
import LocalVideoView from '../LocalVideoView/LocalVideoView';
import RemoteVideoView from '../RemoteVideoView/RemoteVideoView';
import { callStates } from '../../../store/actions/call';
import ConversationButtons from '../ConversationButtons/ConversationButtons';
import Messenger from '../Messenger/Messenger';

const DirectCall = (props) => {
  // const { localStream, remoteStream } = props;

  const localStream = useSelector(state => state.call.localStream);
  const remoteStream = useSelector(state => state.call.remoteStream);
  const callState = useSelector(state => state.call.callState);
  const callingDialogVisible = useSelector(state => state.call.callingDialogVisible);
  const callerUsername = useSelector(state => state.call.callerUsername);
  const rejectReason = useSelector(state => state.call.rejectReason);
  const localMicrophoneEnabled = useSelector(state => state.call.localMicrophoneEnabled);
  const localCameraEnabled = useSelector(state => state.call.localCameraEnabled);
  const screenSharing = useSelector(state => state.call.screenSharing);

  return (
    <>
      <LocalVideoView localStream={localStream} />
      {(remoteStream && callState === callStates.CALL_IN_PROGRESS) && <RemoteVideoView remoteStream={remoteStream} />}
      {rejectReason.rejection && <CallRejectDialog reason={rejectReason.reason} />}
      {(callState === callStates.CALL_REQUESTED) && <IncomingCallDialog callerUsername={callerUsername} />}
      {callingDialogVisible && <CallingDialog />}
      {(remoteStream && callState === callStates.CALL_IN_PROGRESS) && <ConversationButtons
        localMicrophoneEnabled={localMicrophoneEnabled}
        localCameraEnabled={localCameraEnabled}
        screenSharing={screenSharing}
      />}
      {(remoteStream && callState === callStates.CALL_IN_PROGRESS) &&
        <Messenger />
      }
    </>
  );
};

export default DirectCall;
