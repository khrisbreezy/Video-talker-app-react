import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';

import logo from '../resources/logo.png';
import UsernameInput from './components/UsernameInput';
import SubmitButton from './components/SubmitButton';
import { setDashboardUsername } from '../store/actions/dashboard';
import { registerNewUser } from '../utils/wssConnection/wssConnection';

import './Login.css';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const activeUsersList = localStorage.getItem('activeUsers') ? JSON.parse(localStorage.getItem('activeUsers')) : [];

    const [username, setUsername] = useState('');


  const handleSubmitButtonPressed = () => {
    registerNewUser(username);
    dispatch(setDashboardUsername(username));
    // dispatch(saveActiveUsers(activeUsersList));
    navigate('/dashboard');
  };

    return (
        <div className='login-page_container background_main_color'>
            <div className='login-page_login_box background_secondary_color'>
                <div className='login-page_logo_container'>
                    <img className='login-page_logo_image' src={logo} alt='VideoTalker' />
                </div>
                <div className='login-page_title_container'>
                    <h2>Get on Board</h2>
                </div>
                <UsernameInput username={username} setUsername={setUsername} />
                <SubmitButton handleSubmitButtonPressed={handleSubmitButtonPressed} />
            </div>
        </div>
    );
};

// const mapActionsToProps = (dispatch) => {
//     return {

//     }
// }

export default Login;