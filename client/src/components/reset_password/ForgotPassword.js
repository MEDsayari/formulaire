import React, { useState } from 'react';
import axios from 'axios';
import './styleF.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSendResetEmail = event => {
    event.preventDefault(); 
    axios.post('http://localhost:5000/api/auth/reset_password', { email })
      .then(result => {
        console.log(result.data.msg);
      });
  };

  return (
 <div className="bodyy">
      <form className="forgotform">
        <div>
        <label className="mail">Email</label>

          <input className="forgotpassword" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <br/>
        </div>
        <div>
        <button className="forgotbutton" onClick={handleSendResetEmail}> reset password</button>
      </div>
    
      </form>
      </div>
  );
}

export default ForgotPassword;
