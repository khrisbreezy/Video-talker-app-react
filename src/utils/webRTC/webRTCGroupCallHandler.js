import { callStates, setCallState, setGroupCallActive, setGroupCallStream, clearGroupCallData} from "../../store/actions/call";
import store from "../../store/store";
import { registerGroupCall, userLeftGroupCall, userWantsToJoinGroupCall, closeGroupCallByHost } from "../wssConnection/wssConnection";
import { getTurnServes } from "./TURN";

let mypeer;
let peerID;
let groupCallRoomId;
let groupCallHost = false;

export const connectWithPeer = () => {
    mypeer = new window.Peer(undefined, {
        path: '/peerjs',
        host: '/',
        port: '5000',
        config: {
            iceServers: [...getTurnServes(), { url: 'stun: stun.1und1.de:3478' }]
        }
    });

    mypeer.on('open', (id) => {
        peerID = id;
        console.log(`Succesfully connected with peer server with id: ${id}`);
    });

    mypeer.on('call', (call) => {
        call.answer(getLocalStream());
        call.on('stream', incomingStream => {
            console.log('Stream inconing', {incomingStream});
            const streams = store.getState().call.groupStreams;
            const stream = streams.find(stream => stream.id === incomingStream.id);
            console.log({stream}, 'peer call');
            if (!stream) {
                addVideoStream(incomingStream)
            }
        });
    });
};

const getLocalStream = () => {
    return store.getState().call.localStream;
};

export const createGroupCall = () => {
    groupCallHost = true;
    registerGroupCall({
        username: store.getState().dashReducer.username,
        id: peerID
    });
    store.dispatch(setGroupCallActive(true));
    store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const joinGroupCall = (hostSocketId, roomId) => {
    const localStream = getLocalStream();
    groupCallRoomId = roomId;
    userWantsToJoinGroupCall({
        peerId: peerID,
        hostSocketId,
        roomId,
        streamId: localStream.id
    });
    store.dispatch(setGroupCallActive(true));
    store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const connectToNewUser = (data) => {
    const localStream = getLocalStream();
    const call = mypeer.call(data.peerId, localStream);

    call.on('stream', (incomingStream) => {
        console.log({incomingStream});
       const streams = store.getState().call.groupStreams;
       const stream = streams.find(stream => stream.id === incomingStream.id);
       console.log({stream}, 'call');
        if (!stream) {
            addVideoStream(incomingStream);
        }
    });
};

export const leaveGroupCall = () => {
    if (groupCallHost) {
        closeGroupCallByHost({
            peerId: peerID
        });
    } else {
        userLeftGroupCall({
            streamId: store.getState().call.localStream.id,
            roomId: groupCallRoomId
        });
    }
    clearGroupData();
};

export const clearGroupData = () => {
    groupCallRoomId = null;
    groupCallHost = null;
    store.dispatch(clearGroupCallData());
    mypeer.destroy();
    connectWithPeer();

    const localStream = store.getState().call.localStream;

    localStream.getVideoTracks()[0].enabled = true;
    localStream.getAudioTracks()[0].enabled = true;

}

export const removeInactiveSteam = (data) => {
    const groupStreams = store.getState().call.groupStreams.filter(stream => stream.id !== data.streamId);
    store.dispatch(setGroupCallStream(groupStreams))
};

const addVideoStream = (incomingStream) => {
    let groupStreams = [
        ...store.getState().call.groupStreams,
        incomingStream
    ];
    store.dispatch(setGroupCallStream(groupStreams))
};

export const checkActiveGroupCall = () => {
    if (store.getState().call.groupCallActive) {
        return groupCallRoomId;
    } else {
        return false;
    }
}

