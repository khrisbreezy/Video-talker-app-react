import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCallRejected } from '../../../store/actions/call';

import './CallRejectedDialog.css';

const CallRejectedDialog = ({reason}) => {

  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(setCallRejected({
        rejection: false,
        reason: ''
      }))
    }, 9000);
  });

  return (
    <div className='call_rejected_dialog background_secondary_color'>
      <span>
        {reason}
      </span>
    </div>
  );
};

export default CallRejectedDialog;
