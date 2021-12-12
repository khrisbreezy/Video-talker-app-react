import React from 'react';
import { useSelector } from 'react-redux';
import userAvatar from '../../../resources/userAvatar.png';
import { callStates } from '../../../store/actions/call';
import { callToOther } from '../../../utils/webRTC/webRTCHandler';

const ActiveUsersListItem = (props) => {
  const { activeUser } = props;

  const callState = useSelector(state => state.call.callState);

  const handleListItemPressed = () => {
    if (callState === callStates.CALL_AVAILABLE) {
      callToOther(activeUser);
    }
  };


  return (
    <div className='active_user_list_item' onClick={handleListItemPressed}>
      <div className='active_user_list_image_container'>
        <img alt="active-avatar" className='active_user_list_image' src={userAvatar} />
      </div>
      <span className='active_user_list_text'>{activeUser.username}</span>
    </div>
  );
};

export default ActiveUsersListItem;
