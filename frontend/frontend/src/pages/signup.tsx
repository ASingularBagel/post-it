import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

// Redux 
import { RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {ThunkDispatch} from "@reduxjs/toolkit";

import { signupUser } from '../redux/features/user/userSlice'
import { setLoading, setError } from '../redux/features/ui/uiSlice';

const signup = () => {
  const v = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const [handle, setHandle] = useState<String>('');
  const [email, setEmail] = useState<String>(''); 
  const [password, setPassword] = useState<String>(''); 
  const [confirmPassword, setConfirmPassword] = useState<String>('');

  const [errors, setErrors] = useState<{ handle: String, email: string, password: string, general: String, confirmPassword: String }>({ handle: '', email: '', password: '' , general: '', confirmPassword: ''});

  const isLoading = useSelector((state: RootState) => state.ui.isLoading);

  useEffect(() => {
    document.title = 'Get Posted | Signup';
  })

  const handleSubmit = async () => {
    event?.preventDefault();
    dispatch(setLoading(true)); 

    const userData = {
      email: email, 
      password: password, 
      confirmPassword: confirmPassword,
      handle: handle
    }
    try {
      await dispatch(signupUser(userData)).unwrap();
      v('/'); 
    } catch (error) {
      setErrors(error)
      dispatch(setError(error.message || "Failed to signup.")); 
    } finally {
      dispatch(setLoading(false)); 
    }
  };

  

  const handleChange = (event) => {
    // Get input
    const { name, value } = event.target;

    // Clear errors
    setErrors({handle: '', email: '', password: '', confirmPassword: '', general: ''});
    
    switch(name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword': 
        setConfirmPassword(value);
      case 'handle': 
        setHandle(value);
      default:
        break;
    }
  }
  
  return (
    <>
    <div className="hero h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="hero-content flex-col lg:flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Sign up</h1>
          <p className="py-6"></p>
        </div>
        <div className="card shrink-0 w-card-w max-w-sm shadow-2xl bg-base-100 backdrop-blur-lg border rounded-md">
          <form className="card-body" onSubmit={handleSubmit}>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
                <span className="label-text-alt text-red-500">{errors.email ? errors.email : ''}</span>
              </label>
              
              <input id='email' name='email' type="email" placeholder="email" className="input input-bordered" required onChange={handleChange}/>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
                <span className="label-text-alt text-red-500">{errors.password ? errors.password : ''}</span>
              </label>

              <input id='password' name='password' type="password" placeholder="password" className="input input-bordered" required onChange={handleChange}/>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm password</span>
                <span className="label-text-alt text-red-500">{errors.confirmPassword ? errors.confirmPassword : ''}</span>
              </label>

              <input id='confirmPassword' name='confirmPassword' type="password" placeholder="confirm password" className="input input-bordered" required onChange={handleChange}/>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
                <span className="label-text-alt text-red-500">{errors.handle ? errors.handle : ''}</span>
              </label>
              
              <input id='handle' name='handle' type="text" placeholder="username" className="input input-bordered" required onChange={handleChange}/>
            </div>

            <div className="form-control mt-6">
              {errors.general ? <p className='text-red-500 mb-2'>{errors.general}</p> : ''}
              <button className={`btn btn-primary ${isLoading ? 'btn-disabled' : ''}`}>
                {isLoading ? ( <span className="loading loading-spinner text-white"></span> ) : ( <p>Signup</p> )}
              </button>
            </div>
          </form>
        </div>
        <p>Already have an account ? &nbsp;
          <Link className='
          animate-gradient-x 
          bg-clip-text 
          text-transparent 
          bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500
          ' to={'/login'}>Login here
          </Link>
        </p>
      </div>
    </div>
    </>
  )
}

export default signup