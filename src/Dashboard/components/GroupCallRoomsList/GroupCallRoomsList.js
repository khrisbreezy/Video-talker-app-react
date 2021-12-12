import React from 'react';
import { useSelector } from 'react-redux';


import GroupCallRoomsListItem from './GroupCallRoomsListItem';

import './GroupCallRoomsList.css';


const GroupCallRoomsList = () => {

  const dummyList = useSelector(state => state.dashReducer.activeRooms);

  return (
    <>
      {dummyList.map(room => <GroupCallRoomsListItem key={room.roomId} room={room} />)}
    </>
  );
};

export default GroupCallRoomsList;
