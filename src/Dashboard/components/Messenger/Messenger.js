import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChatMessage } from '../../../store/actions/call';
import { sendMessageUsingDataChannel } from '../../../utils/webRTC/webRTCHandler';
import MessageDisplayer from './MessageDisplayer';

import './Messenger.css';

const Messenger = () => {
  const [inputValue, setInputValue] = useState('');


  const message = useSelector(state => state.call.message);

  console.log({message});

  const dispatch = useDispatch();

  const handleOnKeyDownEvent = (e) => {
    if (e.keyCode === 13) {
      sendMessageUsingDataChannel(inputValue);
      setInputValue('');
    }
  };

  useEffect(() => {
    if (message.received) {
      setTimeout(() => {
        dispatch(setChatMessage(false, ''));
      }, [5000]);
    }
  }, [message.received, dispatch]);

  return (
    <>
      <input
        className='messages_input'
        type='text'
        value={inputValue}
        onChange={(e) => { setInputValue(e.target.value); }}
        onKeyDown={handleOnKeyDownEvent}
        placeholder='Type your message'
      />
      {message.received && <MessageDisplayer message={message.content} />}
    </>
  );
};

export default Messenger;
