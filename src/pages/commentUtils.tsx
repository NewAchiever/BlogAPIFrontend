export const addReply = (
    comments: Comment[],
    parentId: number,
    newReply: Comment
  ): Comment[] => {
    console.log("comments", comments);
    console.log("comments", parentId);
    return comments.map((comment) => {
      // We found the parent
      if (comment.id === parentId) {
        if(comment.total_replies){
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };  
        }        
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

