import React, { useState, useEffect } from 'react'

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {ThunkDispatch} from "@reduxjs/toolkit";
import { createPost, clearError } from '../redux/features/user/userSlice'
import { createPostOptimistic } from '../redux/features/data/dataSlice';

const CreatePost = ({onClick} : {onClick?: () => void}) => {
    const [post, setPost] = useState<String>('');

    const [errors, setErrors] = useState<{error : String}>({error: ''})

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const isLoading = useSelector((state: RootState) => state.ui.isLoading);
    const userError = useSelector((state: RootState) => state.user.error);

    const viewingOwnProfile = useSelector((state: RootState) => state.ui.isViewingOwnProfile);
    const viewingOtherProfile = useSelector((state: RootState) => state.ui.isviewingOtherProfile)
    const viewedUser = useSelector((state: RootState) => state.ui.viewingUser)

    const handleCreatePost = () => {
        event?.preventDefault()

        try{
            // Takes parameters to ensure the right component is refreshed and rendered upon post creation
            dispatch(createPost({ postData: post, viewingOwnProfile, viewingOtherProfile, viewedUser }));
        } catch( error ) {
            setErrors(error)
        }
    }

    const handleChange = (event) => {
        dispatch(clearError()); 
        setErrors({error : ''})
        const { value } = event?.target;
        setPost(value);
    }

    const handleCancel = () => {
        setPost(''); 
        dispatch(clearError()); 
        setErrors({error : ''})
    }

    useEffect(() => {
        if (userError !== null) setErrors({error: String(userError) || '' })
    }, [userError])

  return (
    <div className='w-full'>
        <p className='w-full' onClick={onClick}>New Post</p>
        <dialog id="createNewPost" className="modal">
        <div className="modal-box border border-white">
            {isLoading ? (
                <div className='w-52 h-80 relative'>
                    <div className='absolute w-full top-[130px] left-[130px]'>
                        <span className="loading loading-spinner loading-lg text-white"></span>
                    </div>
                </div>
            ): (
            <div>
                <div className='mb-4'>
                <h2 className='font-bold text-xl mb-2'>Hello !</h2>
                <p>You're about to create a new post.</p>
                </div>
                <div className='mb-2 text-red-500'>{errors && errors.error}</div>
                <div>
                    <textarea name="post" id="post" cols={50} rows={10}
                    className='textarea textarea-bordered'
                    placeholder='Make it something great !'
                    onChange={handleChange}
                    ></textarea>
                </div>
                <div className="modal-action">
                <form method="dialog" className='flex flex-row gap-4 items-center justify-center'>
                    <button className="btn" onClick={handleCreatePost}>Confirm</button>
                    <button className="btn" onClick={handleCancel}>Cancel</button>
                </form>
                </div>
            </div>
            )}
        </div>
        </dialog>
    </div>
  )
}

export default CreatePost