import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';


import Post from '../components/Post';
import Profile from '../components/Profile.tsx'

// Redux 
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from '../redux/store'; 
import { fetchPosts, setPosts, clearError } from '../redux/features/data/dataSlice';
import { viewingOwnProfile, viewingOtherProfile, setViewedUser } from '../redux/features/ui/uiSlice.ts';

// Data Types
import User from '../interfaces/User.ts'

const Home = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { posts, loading, error } = useSelector((state: RootState) => state.data);
  const { userInfo } = useSelector((state: RootState) => state.user)
  
  useEffect(() => {
    document.title = 'Get Posted | Home';
    viewingOwnProfile(false);
    viewingOtherProfile(false);
    dispatch(setViewedUser(''));
  })

  useEffect(() => {
    dispatch(fetchPosts()).unwrap(); 
  }, [dispatch]);

  const dismissError = () => {
    dispatch(clearError());
  }


  return (
    <>
      <div className='container grid lg:grid-cols-3 md:grid-cols-1 grid-flow-col space-x-2'>
        <div className='col-span-2'>
        {loading && 
          <div className='fixed top-1/2 left-1/2 z-[99999]'>
            <div className=''>
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          </div>
        }
            <div>
            <SimpleBar style={{ height: '89vh' }}>
              {posts.map((post, index) => (
                <Post key={index} id={post._post_id} 
                _post_id={post._post_id}
                body={post.body}
                createdAt={post.createdAt}
                userHandle={post.userHandle}
                userImage={post.userImage}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                />
              ))}
            </SimpleBar>
            </div>
        </div>

        <div className='border lg:block md:hidden sm:hidden h-max'>
          <h1><Profile user={(userInfo as User)}/></h1>
          {error && error === 'failed-like' &&
          <div role="alert" className="alert alert-error flex flex-col">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-white shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>You need to log in to like posts !</span>
            <div className='flex flex-row gap-10'>
              <button className="btn btn-sm"
              onClick={dismissError}
              >Dismiss</button>
              <Link to={'/login'}><button className='btn btn-sm btn-primary'
              onClick={dismissError}
              >Login</button></Link>
            </div>
          </div>
          }
          {error && error === 'failed-comment' &&
          <div role="alert" className="alert alert-error flex flex-col">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-white shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>You need to log in to view comments !</span>
            <div className='flex flex-row gap-10'>
              <button className="btn btn-sm"
              onClick={dismissError}
              >Dismiss</button>
              <Link to={'/login'}><button className='btn btn-sm btn-primary'
              onClick={dismissError}
              >Login</button></Link>
            </div>
          </div>
          }
        </div>
      </div>
    </>
  );
}

export default Home;
