import React, { useState } from 'react';
import '../../App.scss';
import video from '../../LoginAssets/video.mp4';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { FaUserShield } from 'react-icons/fa';
import { AiOutlineSwapRight } from 'react-icons/ai';
import Axios from 'axios';

const Login = () => {
  const [loginUserName, setLoginUserName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigateTo = useNavigate();

  const loginUser = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:3003/login', {
      loginUserName: loginUserName,
      loginPassword: loginPassword,
    }).then((response) => {
      console.log(response.data.message); 

      if (loginUserName == 'admin') {
        navigateTo('/dashboard');
      } else {
        navigateTo('/products');
      }  
    }).catch((error) => {
      console.error("Error during login:", error);
    });
  };

  return (
    <div>
      <div className='loginPage flex'>
        <div className="container flex">
          <div className="videoDiv">
            <video src={video} autoPlay muted loop></video>
            <div className="textDiv">
              <h2 className='title'>Create And Sell Extraordinary Products</h2>
              <p>Adopt the peace of nature!</p>
            </div>
            <div className="footerDiv flex">
              <span className="text">Don't have Account?</span>
              <Link to={'/register'}>
                <button className='btn'>
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
          <div className="formDiv flex">
            <div className="headerDiv">
              {/* <img src={logo}></img> */}
              <h3>Welcome Back!!</h3>
            </div>

            <form className="form grid" onSubmit={loginUser}>
              <div className="inputDiv">
                <label htmlFor="username">Username</label>
                <div className="input flex">
                  <FaUserShield className="icon" />
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter Username"
                    onChange={(event) => setLoginUserName(event.target.value)}
                  />
                </div>
              </div>
              <div className="inputDiv">
                <label htmlFor="password">Password</label>
                <div className="input flex">
                  <BsFillShieldLockFill className="icon" />
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter Password"
                    onChange={(event) => setLoginPassword(event.target.value)}
                  />
                </div>
              </div>
              <button type='submit' className="btn flex">
                <span>Login</span>
                <AiOutlineSwapRight className='icon' />
              </button>
              {/* <a href="/dashboard">Dashboard</a> */}
              <span className='forgotPassword'>
                Buy Products? <button className='btns' onClick={() => navigateTo('/products')}>Click Here</button>
              </span>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
