import {
  SET_LOCAL_STREAM,
  callStates,
  CALL_SET_STATE,
  SET_CALLING_DIALOG,
  SET_CALLER_USERNAME,
  SET_CALL_REJECTED,
  SET_REMOTE_STREAM,
  SET_LOCAL_CAMERA_ENABLED,
  SET_LOCAL_MICROPHONE_ENABLED,
  SET_SCREEN_SHARING_ACTIVE,
  SET_RESET_CALL_DATA,
  SET_GROUP_CALL_ACTIVE,
  SET_GROUP_CALL_STREAM,
  CLEAR_GROUP_DATA,
  SET_CHAT_MESSAGE
} from "../actions/call";

const initialState = {
  localStream: null,
  remoteStream: null,
  callState: callStates.CALL_UNAVAILABLE,
  callingDialogVisible: false,
  callerUsername: "",
  rejectReason: {
      rejection: false,
      reason: ''
  },
  localMicrophoneEnabled: true,
  localCameraEnabled: true,
  screenSharing: false,
  groupCallActive: false,
  groupStreams: [],
  message: {
    received: false,
    content: ''
  }

};

const callReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCAL_STREAM:
      return {
        ...state,
        localStream: action.localStream,
      };
    case SET_REMOTE_STREAM:
        return {
            ...state,
            remoteStream: action.remoteStream,
        };
    case CALL_SET_STATE:
      return {
        ...state,
        callState: action.callState,
      };
    case SET_CALLING_DIALOG:
      return {
        ...state,
        callingDialogVisible: action.dialog,
      };
    case SET_CALLER_USERNAME:
      return {
        ...state,
        callerUsername: action.username,
      };

    case SET_CALL_REJECTED:
        return {
            ...state,
            rejectReason: action.rejectDetails
        };
    case SET_LOCAL_MICROPHONE_ENABLED:
        return {
            ...state,
            localMicrophoneEnabled: action.enabled
        };
    case SET_LOCAL_CAMERA_ENABLED:
        return {
            ...state,
            localCameraEnabled: action.enabled
        };
    case SET_SCREEN_SHARING_ACTIVE:
        return {
          ...state,
          screenSharing: action.active
        }
    case SET_RESET_CALL_DATA:
        return {
          ...state,
          remoteStream: null,
          screenSharing: null,
          callerUsername: "",
          localMicrophoneEnabled: true,
          localCameraEnabled: true,
          callingDialogVisible: false,
        }
    case SET_GROUP_CALL_ACTIVE:
      return {
        ...state,
        groupCallActive: action.active
      }
    case SET_GROUP_CALL_STREAM:
      return {
        ...state,
        groupStreams: action.stream
      }
    case CLEAR_GROUP_DATA:
      return {
        ...state,
        groupCallActive: false,
        groupStreams: [],
        callState: callStates.CALL_AVAILABLE,
        localMicrophoneEnabled: true,
        localCameraEnabled: true
      }
    case SET_CHAT_MESSAGE:
        return {
          ...state,
          message: action.message
        }

    default:
      return state;
  }
};

export default callReducer;
