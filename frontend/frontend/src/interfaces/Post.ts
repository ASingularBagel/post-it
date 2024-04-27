import { immerable } from "immer";

interface PostType {
  _post_id: String;
    body: String; 
    createdAt: String;
    userHandle: String;
    userImage: String;
    likeCount: Number;
    commentCount: Number;
    comments?: [];
  }

export default PostType;