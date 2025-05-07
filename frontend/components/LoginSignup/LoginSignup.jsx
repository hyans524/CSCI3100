import React,{ useState} from 'react'

import './LoginSignup.css'

import user_icon from '../../src/assets/user_icon.png'
import email_icon from '../../src/assets/email_icon.png'
import password_icon from '../../src/assets/password.png'


const LoginSignup = () => {

    
    const [action, setAction] = useState("Sign Up");
  return (
    <div className='container'>
        <div className='header'>
            <div className='text'>{action}</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            {action==="Login"?<form action='/login' method='POST'>
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" name="email" id="email" placeholder='Email ID' required autoComplete='off'/>
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" name="password" id="password" placeholder='Password' required autoComplete='off'/>
                </div>
                <div className='submitbutton'>
                    <button type="submit">Login</button>
                </div>
            </form>
            :<form action='/register' method='POST'>
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" name="username" id="username "placeholder='Accountname' required autoComplete='off'/>
                </div>
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" name="email" id="email" placeholder='Email ID' required autoComplete='off'/>
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" name="password" id="password" placeholder='Password' required autoComplete='off'/>
                </div>
                <div className='submitbutton'>
                    <button type="submit">Sign Up</button>
                </div>
            </form>};

        </div>
        {action==="Sign Up"?<div></div>:<div className="forgot-password">Lost Password? <span>Click Here!</span></div>}
        <div className="submit-container">
            <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
            <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
        </div>
    </div>
  )
}

export default LoginSignup