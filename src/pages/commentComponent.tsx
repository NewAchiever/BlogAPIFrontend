import { Heart, Reply, MessageSquare, Send, User, ChevronDown } from 'lucide-react';
import { type Comment, type commentComponentProps } from './types';



export default function CommentComponent({ 
    depth,
    comment,
    updateComment,
    setComments, 
    handleLike,
    handleReply,
    handleViewMore,
    showReplyForm,
    setTextInput,
    textInput,
    isSubmitting,
    setIsSubmitting
}: commentComponentProps) {
  const indent = "ml-" + depth;
  return(
    <>
            <div key={comment.id} className={`${indent} bg-white p-4 rounded-lg border border-slate-100 shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-slate-100 rounded-full text-slate-500">
                    <User className="w-4 h-4"/>
                  </div>
                  <span className="font-semibold text-slate-800 text-sm">{comment.author}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600 text-sm pl-2 text-left leading-relaxed">{comment.comment}</p>
              <div className='flex flex-row gap-4'>
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-colors ${
                    comment.isLiked
                      ? 'bg-rose-50 text-rose-600 font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                  <span>{comment.likes} Likes</span>
                </button>
                <button
                  onClick={() => showReplyForm(comment.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-colors  
                    bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
                <button
                  onClick={() => handleViewMore(comment.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-colors ${
                    comment.isLiked
                      ? 'bg-rose-50 text-rose-600 font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ChevronDown className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                  <span>{comment.total_replies} Replies</span>
                </button>
              </div>  
            </div>
            <div className={`${indent} border-l-1 border-l-gray-300`}>
            {comment.showReplyForm && (
              <form key={comment.id} onSubmit={(e) => handleReply(e, comment.id)} className={`ml-4 my-4 w-full bg-slate-50 p-2 sm:p-6 rounded-xl border border-slate-200`}>
                
                <div className={`space-y-3`}>
                  <div className="flex items-center space-x-1">
                          <div className="p-1.5 bg-slate-100 rounded-full text-slate-500">
                            <User className="w-4 h-4"/>
                          </div>
                          <span className="font-semibold text-slate-800 text-sm">Author name</span>
                        </div>
                  <div className='flex flex-row gap-2'>
                    <textarea
                      rows={1}
                      placeholder="Write your thoughts..."
                      value={textInput}
                      name='reply'
                      onChange={(e) => setTextInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Replying...' : 'Reply'}</span>
                    </button>
                  </div>
                  
                </div>
                
              </form>
            )}
            <div className="space-y-4">
              {comment.showReplies && comment.replies?.map(reply => (
                <CommentComponent
                  depth={4}
                  comment={reply}
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
              ))}
              </div>
            </div>
            </>
  )
}
