import React, { useState, useEffect } from 'react';
import RecoveryPassword from './recoveryPassword';
import CreateNewPassword from './createNewPassword';

function RecoveryPasswordRequest() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token_id'));
  }, []); // Fixed: added empty dependency array

  return (
    <div>
      {token && token !== '' ? ( // Fixed: corrected inverted logic (was: !token)
        <CreateNewPassword />
      ) : (
        <RecoveryPassword />
      )}
    </div>
  );
}

export default RecoveryPasswordRequest;
