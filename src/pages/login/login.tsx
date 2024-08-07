import { useState } from 'react';
import './login.css';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [isForgotActive, setIsForgotActive] = useState(false);
  const [isSignupActive, setIsSignupActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    otp: '',
    newPassword: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
  
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,}$/;

    if (name === 'newPassword' || name === 'password') {
      if (!passwordRegex.test(value)) {
        setIsValidPassword(false);

      } else {
        setIsValidPassword(true);
      }

    }
  
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();


    if(!isValidPassword) {
      console.error('password does not meet eligible criteria');
    }

    if (isForgotActive) {
      try {
        setIsLoading(true);
        const response = await axios.post('http://128.199.147.135:3002//reset-password', formData);
        console.log('Password Reset successful:', response.data);
        setIsLoading(false);

      } catch (err: any) {
        setIsLoading(false);
        if (err.response && err.response.data) {
          console.error('Password Reset error:', err.response.data);
        } else {
          console.error('Password Reset error:', err);
        }
      }

    }
    else if (isSignupActive) {

      try {
        setIsLoading(true);
        const response = await axios.post('http://128.199.147.135:3002//signup', formData);
        console.log('Signup successful:', response.data);
        setIsLoading(false);
        localStorage.setItem('token', response.data.token)
        navigate('/');
      } catch (err: any) {
        setIsLoading(false);
        if (err.response && err.response.data) {
          console.error('Signup error:', err.response.data);
        } else {
          console.error('Signup error:', err);
        }
      }

    }
    else {

      if (!isCaptchaVerified) {
        console.log('please verify captcha');
        return
      }

      try {
        setIsLoading(true);
        const response = await axios.post('http://128.199.147.135:3002//login', formData);
        console.log('Login successful:', response.data);
        setIsLoading(false);
        localStorage.setItem('token', response.data.token)
        navigate('/');
        
      } catch (err: any) {
        if (err.response && err.response.data) {
          console.error('Login error:', err.response.data);
          setIsLoading(false);
        } else {
          console.error('Login error:', err);
        }
      }

    }

  };

  const getOtp = async () => {

    if (formData.username == '') {
      console.error("enter username to get otp");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://128.199.147.135:3002//otp-generate', {
        username: formData.username
      });

      console.log('OTP generated successfully:', response.data);
      setIsLoading(false);
      // You can handle the response data as needed, for example:
      // return response.data;
    } catch (error) {
      setIsLoading(false);
      console.error('Error generating OTP:', error);
      // Handle errors appropriately, e.g., display an error message
    }
  };

  const onCaptchaFill = async (value: any) => {

    try {
      const response = await axios.post('http://128.199.147.135:3002//verify-captcha', {
        captchaToken: value
      });

      if (response.status === 200) {
        setIsCaptchaVerified(true);
      } else {
      }

    } catch (error) {
      console.error('Error verifying captcha:', error);
    }
  };



  return (
    <div className="login-container">
      <div className='img-container'>

        <div className='login-content-container'>

          <div className='unset-blend'>

            <p style={{ fontWeight: '500', fontSize: '0.8rem', display: 'flex', justifyContent: 'center' }}>
              {isSignupActive ? 'Create account' :
                isForgotActive ? 'Recover password' :
                  'Login to your account'}
            </p>

            <form onSubmit={handleSubmit}>
              {isForgotActive ? (
                <div onSubmit={getOtp} style={{ display: 'flex', flexDirection: 'row', gap: "10px" }}>
                  <div style={{ width: '50%' }}>
                    <span style={{ display: 'block' }}>Username</span>
                    <input autoComplete="off" name="username" value={formData.username} onChange={handleChange} required />
                  </div>
                  <button type='button' onClick={getOtp} style={{ width: '50%' }}>
                    {isLoading ? <ClipLoader size={6} color="#FFF" /> : 'Get OTP'}
                  </button>
                </div>
              ) :
                isSignupActive ?
                  <>
                    <div style={{ display: 'flex', gap: "10px" }}>
                      <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                        <span >Name</span>
                        <input autoComplete="off" name="name" value={formData.name} onChange={handleChange} required />
                      </div>

                      <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                        <span >Email</span>
                        <input autoComplete="off" type='email' name="email" value={formData.email} onChange={handleChange} required />
                      </div>
                    </div>

                    <span >Username</span>
                    <input autoComplete="off" name="username" value={formData.username} onChange={handleChange} required />
                  </>
                  : (
                    <>
                      <span >Username</span>
                      <input autoComplete="off" name="username" value={formData.username} onChange={handleChange} required />
                    </>
                  )}

              {isForgotActive && (
                <>
                  <span>Otp</span>
                  <input name='otp' value={formData.otp} autoComplete="off" onChange={handleChange} required></input>

                  <span>New password</span>
                  <input type='password' name='newPassword' value={formData.newPassword} autoComplete="off" onChange={handleChange} required></input>
                </>
              )
              }

              {!isForgotActive && (
                <>
                  <span>Password</span>
                  <input autoComplete="off" type='password' name="password" value={formData.password} onChange={handleChange} required></input>
                </>
              )}

              {!isForgotActive && !isSignupActive && (
                <div className='captcha-forgot-container'>
                  <ReCAPTCHA
                    sitekey="6LdJOyEqAAAAACI4EbHAeCnm4UH-GZ5NLH-hrHdL"
                    onChange={onCaptchaFill}
                    className="recaptcha"
                  />
                  <p className='forgot-link' onClick={() => setIsForgotActive(true)}>Forgot your password?</p>
                </div>
              )}


              <p className='redirect-element' style={{ fontSize: '0.7rem' }}>

                {isForgotActive || isSignupActive ? (
                  <span onClick={() => {
                    setIsForgotActive(false);
                    setIsSignupActive(false);
                    setFormData({
                      name: '',
                      username: '',
                      password: '',
                      email: '',
                      otp: '',
                      newPassword: ''
                    });
                  }}
                    style={{ cursor: 'pointer', color: 'black' }}>
                    Back to login
                  </span>
                ) : (
                  <>
                    Don't have an account?
                    <span onClick={() => setIsSignupActive(true)} style={{ cursor: 'pointer' }}> Signup</span>
                  </>
                )}

              </p>

              <button className='submit-button' type='submit'>
                {isLoading ? (
                  <ClipLoader size={6} color="#FFF" />
                ) : (
                  isForgotActive ? (
                    'Update'
                  ) : isSignupActive ? (
                    'Signup'
                  ) : (
                    'Login'
                  )
                )}

              </button>
            </form>

          </div>

          {/* for punch in hole effect */}
          <div className='set-blend'>
            <div className="hole"></div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Login;