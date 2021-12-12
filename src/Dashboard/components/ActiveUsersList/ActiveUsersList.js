import React from 'react';
import { useSelector } from 'react-redux';

import ActiveUsersListItem from './ActiveUsersListItem';

import './ActiveUsersList.css';

// const activeUsers = [
//   {
//     socketId: 321,
//     username: 'Paul'
//   },
//   {
//     socketId: 333,
//     username: 'John'
//   },
//   {
//     socketId: 432,
//     username: 'Kate'
//   },
//   {
//     socketId: 345,
//     username: 'Adam'
//   }
// ];

const ActiveUsersList = () => {

  const activeUsers = useSelector(state => state.dashReducer.activeUsers);

  return (
    <div className='active_user_list_container'>
      {activeUsers.map((activeUser) =>
        <ActiveUsersListItem
          key={activeUser.socketId}
          activeUser={activeUser}
        />)}
    </div>
  );
};

export default ActiveUsersList;
