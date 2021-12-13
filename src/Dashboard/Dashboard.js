import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import logo from '../resources/logo.png';

import ActiveUsersList from './components/ActiveUsersList/ActiveUsersList';
import { getLocalStream } from '../utils/webRTC/webRTCHandler';
import { connectWithPeer } from '../utils/webRTC/webRTCGroupCallHandler';
import DirectCall from './components/DirectCall/DirectCall';
import DashboardInformation from './components/DashboardInformation/DashboardInformation';
import GroupCallRoomsList from './components/GroupCallRoomsList/GroupCallRoomsList';

import './Dashboard.css';
import { callStates } from '../store/actions/call';
import GroupCall from './components/GroupCall/GroupCall';
import { setTurnServers } from '../utils/webRTC/TURN';

const Dashboard = () => {
  const navigate = useNavigate();

  const callState = useSelector( state => state.call.callState);
  const username = useSelector(state => state.dashReducer.username);

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }
  }, [navigate, username]);

  useEffect(() => {
    try {
      const data = axios.get('https://app-video-talker-server.herokuapp.com/api/get-turn-credentials');
      data.then(res => {
        setTurnServers(res.data.token.iceServers);
        getLocalStream();
        connectWithPeer();
        console.log({res});
      })
    } catch(e) {
      console.log(e);
    }
  },[]);

  return (
    <div className='dashboard_container background_main_color'>
      <div className='dashboard_left_section'>
        <div className='dashboard_content_container'>
            <DirectCall />
            <GroupCall />
            {callState !== callStates.CALL_IN_PROGRESS && <DashboardInformation />}
        </div>
        <div className='dashboard_rooms_container background_secondary_color'>
            <GroupCallRoomsList />
        </div>
      </div>
      <div className='dashboard_right_section background_secondary_color'>
        <div className='dashboard_active_users_list'>
          <ActiveUsersList />
        </div>
        <div className='dashboard_logo_container'>
          <img alt="" className='dashboard_logo_image' src={logo} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
