import {
  setLocalStream,
  callStates,
  setCallState,
  setCallingDialog,
  setCallerUsername,
  setCallRejected,
  setRemoteStream,
  setScreenSharingActive,
  setResetCallData,
  setChatMessage
} from "../../store/actions/call";
import {
    sendPreOffer,
    sendPreOfferAnswer,
    sendWebRTCOffer,
    sendWebRTCAnswer,
    sendWebRTCCandidate,
    sendUserHangUp
} from "../wssConnection/wssConnection";
import store from "../../store/store";
import { getTurnServes } from "./TURN";

const defaultConstrains = {
  video: {
    width: 480,
    height: 360
  },
  audio: true,
};

let connectedUserSocketId;
let peerConnection;
let dataChannel;

const preOfferAnswers = {
  CALL_ACCEPTED: "CALL_ACCEPTED",
  CALL_REJECTED: "CALL_REJECTED",
  CALL_NOT_AVAILABLE: "CALL_NOT_AVAILABLE",
};

export const getLocalStream = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstrains)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
      store.dispatch(setCallState(callStates.CALL_AVAILABLE));
      createPeerConnection();
    })
    .catch((e) => {
      console.log("Error occured when user tried to get local stream");
      console.log(e);
    });
};

export const createPeerConnection = () => {
  const turnServers = getTurnServes();

  const configuration = {
    iceServers: [...turnServers, { url: 'stun:stun.1und1.de:3478' }],
    iceTransportPolicy: 'relay'
  };

    peerConnection = new RTCPeerConnection(configuration);
    const localStream = store.getState().call.localStream;

    for(const track of localStream.getTracks()) {
        peerConnection.addTrack(track, localStream);
    };

    peerConnection.ontrack = ({ streams: [stream] }) => {
      store.dispatch(setRemoteStream(stream));
        // Dispatch remote stream to store
    };

    // Incoming data channel message
    peerConnection.ondatachannel = event => {
      const dataChannel = event.channel;

      dataChannel.onopen = () => {
        console.log('peer connection ready to receive messages');

      }

      dataChannel.onmessage = (event) => {
        console.log({event});
        store.dispatch(setChatMessage(true, event.data));
      }
    };

    // Creating data channel
    dataChannel = peerConnection.createDataChannel('chat');
    dataChannel.onopen = () => {
      console.log('Chat successfully opened');
    }

    peerConnection.onicecandidate = (event) => {
        // Send to connected user our ice candidate
        console.log({event}, 'getting candidate from stun server');
        if (event.candidate) {
            sendWebRTCCandidate({
                candidate: event.candidate,
                connectedUserSocketId: connectedUserSocketId
            })
        }
    };

    peerConnection.onconnectionstatechange = (event) => {
        if (peerConnection.connectionState === 'connected') {
            console.log('sucessfully connected with other peer', {event});
        }
    };

};

export const callToOther = (activeUserDetails) => {
  connectedUserSocketId = activeUserDetails.socketId;
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
  store.dispatch(setCallingDialog(true));
  sendPreOffer({
    callee: activeUserDetails,
    caller: {
      username: store.getState().dashReducer.username,
    },
  });
};

export const handlePreoffer = (data) => {
  if (checkIfCallIsPossible()) {
    connectedUserSocketId = data.callerSocketId;
    store.dispatch(setCallerUsername(data.callerUsername));
    store.dispatch(setCallState(callStates.CALL_REQUESTED));;
  } else {
    sendPreOfferAnswer({
      callerSocketId: data.callerSocketId,
      answer: preOfferAnswers.CALL_NOT_AVAILABLE,
    });
  }
};

export const acceptIncomingCallRequest = () => {
  sendPreOfferAnswer({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_ACCEPTED,
  });
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const rejectIncomingCallRequest = () => {
  sendPreOfferAnswer({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_REJECTED,
  });
  resetCallData();
};

export const handlePreofferAnswer = (data) => {
    store.dispatch(setCallingDialog(false));
  if (data.answer === preOfferAnswers.CALL_ACCEPTED) {
    // Send WebRTC Offer
    sendOffer();
  } else {
    let rejectionReason;
    if (data.answer === preOfferAnswers.CALL_NOT_AVAILABLE) {
      rejectionReason =
        "Callee is not available to pick up the call right now!";
    } else {
      rejectionReason = "Callee rejected the call";
    }
    store.dispatch(setCallRejected({
        rejection: true,
        reason: rejectionReason
    }));
    resetCallData();
  }
};

const sendOffer = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    sendWebRTCOffer({
        calleeSocketId: connectedUserSocketId,
        offer: offer
    });
};

export const handleOffer = async (data) => {
    await peerConnection.setRemoteDescription(data.offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    sendWebRTCAnswer({
        callerSocketId: connectedUserSocketId,
        answer: answer
    });
};

export const handleAnswer = async (data) => {
    await peerConnection.setRemoteDescription(data.answer);
};

export const handleCandidate = async (data) => {
    try {
        await peerConnection.addIceCandidate(data.candidate);
    } catch(e) {
        console.log('Error occured when trying to add received ice candidate', e);
    }
};

// Check if call is possible
export const checkIfCallIsPossible = () => {
  if (
    store.getState().call.localStream === null ||
    store.getState().call.callState !== callStates.CALL_AVAILABLE
  ) {
    return false;
  } else {
    return true;
  }
};

let screenSharingStream;

// Function to share screen to other user
export const switchForScreenSharingStream = async () => {
  if (!store.getState().call.screenSharing) {
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      store.dispatch(setScreenSharingActive(true));
      const senders = peerConnection.getSenders();
      const sender = senders.find(sender => sender.track.kind === screenSharingStream.getVideoTracks()[0].kind);
      sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
    } catch(e) {
      console.log('Error ocurred when trying to get screen sharinf stream', {e});
    }
  } else {
    const localStream = store.getState().call.localStream;
    const senders = peerConnection.getSenders();
    const sender = senders.find(sender => sender.track.kind === localStream.getVideoTracks()[0].kind);
    sender.replaceTrack(localStream.getVideoTracks()[0]);
    store.dispatch(setScreenSharingActive(false));
    screenSharingStream.getTracks().forEach(track => track.stop());
  }
};

export const handleUserHangedUp = () => {
  resetCallDataAfterHangUp();
};

export const hangUp = () => {
  sendUserHangUp({
    connectedUserSocketId: connectedUserSocketId
  });

  resetCallDataAfterHangUp();
};

const resetCallDataAfterHangUp = () => {
  if (store.getState().call.screenSharing) {
    screenSharingStream.getTracks().forEach(track => track.stop());
  };

  store.dispatch(setResetCallData());

  peerConnection.close();
  peerConnection = null;
  createPeerConnection();
  resetCallData();

  const localStream =  store.getState().call.localStream;
  localStream.getVideoTracks()[0].enablbed = true;
  localStream.getAudioTracks()[0].enablbed = true;

};

// If user rejects call
export const resetCallData = () => {
  connectedUserSocketId = null;
  store.dispatch(setCallState(callStates.CALL_AVAILABLE));
};

// Logic to send messages through data channel
export const sendMessageUsingDataChannel = (message) => {
  dataChannel.send(message)
}
