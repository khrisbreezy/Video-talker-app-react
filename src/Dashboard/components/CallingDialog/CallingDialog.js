import React from 'react';
import { hangUp } from '../../../utils/webRTC/webRTCHandler';
import { MdCallEnd } from 'react-icons/md';

import './CallingDialog.css';


const styles = {
  btnContainer: {
    marginTop: '10px',
    width: '40px',
    height: '40px',
    borderRadius: '40px',
    border: '2px solid #e6e5e8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

const CallingDialog = () => {

  const hangUpHandler = () => {
    hangUp();
  }

  return (
    <div className='direct_calling_dialog background_secondary_color'>
      <span>Calling</span>
      <div style={styles.btnContainer} onClick={hangUpHandler}>
        <MdCallEnd style={{width: '20px', height: '20px', fill: '#e6e5e8'}} />
      </div>
    </div>
  );
};

export default CallingDialog;
