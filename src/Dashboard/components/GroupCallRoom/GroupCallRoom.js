import React from 'react';
import { useSelector } from 'react-redux';

import ConversationButtons from '../ConversationButtons/ConversationButtons';

import './GroupCallRoom.css';
import GroupCallVideo from './GroupCallVideo';

const GroupCallRoom = () => {

  const localMicrophoneEnabled = useSelector(state => state.call.localMicrophoneEnabled);
  const localCameraEnabled = useSelector(state => state.call.localCameraEnabled);
  const screenSharing = useSelector(state => state.call.screenSharing);
  const groupStreams = useSelector(state => state.call.groupStreams);

  return (
    <div className='group_call_room_container'>
      <span className='group_call_title'>Group Call</span>
      <div className='group_call_videos_container'>
        {/* display the streams from the other users */}
        {groupStreams.map((stream, i) => {
          return <GroupCallVideo stream={stream} key={i}  />
        })}
      </div>
      <ConversationButtons
        localMicrophoneEnabled={localMicrophoneEnabled}
        localCameraEnabled={localCameraEnabled}
        screenSharing={screenSharing}
        groupCall
      />
    </div>
  );
};

export default GroupCallRoom;
