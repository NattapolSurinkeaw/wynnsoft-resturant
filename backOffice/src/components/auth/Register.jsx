import React, { useState } from 'react'
import { getRegister } from '../../services/auth.service';
import { Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const submitRegister = () => {
    if(!username || !password || !email || !name) {
      console.log("Please enter all data")
      return false;
    }
  
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('name', name);

    getRegister(formData).then((res) => {
      console.log(res);
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

            <div>
              <label htmlFor="">Email</label>
              <input type="text"
              className='border' 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="">Display Name</label>
              <input type="text" 
              className='border'
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <button
                onClick={submitRegister}
                className='border bg-blue-400'
              >
                Register
              </button>
              <Link to="/login">login</Link>
            </div>
          </div>
        </div>
    </div>
    // <div>
    //   <h1>Register</h1>
    

        
    // </div>
  )
}

export default Register