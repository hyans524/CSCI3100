import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './LoginSignup.css'

import user_icon from '../../src/assets/user_icon.png'
import email_icon from '../../src/assets/email_icon.png'
import password_icon from '../../src/assets/password.png'

import { authApi } from '../../src/utils/api';

function LoginSignup() {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [action, setAction] = useState("Login");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // test using name = 123, pw = 123
            const credentials = {
                username,
                password
            };
            
            const response = await authApi.login(credentials);

            if (response.data) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('isAdmin', response.data.isAdmin);
                localStorage.setItem('useroid', response.data.useroid);
                localStorage.setItem('username', credentials.username);

                if (response.data.isAdmin) {

                } else {
                    navigate('/profile')
                }

            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };
    
        // Signup form state
        const [signupUsername, setSignupUsername] = useState('');
        const [signupEmail, setSignupEmail] = useState('');
        const [signupPassword, setSignupPassword] = useState('');
       
        const handleSignup = async (e) => {
            e.preventDefault();
            setError('');
    
            try {
                const signupData = {
                    username: signupUsername,
                    email: signupEmail,
                    password: signupPassword,
                };
                const response = await authApi.register(signupData);
    
                if (response.data) {
                    // Optionally, log the user in immediately after signup:
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('isAdmin', response.data.isAdmin);
                    localStorage.setItem('useroid', response.data.useroid);
                    localStorage.setItem('username', signupUsername);
    
                    navigate('/profile');
                }
            } catch (err) {
                console.error('Signup error:', err);
                setError(err.response?.data?.message || 'Sign up failed. Please try again.');
            }
        };


    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action === "Login" ? 

                <form action="javascript:void(0);" onSubmit={handleSubmit}>
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input placeholder='Username' label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" /> 
                        <input placeholder='Password' type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <div className='submitbutton'>
                        <button type="submit">Login</button>
                    </div>
                </form>

                    : 
                    
                    <form action='javascript:void(0);' onSubmit={handleSignup}>
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input placeholder='Username' label="Username" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} required/>
                        </div>
                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input type="email" placeholder='Email ID' label="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required autoComplete='off' />
                        </div>
                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input placeholder='Password' type="password" label="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required/>
                        </div>
                        <div className='submitbutton'>
                            <button type="submit">Sign Up</button>
                        </div>
                    </form>};

            </div>
            {action === "Sign Up" ? <div></div> : <div className="forgot-password">Lost Password? <span>Click Here!</span></div>}
            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up") }}>Sign Up</div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login") }}>Login</div>
            </div>
        </div>
    )
}

export default LoginSignup