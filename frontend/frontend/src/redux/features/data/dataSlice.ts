import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../../axiosConfig';

import Post from '../../../interfaces/Post';
import User from '../../../interfaces/User';
import Comment from '../../../interfaces/Comment';
import { fetchUserInfo, setLikes } from '../user/userSlice';
import { RootState } from '../../store';

export const fetchPosts = createAsyncThunk(
  'data/fetchPosts',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`/posts`);
      dataSlice.actions.fetchPosts(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchPost = createAsyncThunk(
  'data/fetchPost',
  async (postId: String, thunkAPI) => {
    const token = localStorage.getItem('FBIdToken');
    thunkAPI.dispatch(setLoading(true));
    if ( token ) {
      try {
        const response = await axios.get(`/post/${postId}`, {
          headers: {
            Authorization: token,
          },
        });
        thunkAPI.dispatch(setPostData(response.data));
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
    thunkAPI.dispatch(setLoading(false));
  }
)

export const getPostData = (state: RootState) => state.data.postData;

export const likePost = createAsyncThunk(
  'data/likepost', 
  async (postId : String, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = localStorage.getItem('FBIdToken');
    
    if ( token ) {
      const optimisticUpdate = () => {
        const optimisticLikes = [...((state.user.userInfo as User).likes), { postId, userHandle: (state.user.userInfo as User).credentials.handle }];
        dispatch(setLikes(optimisticLikes));
        dispatch(dataSlice.actions.incrementLikeCount({ postId })); 
      };
      optimisticUpdate();
      try {
        const response = await axios.get(`/post/${postId}/like`, {
          headers: {
            Authorization: token,
          },
        });
        
        return response.data;
      } catch (error) {
        console.error(error);
  
        dispatch(fetchUserInfo());
        dispatch(dataSlice.actions.decrementLikeCount(postId)); 
        return rejectWithValue(error.response.data);
      }
    } else {
      return rejectWithValue('failed-like')
    }
  }
);

export const unlikePost = createAsyncThunk(
  'data/unlikePost',
  async (postId: String, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = localStorage.getItem('FBIdToken');

    if ( token ) {
      const optimisticUpdate = () => {
        const optimisticLikes = ((state.user.userInfo as User).likes).filter(like => like.postId !== postId);
        dispatch(setLikes(optimisticLikes));
        dispatch(dataSlice.actions.decrementLikeCount({ postId })); 
      };
      optimisticUpdate();
      try {
        const response = await axios.get(`/post/${postId}/unlike`, {
          headers: {
            Authorization: token,
          },
        });
        
        return response.data;
      } catch (error) {
        console.error(error);
  
        dispatch(fetchUserInfo());
        dispatch(dataSlice.actions.incrementLikeCount(postId));
        return rejectWithValue(error.response.data);
      }
    } else {
      return rejectWithValue('failed-like')
    }
  }
)

export const addComment = createAsyncThunk(
  'data/addComment', 
  async({postId, comment} : {postId: String, comment: String}, { getState, dispatch, rejectWithValue }) => {
    const token = localStorage.getItem('FBIdToken');
    const state = getState() as RootState; 
    dispatch(setLoading(true))

    if ( token ) {
      try {
        const optimisticUpdate = () => {
          const optimisticComments = [{ 
            body: comment, 
            createdAt: new Date().toISOString(), 
            userHandle: (state.user.userInfo as User).credentials.handle, 
            userImage: (state.user.userInfo as User).credentials.imageUrl, 
            postId 
          }];
          dispatch(setPostData({ ...state.data.postData, comments: [...(state.data.postData.comments || []), ...optimisticComments] }));
          dispatch(dataSlice.actions.incrementCommentCount({ postId }));
        }
        optimisticUpdate();

        const response = await axios.post(`/post/${postId}/comment`, { body: comment }, {
          headers: {
            Authorization: token,
          },
        });

        const newComment = {
          body: response.data.body,
          createdAt: response.data.createdAt,
          userHandle: response.data.userHandle,
          userImage: response.data.userImage,
          postId: response.data.postId,
        } as Comment;

        dispatch(setLoading(false));
        dispatch(fetchPost(postId));

        return newComment;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  }
)

export const getUserData = createAsyncThunk(
  'data/getUserData', 
  async({userHandle} : {userHandle : string}, { dispatch, rejectWithValue }) => {
    // Does not require user to be logged in 
    dispatch(setLoading(true)); 
    try {
      const res = await axios.get(`/user/${userHandle}`);
      const userData = res.data.user;
      dispatch(setPosts(res.data.posts));
      return userData;
    } catch (error) {
      console.log(error)
      dispatch(setError(error.response.data));
      rejectWithValue(error.response.data)
    }
  }
)

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    posts: [] as Post[],
    postData: {} as Post,
    loading: false,
    error: null,
  },
  reducers: {
    setPostData: (state, action) => {
      state.postData = action.payload
    }, 
    setPosts: (state, action) => {
      state.posts = action.payload;
    }, 
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    incrementLikeCount: (state, action: PayloadAction<{ postId: String }>) => {
      const post = state.posts.find(post => post._post_id === action.payload.postId);
      if (post) {
        post.likeCount = Number(post.likeCount) + 1;
      }
    },
    decrementLikeCount: (state, action: PayloadAction<{ postId: String }>) => {
      const post = state.posts.find(post => post._post_id === action.payload.postId);
      if (post) {
        post.likeCount = Number(post.likeCount) - 1;
      }
    },
    incrementCommentCount: (state, action: PayloadAction<{ postId: String }>) => {
      const post = state.posts.find(post => post._post_id === action.payload.postId);
      if (post) {
        post.commentCount = Number(post.commentCount) + 1;
      }
    },
    decrementCommentCount: (state, action: PayloadAction<{ postId: String }>) => {
      const post = state.posts.find(post => post._post_id === action.payload.postId);
      if (post) {
        post.commentCount = Number(post.commentCount) - 1;
      }
    },
    fetchPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = [...action.payload];
      console.log(state.posts)
    },
    deletePostOptimistic: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post._post_id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload.reverse();
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.error = action.payload as any;
        state.loading = false;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.postData = action.payload! as Post;
      
        let index = state.posts.findIndex((post: Post) => post._post_id === (action.payload as unknown as Post)!._post_id);
        if (index !== -1) {
          state.posts[index] = action.payload!;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload as any;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.postData = action.payload as any;

        let index = state.posts.findIndex((post: Post) => post._post_id === (action.payload as unknown as Post)!._post_id);
        if (index !== -1) {
          state.posts[index] = action.payload!;
        }
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.error = action.payload as any;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.postData = action.payload as any;
        state.loading = false;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        (state.postData?.comments as Comment[]).unshift(action.payload as Comment);
        setLoading(false); 
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload as any;
        setLoading(false);
      })
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.error = action.payload as any;
        state.loading = false;
      })
  },
});

export const { setPostData, setLoading, setPosts, setError, clearError, incrementLikeCount, decrementLikeCount, deletePostOptimistic } = dataSlice.actions
export default dataSlice.reducer;