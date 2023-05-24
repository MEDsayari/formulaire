import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Link } from "react-router-dom";
import "./styleR.css"

function ResetPassword() {
  const { id } = useParams()
  const [password,setPassword] = useState('')

  const handleUpdatePassword = async ()=>{
    await axios.put(`http://localhost:5000/api/auth/reset_password/${id}`,{password:password})
    .then(result=>{
        console.log(result.data.message)
    })
  }
  return (
    <div className="body">
<form  className="reset-password-form">
<input className="reset-password-input" type="password" placeholder='nouvelle mot de passe ' onChange={e=>setPassword(e.target.value)} />
<Link to="/login">
<button onClick={handleUpdatePassword}>update</button>
</Link>
<br/>

</form>
    </div>

  )
}

export default ResetPassword