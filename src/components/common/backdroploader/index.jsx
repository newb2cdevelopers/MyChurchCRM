import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const BackdropLoader = ({ show, message }) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={show}
    >
      <div style={{
        display: 'flex', flexDirection: 'column-reverse',
        alignItems: 'center'
      }}>
        <span style={{ marginTop: '30px', fontSize:'20px' }}>{message}</span>
        <CircularProgress color="inherit" sx={{ marginLeft: '15px' }} />
      </div>
    </Backdrop >
  )
}

export default BackdropLoader;
