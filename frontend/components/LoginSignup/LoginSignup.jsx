import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './LoginSignup.css'

import user_icon from '../../src/assets/user_icon.png'
import email_icon from '../../src/assets/email_icon.png'
import password_icon from '../../src/assets/password.png'

import { authApi } from '../../src/utils/api';
import { licenseApi } from '../../src/utils/api';

function LoginSignup() {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [action, setAction] = useState("Login");
    const [haslicense, setHasLicense] = useState(true)
/*
    async function checkLicense() {

        const license = localStorage.getItem('license')
        if (license == null) {
            setHasLicense(false)
        }
        else {
            setHasLicense(true)
        }
        console.log(haslicense)

        if (haslicense != true) {
            const key = prompt("Please input your license")
            const response = await licenseApi.isValidLicense(key)
            console.log(response.data)
            console.log(key)
            if (response.data != null) {
                setHasLicense(true)
                console.log(key)
            }
        }
    }
    checkLicense()
*/
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (action === "Login") {

            try {
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
        }
        if (action === "Sign Up") {
            try {
                const credentials = {
                    username,
                    password
                };

                const response = await authApi.register(credentials);

                if (response.data) {
                    // Optionally, log the user in immediately after signup:
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
                console.error('Signup error:', err);
                setError(err.response?.data?.message || 'Sign up failed. Please try again.');
            }
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
                            <input placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input placeholder='Password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className='submitbutton'>
                            <button type="submit">Login</button>
                        </div>
                    </form>

                    :

                    <form action='javascript:void(0);' onSubmit={handleSubmit}>
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input placeholder='Password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className='submitbutton'>
                            <button type="submit">Sign Up</button>
                        </div>
                    </form>};

            </div>
            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up") }}>Sign Up</div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login") }}>Login</div>
            </div>
        </div>
    )
}

export default LoginSignup