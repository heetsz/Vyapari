import React,{useState} from 'react'
import '../../App.scss'
import video from '../../LoginAssets/video.mp4'
import logo from '../../LoginAssets/logo.png'
import{Link, NavLink, useNavigate} from 'react-router-dom'
import {BsFillShieldLockFill} from 'react-icons/bs'
import {FaUserShield} from 'react-icons/fa'
import {AiOutlineSwapRight} from 'react-icons/ai'
import { AiOutlineMail } from 'react-icons/ai';  
import Axios from 'axios'

const Register = () => {

const[email, setEmail] = useState('')
const[userName, setUserName] = useState('')
const[password, setPassword] = useState('')
const navigateTo = useNavigate();

const createUser = (e) => {
  e.preventDefault();
  Axios.post('http://localhost:3003/register', {
    Email: email,
    UserName: userName,
    Password: password
  }).then((response)=>{
    console.log(response.data.message)
    if(userName === 'admin'){
      navigateTo('/dashboard');
    }
    else{
      navigateTo('/products');
    }
  })
}




  return (
    <div>
      <div className = 'registerPage flex'>
        <div className="container flex">
          <div className="videoDiv">
            <video src={video} autoPlay muted loop></video>
            <div className="textDiv">
              <h2 className='title'>Create And Sell Extraordinary Products</h2>
              <p>Adopt the peace of nature!</p>
            </div>
            <div className="footerDiv flex">
                <span className="text">Already Have an account?</span>
                  <Link to={'/'}>
                    <button className='btn'>
                      Login
                    </button>
                  </Link>
              </div>
            </div>
            <div className="formDiv flex">
            <div className="headerDiv">
              {/* <img src={logo} alt="logo image" />   */}
              <h3>Let Us Know You!</h3>
            </div>
            <form action="" className="form grid">
              <div className="inputDiv">
                <label htmlFor="email">Email</label>
                <div className = "input flex">
                  <AiOutlineMail style={{ fontWeight: 'extra-bold' }} className="icon"/>
                  <input type="email" id="email" placeholder="Enter Email" onChange={(event)=>{
                    setEmail(event.target.value)
                  }}/>
                </div>
              </div>
              <div className="inputDiv">
                <label htmlFor="username">Username</label>
                <div className = "input flex">
                  <FaUserShield className="icon"/>
                  <input type="text" id="username" placeholder="Enter Username"onChange={(event)=>{
                    setUserName(event.target.value)
                  }}/>
                </div>
              </div>
              <div className="inputDiv">
                <label htmlFor="password">Password</label>
                <div className = "input flex">
                  <BsFillShieldLockFill className="icon"/>
                  <input type="password" id="password" placeholder="Enter Password"onChange={(event)=>{
                    setPassword(event.target.value)
                  }}/>
                </div>
              </div>
                <button type='submit' className="btn flex " onClick={createUser}>
                  <span>Register</span>
                  <AiOutlineSwapRight className='icon'/>
                </button>
              <span className='forgotPassword'>
                Forgot Password? <button className='btns' onClick={() => navigateTo('/products')}>Click Here</button>
              </span>

            </form>
          </div>
          </div>
      </div>
    </div>
  )
}

export default Register
