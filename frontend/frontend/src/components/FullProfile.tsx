import React, { useEffect } from 'react'

// Components
import Post from './Post'


// Interfaces
import User from '../interfaces/User'
import PostType from '../interfaces/Post'
import SimpleBar from 'simplebar-react'
import ProfileIcon from './ProfileIcon'


// Redux
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { ThunkDispatch } from 'redux-thunk'


// Functions 
import { viewingOtherProfile, viewingOwnProfile, setViewedUser } from '../redux/features/ui/uiSlice'
import { useParams } from 'react-router-dom'

const FullProfile = ({user, posts} : {user : User | undefined, posts: PostType[]}) => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const currentUser = useSelector((state: RootState) => state.user.userInfo as User)
    const { handle } = useParams<{ handle: string }>();

    useEffect(() => {
        dispatch(setViewedUser(handle));
        if (currentUser?.credentials?.handle === user?.handle) {
            dispatch(viewingOwnProfile(true))
            dispatch(viewingOtherProfile(false))
        } else {
            dispatch(viewingOwnProfile(false))
            dispatch(viewingOtherProfile(true))
        }
    }, [currentUser])
  return (
    <div className=''>
        <div className='h-44 w-full'>
            <div className='flex flex-start gap-44'>
                <div>
                    <ProfileIcon imageUrl={user?.imageUrl} property={' h-44 w-44 '}/>
                </div>
                <div className='ml-10'>
                    <div className='text-3xl font-bold'>{user?.handle}</div>
                    <div className='text-xl mt-5'>{user?.bio ? user?.bio : "This user doesn't have a bio."}</div>
                </div>
            </div>
        </div>
        <div className='posts relative items-center justify-center  border-t-2 border-white'>
            <div className=' mt-2 px-24'>
                { posts?.length > 0 ? ( 
                    <SimpleBar style={{ height: 'calc(75vh - 70px - 20px)' }}>
                    {posts.map((post, index) => (
                        <Post key={index} id={index} 
                        _post_id={post._post_id}
                        userHandle={post.userHandle}
                        userImage={post.userImage}
                        body={post.body}
                        createdAt={post.createdAt}
                        likeCount={post.likeCount}
                        commentCount={post.commentCount}
                        />
                    ))}
                    </SimpleBar>
                ) : (
                    <div>This user doesn't have any posts!</div>
                )}
            </div>
        </div>
    </div>
  )
}

export default FullProfile