import React, { useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { addReply } from '../utils/commentUtils';
import CommentItem from './CommentItem';
import { type Comment, type CommentSectionProps } from '../types';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@/app/context/AuthContext';

export default function CommentSection({ postId, commentsFromDB, onAddComment }: CommentSectionProps) {
  const { callAPI } = useAuth();
  const [authorInput, setAuthorInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>(commentsFromDB?.map((comment) => ({
    ...comment,
      isEditing: false,
      showReplies: false,
      showReplyForm: false,
      replies: []
    })));
    
  const depth = 0;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    

    setIsSubmitting(true);

    const commentPayload = {
      comment: textInput.trim(),
      postId: postId,
    };

    try {
      // API call to save comment
      const response = await callAPI('/comment/addcomment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentPayload),
      });
      
      if (!response.success) {
        throw new Error('Failed to post comment');
      }

      const createdComment: Comment = response.data;
      onAddComment(createdComment);

      // Reset form
      setTextInput('');
    } catch (err) {
      console.error('Error submitting comment:', err);
      // Fallback local update if API is mock/local
      const fallbackComment: any = {
        id: Date.now(),
        ...commentPayload,
      };
      onAddComment(fallbackComment);
      setTextInput('');
    } finally {
      setIsSubmitting(false);
    }
  };
const updateComment = (
    comments: Comment[],
    commentId: number,
    updates: Partial<Comment>
  ): Comment[] => {
    
    return comments.map(comment => {

      if (comment.id === commentId) {
        return {
          ...comment,
          ...updates,
        };
      }

      // Search inside replies
      if (comment.replies?.length) {
        return {
          ...comment,
          replies: updateComment(
            comment.replies,
            commentId,
            updates
          ),
        };
      }

      return comment;
    });
  };

  const findComment = (
    comments: Comment[],
    commentId: number
  ): Comment | undefined => {
    for (const comment of comments) {
      // Check current comment
      if (comment.id === commentId) {
        return comment;
      }

      // Check nested replies
      if (comment.replies?.length) {
        const found = findComment(comment.replies, commentId);

        if (found) {
          return found;
        }
      }
    }

    return undefined;
  };
  const handleLike = async (commentId: number) => {
    
    const comment = findComment(comments, commentId);

    if (!comment) return;
    
    const nextIsLiked = !comment.isLiked;
    const nextLikesCount = nextIsLiked ? comment.likes + 1 : comment.likes - 1;

       
    try {
      const response = await callAPI('/comment/updatecommentlike', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isLiked: nextIsLiked,
          commentId: comment.id
        }),
        credentials: 'include'
      });
      
      setComments(prev =>
        updateComment(prev, commentId, {
          likes: nextLikesCount,
          isLiked: nextIsLiked,
        })
      );

      if (!response.success) {
        throw new Error('Failed to update like status');
      }
    } catch (err) {
      console.error(err);
      // Revert state if backend request fails
      
    }
  };

  const showReplyForm = (commentId: number) => {
    const comment = findComment(comments, commentId);
    if (!comment) return;
    setComments(prev =>
        updateComment(prev, commentId, {
          showReplyForm: !comment.showReplyForm
        })
      );    
    
  }
  const handleReply = async (e:React.FormEvent<HTMLFormElement>, commentId: number) => {
    
    e.preventDefault();

    const comment = findComment(comments, commentId);
    if (!comment) return;
    
    
    const formData = new FormData(e.currentTarget);
    const replyValue = formData.get('reply');
    if (typeof replyValue !== "string") return;
    const parentCommentId = commentId;
    try {
      const response = await callAPI('/comment/addcomment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: postId, 
          commentId: comment.id,
          comment: replyValue
        }),
        credentials: 'include'
      });
      if(!response.success){
        throw Error("Something went wrong.");
      }
      comment.showReplyForm = false;
      const data: Comment = response.data;
      console.log("comment: ", data);
      const newReply: Comment = {
        
        ...data,
        isEditing: false,
        showReplies: false,
        showReplyForm: false,
        replies: [],
        total_replies: 0,
      };
      console.log("P_id", parentCommentId);
      setComments((prevComments) => addReply(prevComments, parentCommentId, newReply));

    } catch (err) {
      console.error(err);

    }
  };

  const handleViewMore = async (commentId: number) => {
    
    const comment = findComment(comments, commentId);
    if (!comment) return;

    if(comment.showReplies){
      setComments(prev =>
        updateComment(prev, commentId, {
          showReplies: false, replies: [] 
        })
      );
      return; 
    }
       
    try {
      const response = await callAPI('/comment/getmorereply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          commentId: comment.id
        }),
        credentials: 'include'
      });
      if(! response.success){
        throw Error("Failed to fetch comments.");
      }
      const data: Comment[] = response.data;
      
      // Immediate UI change

      setComments(prev =>
        updateComment(prev, commentId, {
          showReplies: true, replies: data 
        })
      );
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="mt-10 pt-8 border-t border-slate-200">
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="w-5 h-5 text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-900">
          Comments ({comments?.length})
        </h2>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Leave a comment
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-slate-100 rounded-full text-slate-500">
                    <User className="w-4 h-4"/>
                  </div>
                  <span className="font-semibold text-slate-800 text-sm">Author name</span>
                </div>
          <div>
            <textarea
              rows={3}
              placeholder="Write your thoughts..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {Object.keys(comments).length === 0 ? (
          <p className="text-slate-500 italic text-sm">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              depth={depth}
              comment={comment}
              setComments={setComments}
              updateComment={updateComment}
              handleReply={handleReply}
              handleLike={handleLike}
              handleViewMore={handleViewMore}
              showReplyForm={showReplyForm}
              setTextInput={setTextInput}
              textInput={textInput}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
         ))
        )
        }
      </div>
    </section>
  );
}