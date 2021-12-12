import socketClient from "socket.io-client";
import store from "../../store/store";
import {
  saveActiveRooms,
  saveActiveUsers,
} from "../../store/actions/dashboard";
import {
  handlePreoffer,
  handlePreofferAnswer,
  handleOffer,
  handleAnswer,
  handleCandidate,
  handleUserHangedUp,
} from "../webRTC/webRTCHandler";
import {
  connectToNewUser,
  removeInactiveSteam,
  checkActiveGroupCall,
  clearGroupData,
} from "../webRTC/webRTCGroupCallHandler";

const SERVER = "http://localhost:5000";

let socket;

const broadcastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
  GROUP_CALL_ROOMS: "GROUP_CALL_ROOMS",
};

export const connectWithWebSocket = () => {
  socket = socketClient(SERVER);

  socket.on("connection", () => {
    console.log("Successful connection");
    console.log(socket.id);
  });

  socket.on("broadcast", (data) => {
    handleBroadcastEvents(data);
  });

  // Event Listeners realated to direct call
  socket.on("pre-offer", (data) => {
    handlePreoffer(data);
  });

  // Event Listeners for call answers
  socket.on("pre-offer-answer", (data) => {
    handlePreofferAnswer(data);
  });

  // Event Listeners for WebRTCOffer
  socket.on("webRTC-offer", (data) => {
    handleOffer(data);
  });

  // Event Listeners for WebRTCAnswer
  socket.on("webRTC-answer", (data) => {
    handleAnswer(data);
  });

  // Event Listeners for ice candidate
  socket.on("webRTC-candidate", (data) => {
    handleCandidate(data);
  });

  // Event listeners for user hangup
  socket.on("user-hanged-up", () => {
    handleUserHangedUp();
  });

  // Event listeners related to group call requests
  socket.on("user-request-groupcall-join", (data) => {
    connectToNewUser(data);
  });

  socket.on("group-call-user-left", (data) => {
    removeInactiveSteam(data);
  });
};

export const registerNewUser = (username) => {
  socket.emit("register-new-user", {
    username: username,
    socketId: socket.id,
  });
};

const handleBroadcastEvents = (data) => {
  switch (data.event) {
    case broadcastEventTypes.ACTIVE_USERS:
      const activeUsers = data.activeUsers.filter(
        (activeUser) => activeUser.socketId !== socket.id
      );
      store.dispatch(saveActiveUsers(activeUsers));
      break;
    case broadcastEventTypes.GROUP_CALL_ROOMS:
      const groupCallRooms = data.groupCallRooms.filter(
        (room) => room.socketId !== socket.id
      );
      const activeGroupCallRoomsId = checkActiveGroupCall();
      if (activeGroupCallRoomsId) {
        const room = groupCallRooms.find(
          (room) => room.roomId === activeGroupCallRoomsId
        );
        if (!room) {
          clearGroupData();
        }
      }
      store.dispatch(saveActiveRooms(groupCallRooms));
      break;
    default:
      return;
  }
};

// Emitting events to the server related to direct calling
export const sendPreOffer = (data) => {
  socket.emit("pre-offer", data);
};

export const sendPreOfferAnswer = (data) => {
  socket.emit("pre-offer-answer", data);
};

export const sendWebRTCOffer = (data) => {
  socket.emit("webRTC-offer", data);
};

export const sendWebRTCAnswer = (data) => {
  socket.emit("webRTC-answer", data);
};

export const sendWebRTCCandidate = (data) => {
  socket.emit("webRTC-candidate", data);
};

export const sendUserHangUp = (data) => {
  socket.emit("user-hanged-up", data);
};

// Emitting events to the server related to group calling
export const registerGroupCall = (data) => {
  socket.emit("reg-group-call", data);
};

export const userWantsToJoinGroupCall = (data) => {
  socket.emit("user-request-groupcall-join", data);
};

export const userLeftGroupCall = (data) => {
  socket.emit("group-call-user-left", data);
};

export const closeGroupCallByHost = (data) => {
  socket.emit("close-group-call-by-host", data);
};
