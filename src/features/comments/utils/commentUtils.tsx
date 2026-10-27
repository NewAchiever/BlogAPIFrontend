import {type Comment} from '../types';

export const addReply = (
    comments: Comment[],
    parentId: number,
    newReply: Comment
  ): Comment[] => {
    
    return comments.map((comment) => {
      // We found the parent
      if (comment.id === parentId) {
         return {
            ...comment,
            replies: [...comment.replies, newReply],
          };      
      }

      // Search inside this comment's replies
      if (comment.replies?.length > 0) {
        return {
          ...comment,
          replies: addReply(comment.replies, parentId, newReply),
        };
      }

      return comment;
    });
  };

