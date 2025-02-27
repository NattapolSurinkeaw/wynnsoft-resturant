import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getLogin } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const submitLogin = () => {
    if(!username || !password) {
      console.log("userane and password empty")
      return false;
    }

    const param = {
      username : username,
      password : password
    } 

    getLogin(param).then((res) => {
      console.log(res);
      if(res.status) {
        localStorage.setItem('isLogin', true)
        localStorage.setItem('accessToken', res.access_token)
        localStorage.setItem('refreshToken', res.refresh_token)
        navigate('/');
      }
    })
  }

  return (
    <div style={{backgroundImage: "url('/images/background/bg-login.png')"}} className='w-screen h-screen flex justify-center items-center'>
      <div className='bg-white rounded-lg flex gap-4 p-6'>
          <img src="/images/background/mockLogo.png" alt="" />
          <div>
            <div>
              <label htmlFor="">Username</label>
              <input type="text"
                className='border'
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Password</label>
              <input type="text"
                className='border'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className='flex gap-4'>
              <button
                className='border bg-green-500'
                onClick={submitLogin}
              >Login</button>
              <Link to="/register">register</Link>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Login