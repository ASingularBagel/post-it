import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deletePost } from '../redux/features/user/userSlice';
import { deletePostOptimistic } from '../redux/features/data/dataSlice';
import { ThunkDispatch } from 'redux-thunk';

import { IoTrashBinOutline } from "react-icons/io5";

const DeletePost = ({onClick, postId} : {postId: String, onClick: () => void}) => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const v = useNavigate()

    const handleDeletePost = async () => {
        dispatch(deletePostOptimistic(postId));
        dispatch(deletePost(postId));
    }

  return (
    <div className='w-full'>
        <p className='w-full cursor-pointer' onClick={onClick}><IoTrashBinOutline /></p>
        <dialog id={`deletePost-${postId}`} className={`modal bin-${postId}`}>
        <div className="modal-box border border-white">
            <h3>Confirm delete post ?</h3>
            <h4 className='text-red-500'>This action is irreversible !</h4>
            <div className="modal-action">
            <form method="dialog" className='flex flex-row gap-4 items-center justify-center'>
                <button className="btn" onClick={handleDeletePost}>Confirm</button>
                <button className="btn" >Cancel</button>
            </form>
            </div>
        </div>
        </dialog>
    </div>
  )
}

export default DeletePost