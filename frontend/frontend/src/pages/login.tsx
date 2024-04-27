import React, { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom';

import Footer from '../components/Footer'

// Redux 
import { RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {ThunkDispatch} from "@reduxjs/toolkit";
import { loginUser } from '../redux/features/user/userSlice'; 
import { setLoading, setError } from '../redux/features/ui/uiSlice';
import ExpandPost from '../components/ExpandPost';

import dayjs from 'dayjs'; 
import relativeTime from 'dayjs/plugin/relativeTime'

const login = () => {
  dayjs.extend(relativeTime)
  const v = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const [email, setEmail] = useState<String>(''); 
  const [password, setPassword] = useState<String>(''); 

  const [errors, setErrors] = useState<{ email: string, password: string, general: String }>({ email: '', password: '' , general: ''});

  const isLoading = useSelector((state: RootState) => state.ui.isLoading);

  useEffect(() => {
    document.title = 'Get Posted | Login';
  })

  let userData = {
    email: email, 
    password: password
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(setLoading(true)); 
    try {
      await dispatch(loginUser(userData)).unwrap();
      v('/'); 
    } catch (error) {
      setErrors(error)
      dispatch(setError(error.message || "Failed to login.")); 
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (event) => {
    // Get input
    const { name, value } = event.target;

    // Clear errors
    setErrors({email: '', password: '', general: ''});
    
    switch(name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  }
  
  return (
    <>
    <div className="hero h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="hero-content flex-col lg:flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login</h1>
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
              <label className="label">
                <Link to={'/forgot-password'} className="label-text-alt link link-hover">
                  Forgot password?
                </Link>
              </label>
            </div>
            <div className="form-control mt-6">
              {errors.general ? <p className='text-red-500 mb-2'>{errors.general}</p> : ''}
              <button className={`btn btn-primary ${isLoading ? 'btn-disabled' : ''}`}>
                {isLoading ? ( <span className="loading loading-spinner text-white"></span> ) : ( <p>Login</p> )}
              </button>
            </div>
          </form>
        </div>
        <p>Don't have an account ? &nbsp;
          <Link className='
          animate-gradient-x 
          bg-clip-text 
          text-transparent 
          bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500
          ' to={'/signup'}>Sign up here
          </Link>
        </p>
      </div>
    </div>
    </>
  )
}

export default login