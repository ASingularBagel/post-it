import React, { useState } from 'react'
import { Link } from 'react-router-dom';

import dayjs from 'dayjs'; 
import relativeTime from 'dayjs/plugin/relativeTime'

import ProfileIcon from './ProfileIcon'
import DeletePost from './DeletePost'

// Icons
import { FaRegHeart } from "react-icons/fa";
import { BiCommentDetail } from "react-icons/bi";

// Redux 
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from '../redux/store';

import { likePost, unlikePost, setError } from '../redux/features/data/dataSlice';
import { isPostLikedByUser } from '../redux/features/user/userSlice';
import User from '../interfaces/User';
import ExpandPost from './ExpandPost';

type postProps = {
  id: String;
    _post_id: String;
    body: String;
    createdAt: String;
    userHandle: String;
    userImage: String;
    likeCount: Number;
    commentCount: Number; 
}

const Post: React.FC<postProps> = ({ id, _post_id, body, userHandle, userImage, createdAt, likeCount, commentCount}) => {
dayjs.extend(relativeTime)
const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  
  const isLiked = useSelector((state: RootState) => isPostLikedByUser(state, _post_id));
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const handleLike = (_post_id: String) => {
  if (!isAuthenticated) {
    dispatch(setError('failed-like'));
    return;
  } else {
    try {
      if (isLiked) {
        dispatch(unlikePost(_post_id))
          .catch((error) => console.log(error));
      } else {
        dispatch(likePost(_post_id))
          .catch((error) => console.log(error));
      }
    } catch (error) {
      console.log(error);
    }
  }
  };

  const handleExpandPost = () => {
    if ( !isAuthenticated ) {
      dispatch(setError('failed-comment')); 
      return;
    }
    const dialogElement = document.getElementById(`expandpost-${_post_id}`) as HTMLDialogElement;
    dialogElement?.showModal();
  }

  return (
    
    <div className='grid grid-flow-row grid-rows-2 mb-4 backdrop-blur-lg w-full overflow-hidden'>
        <div className='grid grid-flow-col grid-cols-5 py-3 border-t-2 border-x-2'>
            <div className='items-center justify-center align-middle relative'>
                <ProfileIcon imageUrl={userImage} userHandle={userHandle} iconSize={'icon-h'} property={'translate-x-1/2 h-icon-h'}/> 
            </div>
            <div className='grid row-span-3 w-max'>
                <div className='grid grid-flow-col grid-cols-5'>
                    <div className=''>
                        <div>
                            <Link to={`/user/${userHandle}`}>
                            <p className='transition-colors duration-200 hover:animate-gradient-x bg-clip-text hover:text-transparent bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500'>
                                {userHandle}
                            </p>
                            </Link>
                        </div>
                        <div>{dayjs(createdAt as string).fromNow()}</div>
                    </div>
                    
                </div>
            </div>
        </div>
        <div className='pt-3 px-7 border-2'>
           <p className='flex align-middle'>{body}</p>
        </div>
        <div className='flex flex-row w-full'>
          <div className='flex flex-row gap-10 items-center border-2 border-t-0 border-r-0 py-3 px-7'>
              <p id={`post-${_post_id}`} className={`
              cursor-pointer flex flex-row gap-2
              ${isLiked ? 'text-red-500' : 'text-white'}
              `}
              onClick={() => {
                handleLike(_post_id)
                {isLiked ? 
                  document.getElementById(`post-${_post_id}`)?.classList.remove('text-red-500')
                    : document.getElementById(`post-${_post_id}`)?.classList.add('text-red-500')}
              }}
              ><FaRegHeart /><span className='-mt-1'>{String(likeCount)}</span></p>
              <p className='cursor-pointer
              flex flex-row gap-2
              '
              ><BiCommentDetail onClick={handleExpandPost}/><span className='-mt-1'>{String(commentCount)}</span></p>
              <div className='-mt-1'>
              {
                (userInfo as User)?.credentials?.handle === userHandle ? (
                  <DeletePost postId={_post_id} onClick={() => {
                    const dialogElement = document.getElementById(`deletePost-${_post_id}`) as HTMLDialogElement;
                    dialogElement?.showModal(); 
                  }}/>
                ) : (null)
                }
              </div>
          </div>
          <div className='px-7 py-5 border-2 border-t-0 border-l-0 w-full'>
            <div className='fixed right-6 bottom-0'>
              <ExpandPost id={_post_id} postId={_post_id} onClick={handleExpandPost}/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Post