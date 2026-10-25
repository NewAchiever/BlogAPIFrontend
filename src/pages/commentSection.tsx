import React, { useState } from 'react';
import { Heart, Reply, MessageSquare, Send, User, ChevronDown } from 'lucide-react';
import { addReply } from './commentUtils';
import CommentComponent from './commentComponent';
import { type Comment, type CommentSectionProps } from './types';
import { API_BASE_URL } from '../config/api';
export function CommentSection({ postId, commentsFromDB, onAddComment }: CommentSectionProps) {
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
    console.log("Clciked");

    setIsSubmitting(true);

    const commentPayload = {
      comment: textInput.trim(),
      postId: postId,
    };
    console.log(commentPayload);
    try {
      // API call to save comment
      const response = await fetch(`${API_BASE_URL}/comment/addcomment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      console.log(response);
      const createdComment: Comment = await response.json();
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
      // Found the comment
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
      const response = await fetch(`${API_BASE_URL}/comment/updatecommentlike`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isLiked: nextIsLiked,
          commentId: comment.id
        }),
        credentials: 'include'
      });
      // Immediate UI change
      /*
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId
            ? { ...comment, likes: nextLikesCount, isLiked: nextIsLiked }
            : comment
        )
      )
      */
      setComments(prev =>
        updateComment(prev, commentId, {
          likes: nextLikesCount,
          isLiked: nextIsLiked,
        })
      );

      if (!response.ok) {
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
      const response = await fetch(`${API_BASE_URL}/comment/addcomment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: postId, 
          commentId: comment.id,
          comment: replyValue
        }),
        credentials: 'include'
      });
      
      const data: Comment = await response.json();
      const newReply: Comment = {
        id: data.id, // Prefer the ID returned by your backend
        author: data.author, // Your current user's username
        comment: replyValue.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        isEditing: false,
        showReplies: false,
        showReplyForm: false,
        replies: [],
        total_replies: 0,
      };
      
      setComments((prevComments) => addReply(prevComments, parentCommentId, newReply));

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }
    } catch (err) {
      console.error(err);
      // Revert state if backend request fails      
    }
  };

  const handleViewMore = async (commentId: number) => {
    
    const comment = findComment(comments, commentId);
    if (!comment) return;
    console.log(comment.showReplies);
    if(comment.showReplies){
      setComments(prev =>
        updateComment(prev, commentId, {
          showReplies: false, replies: [] 
        })
      );
      return; 
    }
       
    try {
      const response = await fetch(`${API_BASE_URL}/comment/getmorereply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          commentId: comment.id
        }),
        credentials: 'include'
      });

      const data: Comment[] = await response.json();
      
      // Immediate UI change

      setComments(prev =>
        updateComment(prev, commentId, {
          showReplies: true, replies: data 
        })
      );
      
      console.log(comments);
      
      if (!response.ok) {
        throw new Error('Failed to update like status');
      }
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
            <CommentComponent
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