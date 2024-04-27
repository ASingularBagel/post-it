import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addComment, fetchPost, setError as setDataError } from '../redux/features/data/dataSlice';
import { ThunkDispatch } from 'redux-thunk';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

import Post from '../interfaces/Post';
import Comment from '../interfaces/Comment';
import User from '../interfaces/User';
import ProfileIcon from './ProfileIcon';
import { setError, setPostModalOpen } from '../redux/features/ui/uiSlice';

import dayjs from 'dayjs'; 
import relativeTime from 'dayjs/plugin/relativeTime'
import { RootState } from '../redux/store';

const ExpandPost = ({onClick, postId, id} : {postId: String, onClick: () => void, id: String}) => {
dayjs.extend(relativeTime)
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const [currentComment, setCurrentComment] = useState<String>('');
    const [errors, setErrors] = useState<{error: String}>({error: ''});

    const isPostOpen = useSelector((state: RootState) => state.ui.isPostModalOpen);
    const isLoading = useSelector((state: RootState) => state.data.loading); 
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    const postData = useSelector((state: RootState) => state.data.postData);

    const v = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const handleExpandPost = async () => {
        try {
            const result = await dispatch(fetchPost(postId))
            setPost(result.payload as Post);
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if ( isPostOpen ) {
            if (!isAuthenticated) {
                dispatch(setDataError('failed-comment'));
                return;
            } else {
            handleExpandPost();
        }
        }
    }, [isPostOpen])

    const handleChange = () => {
        if( !event?.target ) return;

        dispatch(setError('')); 
            setErrors({error: ''})
            
        const { value } = event?.target as HTMLInputElement;
        setCurrentComment(value)
    }

    const handleSubmit = async () => {
        if (currentComment === '') {
            dispatch(setError('comment-empty'));
            setErrors({error: 'Comment cannot be empty !'})
            return;
        }
        try {
            await dispatch(addComment({postId, comment: currentComment}));
            handleExpandPost();
            setCurrentComment('');
        } catch (error) {
            dispatch(setError(error))
            setErrors({error: error})
            console.log(error);
        }
    }
 
  return (
    <div className='w-full'>
        <button className='btn btn-ghost' onClick={() => {
            if (isAuthenticated) {
                (document.getElementById(`expandpost-${id}`) as HTMLDialogElement)
            .showModal();
            dispatch(setPostModalOpen(true));
            } else {
                dispatch(setDataError('failed-comment'));
                return;
            }

        }}>View post</button>
        <dialog id={`expandpost-${id}`} className="modal h-screen ">
        <div className="modal-box border border-white h-max w-1/2 min-w-[530px] max-w-[700px] overflow-hidden">
            {post ? ( 
                <div className=''>
                    <div className='flex flex-col'>
                        <div className='grid grid-flow-col py-3 '>
                            <div className='grid row-span-3 w-max'>
                                <div className='grid grid-flow-col grid-cols-5'>
                                    <div className=''>
                                        <ProfileIcon imageUrl={post?.userImage} userHandle={post?.userHandle} property={'h-icon-h w-icon-w'}/> 
                                    </div>
                                    <div className=''>
                                        <div className=''>
                                            <Link to={`/user/${post?.userHandle}`}>
                                            <p className='transition-colors duration-200 hover:animate-gradient-x bg-clip-text hover:text-transparent bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500'>
                                                {post?.userHandle}
                                            </p>
                                            </Link>
                                        </div>
                                        <div className='text-sm'>{dayjs(post?.createdAt as string).fromNow()}</div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                        <div className='pt-3 flex flex-col mb-3'>
                            <p className='flex align-middle text-2xl'>{post?.body}</p>
                        </div>

                        <div className='border-t-2 flex flex-col gap-4 my-4'>
                            <p className='mt-4'>Add a comment below !</p>
                            <div className='text-red-500'>{errors && errors.error!}</div>
                            <textarea className='textarea textarea-bordered' name="" id="" cols={50} rows={2} onChange={handleChange} defaultValue={currentComment as string}></textarea>
                            <button className='btn w-full' onClick={handleSubmit}>{isLoading ? <span className="loading loading-spinner text-white"></span> : <p>Send it !</p>}</button>
                        </div>
                        <div className='' id='comments'>
                            <p className='border-b-2'>Comments</p>
                            <div className='grid grid-flow-col'>
                                {(post as Post)?.comments?.length! > 0 ? (
                                    <div>
                                        <SimpleBar
                                        style={{ height: '200px', maxWidth: '670px' }}
                                        >
                                        {post?.comments?.map((comment : Comment, index) => (
                                            <div key={index} className={`border-b-2 mt-4
                                            ${(comment).userHandle === post.userHandle ? 'border-violet-500 text-violet-500' : ''}
                                            `}>
                                                <div className='flex flex-row mt-2 px-2 py-3 h-max'>
                                                    <div className='w-max mr-4'>
                                                        <ProfileIcon imageUrl={(comment).userImage} userHandle={(comment).userHandle} property={'h-10 w-10 translate-x-2 mr-2'}/>
                                                    </div>
                                                    <div className='text-left ml-8 h-max px-5'>
                                                        <p className='text-left'>{(comment).body}</p>
                                                        <p className='text-xs mt-4'>{(comment?.userHandle as string)}</p>
                                                        <p className='text-xs'>{dayjs(comment?.createdAt as string).fromNow()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        </SimpleBar>
                                    </div>
                                ) : (
                                    <div className=''>
                                        <p>There are no comments !</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <form method="dialog" className='flex items-center justify-center mt-3'>
                        <button className="btn" 
                        onClick={() => {
                            dispatch(setPostModalOpen(false)); 
                            setCurrentComment('')
                        }}
                        >Close</button>
                    </form>
                </div>
            ) : (
                <div className=''>
                <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}
        </div>
        </dialog>
    </div>
  )
}

export default ExpandPost