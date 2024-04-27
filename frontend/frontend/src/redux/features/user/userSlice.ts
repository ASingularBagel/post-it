import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import axios from '../../../axiosConfig';
import { RootState } from '../../store';

// Redux
import { setLoading } from '../ui/uiSlice';
import { fetchPosts, getUserData, likePost, unlikePost } from '../data/dataSlice';

// Interfaces
import User from './../../../interfaces/User';
import Post from '../../../interfaces/Post';
import Like from '../../../interfaces/Like'


// Async actions using createAsyncThunk
export const loginUser = createAsyncThunk('user/loginUser', 
async ({email, password}: { email: String, password: String }, { dispatch, rejectWithValue },) => {
  try {
    const response = await axios.post('/login', {email, password});
    const token = `Bearer ${response.data.token}`;
    localStorage.setItem('FBIdToken', token);

    dispatch( fetchUserInfo() )
    return response.data; 
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    // Retrieve the token from localStorage 
    const token = localStorage.getItem('FBIdToken');
    if ( token ) {
      try {
        const response = await axios.get('/user', {
          headers: {
            Authorization: token,
          },
        });
        // Filter response comments which contain the user handle
        return response.data;
        
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  }
);

export const signupUser = createAsyncThunk('user/signupUser', 
  async ({ email, password, confirmPassword, handle} 
    : {email: String, password: String, confirmPassword: String, handle: String}, 
    { dispatch, rejectWithValue }) => {
      try {
        const response = await axios.post("/signup", {email, password, confirmPassword, handle});
        const token = `Bearer ${response.data.token}`;
        localStorage.setItem('FBIdToken', token);

        dispatch( loginUser({email, password}) )
        return response.data;
        
      } catch (error) {
        return rejectWithValue(error.response.data)
      }
  }
)

export const uploadUserProfileImage = createAsyncThunk(
  'user/uploadImage',
  async (imageFile: File, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile, imageFile.name);

      const token = localStorage.getItem('FBIdToken');
      const response = await axios.post('/user/image', formData, {
        headers: {
          Authorization: token,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(fetchUserInfo())
    }
  }
);

export const editUserDetails = createAsyncThunk(
  'user/details', 
  async(userDetails: {bio? : String, website? : String}, {dispatch, rejectWithValue}) => {
    dispatch(setLoading(true));
    // Retrieve the token from localStorage 
    const token = localStorage.getItem('FBIdToken');

    if ( token ) {
      try {
        axios.post('/user', userDetails ,{
          headers: {
            Authorization: token,
          },
        })
        .then(() => {
          dispatch(fetchUserInfo())
        })
  
      } catch(error) {
        return rejectWithValue(error.response.data); 
      }
    }
  }
)

export const createPost = createAsyncThunk(
  'user/createpost', 
  async({ postData, viewingOwnProfile, viewingOtherProfile, viewedUser } 
    : {postData: String, viewingOwnProfile: Boolean, viewingOtherProfile: Boolean, viewedUser: String}, {dispatch, rejectWithValue}) => {
    dispatch(setLoading(true)); 
    // Retrieve the token from localstorage 
    const token = localStorage.getItem('FBIdToken'); 
    if (postData === ''){
      dispatch(setLoading(false))
      dispatch(userSlice.actions.setError('Post cannot be empty !')) 
      rejectWithValue('Failed to create post.')
      return;
    }

    if ( token ) {
      try {
        axios.post('/post', {body: postData}, {
          headers: {
            Authorization: token,
          },
        })
        .then(() => {
          dispatch(fetchUserInfo());
        })
        .then(() => {
          const dialogElement = document.getElementById('createNewPost') as HTMLDialogElement;
              dialogElement?.close(); 
          if ( viewingOtherProfile || viewingOwnProfile) {
            dispatch(getUserData({userHandle: viewedUser as string}))
          } else {
            dispatch(fetchPosts())
          }
        }).then(() => {
          dispatch(setLoading(false))
        })
      } catch ( error ) {
        dispatch(setLoading(false))
        dispatch(userSlice.actions.setError(error.response.data))
        return rejectWithValue(error.response.data);
      }
    }
  }
)

export const deletePost = createAsyncThunk(
  'user/deletepost',
  async(postId: String, {dispatch, rejectWithValue}) => {
    dispatch(setLoading(true)); 
    // Retrieve the token from localstorage 
    const token = localStorage.getItem('FBIdToken'); 

    if ( token ) {
      try {
        axios.delete(`/post/${postId}`, {
          headers: {
            Authorization: token,
          },
        })
        .then(() => {
          dispatch(fetchUserInfo());
        })
        .then(() => {
          
        }).then(() => {
          dispatch(setLoading(false))
        })
      } catch ( error ) {
        return rejectWithValue(error.response.data);
      }
    }
  }
)

export const setNotificationsRead = createAsyncThunk(
  'user/readNotifications', 
  async(notificationIds : String[], {dispatch, rejectWithValue}) => {
    dispatch(setLoading(true)); 
    // Retrieve the token from localstorage
    const token = localStorage.getItem('FBIdToken'); 

    if ( token ) {
      try{
        axios.post('/notifications', notificationIds, {
          headers: {
            Authorization: token,
          },
        })
        .then(() => {
          dispatch(fetchUserInfo()); 
        })
        .then(() => {
          dispatch(setLoading(false)); 
        })
      } catch ( error ) {
        console.log(error.reponse.data)
        return rejectWithValue(error.response.data)
      }
    }
  }
)

export const isPostLikedByUser = (state: RootState, postId: String) => {
  const likes = (state.user.userInfo as User).likes;
  return likes ? likes.some((like) => like.postId === postId) : false;
};

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: {},
    isAuthenticated: false,
    loading: false,
    error: null,

    uploadStatus: 'idle',
    uploadError: {},
  },
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem('FBIdToken');
      delete axios.defaults.headers.common['Authorization'];
      state.userInfo = {};
      state.isAuthenticated = false;
    },
    fetchUserInfo: (state, action) => {
      state.userInfo = action.payload
    },
    setAuthenticationStatus: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setLoadingUser: (state, action) => {
      state.loading = action.payload;
    }, 
    setLikes: (state, action) => {
      (state.userInfo as User).likes = action.payload;
    },
    setError : (state, action) => {
      state.error = action.payload;
    }, 
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as any;
        state.loading = false;
      })
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload; 
        state.loading = false;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.error = action.payload as any;
        state.loading = false;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload as any;
        state.loading = false;
      })
      .addCase(uploadUserProfileImage.pending, (state) => {
        state.uploadStatus = 'loading';
        state.loading = true;
      })
      .addCase(uploadUserProfileImage.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        state.loading = false;
      })
      .addCase(uploadUserProfileImage.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.uploadError = action.payload as any;
        state.loading = false;
      })
      .addCase(editUserDetails.fulfilled, (state, action) => {
        state.loading = false; 
        return action.payload;
      })
      .addCase(editUserDetails.pending, (state) => {
        state.loading = true; 
      })
      .addCase(editUserDetails.rejected, (state, action) => {
        state.loading = false; 
        state.error = action.payload as any;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const newLike: Like = {
          userHandle: (state.userInfo as User)?.credentials?.handle!,
          postId: (action.payload as unknown as Post)?._post_id,
        };
      
        (state.userInfo as User).likes.push(newLike);
        fetchUserInfo()
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const likesIndex = (state.userInfo as User).likes.findIndex(like => (like as Like).postId === (action.payload as unknown as Post)._post_id);
        if (likesIndex !== -1) {
          (state.userInfo as User).likes.splice(likesIndex, 1);
        }
        fetchUserInfo()
      })
      .addCase(setNotificationsRead.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setNotificationsRead.rejected, (state, action) => {
        state.error = action.payload as any;
      })
  },
});

export const { logoutUser, setAuthenticationStatus, setLikes, clearError, setError } = userSlice.actions;

export default userSlice.reducer;