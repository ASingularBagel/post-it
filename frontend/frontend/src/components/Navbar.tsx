import React from 'react';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

// Redux 
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setEditUser } from '../redux/features/ui/uiSlice';

// Components
import ProfileIcon from './ProfileIcon';
import EditDetails from './EditDetails';
import CreatePost from './CreatePost';
import ConfirmLogout from './ConfirmLogout';
import NotificationProp from './Notification';
import MarkAllRead from './MarkAllRead';

// Interfaces
import User from '../interfaces/User';
import Notification from '../interfaces/Notification';

// Icons
import { FaRegBell } from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.user.loading);
  const { userInfo, loading } = useSelector((state: RootState) => state.user);

  const handleOpen = () => {
    dispatch(setEditUser(true));
  }
  const shownNotifications = (userInfo as User).notifications?.filter(notification => notification.read === false);
    return (
      <>
        <div className="fixed -inset-1 rounded-md bg-gradient-to-br from-pink-500 via-cyan-500 to-violet-500 h-[4.6rem] z-[19]">
        </div>
        <div className='fixed top-0 navbar bg-general-bg px-3 z-20'>
            {/* Left hand side */}
            <div className="navbar-start">
            <p>V.1.0.0</p>
            </div>

            {/* Middle portion */}
            <div className="navbar-center">
              <a className="text-xl">Post it !</a>
            </div>

            {/* Right hand side */}
            <div className="navbar-end gap-5 md:gap-5 sm:gap-2">
              <Link to={'/'}>
                <button className='btn btn-ghost px-4'>
                  Home
                </button>
              </Link>
              
              {isAuthenticated ? (
                <div className='flex flex-row gap-10 justify-end'>
                  <div className='flex flex-row gap-2 mr-2'>
                    <div>
                      <div className='btn btn-ghost'
                      onClick={() => {
                        const dialogElement = document.getElementById('createNewPost') as HTMLDialogElement;
                        dialogElement?.showModal(); 
                      }}
                      >
                      <CreatePost />
                      </div>
                    </div>
                    <div className='dropdown dropdown-end'>
                      <div className='btn btn-ghost rounded-full text-xl relative'
                      role='button'
                      tabIndex={0}
                      >
                        {shownNotifications?.length > 0 && <span className='
                        absolute bg-violet-500 rounded-full top-3 right-4
                        h-2 w-2
                        '>
                        </span>
                        }
                        <p><FaRegBell /></p>
                      </div>
                      <ul tabIndex={0} className='menu dropdown-content z-[1] rounded-box w-96 max-h-[500px] mt-4 border-2 bg-neutral text-white'>
                        { isLoading ? (
                          <div className='flex items-center justify-center h-24'><span className="loading loading-spinner text-XL text-white"></span></div>
                        ): (
                          <div>
                            {shownNotifications?.length > 0 ? (<MarkAllRead />) : ( <p className='text-center'>No notifications</p>)}
                            <SimpleBar style={{ maxHeight: '400px', marginTop: '50px'}}>
                            {shownNotifications?.map((notification : Notification, index) => (
                                <li key={index}><NotificationProp key={index} Notification={notification}/></li>
                            ))}
                            </SimpleBar>
                          </div>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className='-translate-x-6 -translate-y-6 mr-7'>
                    {!loading && 
                    <div className='dropdown dropdown-left'>
                      <div tabIndex={0} role='button'>
                      <ProfileIcon 
                      imageUrl={(userInfo as User).credentials.imageUrl!}
                      property={`h-10 w-10 translate-y-3`}
                      />
                      </div>
                      <ul tabIndex={0} className='dropdown-content menu p-2 backdrop-blur-lg rounded w-52 bg-neutral-950'>
                        <li className='w-full'>
                          <p className='btn btn-ghost'><Link to={`/user/${(userInfo as User).credentials.handle}`}>
                        View profile
                          </Link>
                          </p>
                        </li>
                        <li className='w-full'
                        onClick={() => {
                          const dialogElement = document.getElementById('editUserDetails') as HTMLDialogElement;
                          dialogElement?.showModal(); 
                          handleOpen();
                        }}
                        ><EditDetails /></li>
                        <li className='w-full'
                        onClick={() => {
                          const dialogElement = document.getElementById('logoutUser') as HTMLDialogElement;
                          dialogElement?.showModal(); 
                        }}
                        >
                          <ConfirmLogout />
                        </li>
                      </ul>
                    </div>
                    }
                  </div>
                </div>
              ) : (
                <>
                  <Link to={'/signup'}>
                    <button className='btn btn-ghost btn-square px-10'>
                      Signup
                    </button>
                  </Link>

                  <Link to={'/login'}>
                    <button className='btn btn-ghost btn-square px-8'>
                      Login
                    </button>
                  </Link>
                </>
              )}
            </div>
        </div>

      </>
    )
  
}

export default Navbar