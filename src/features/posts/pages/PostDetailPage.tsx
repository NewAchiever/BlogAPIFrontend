import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart,Bookmark, ArrowLeft, Loader2, User, UserPlus } from 'lucide-react';
import { PATHS } from '@/routes/routes.config';
import CommentSection from '@/features/comments/components/CommentSection';
import {type Comment } from '@/features/comments/types';
import { API_BASE_URL } from "@/config/api";
import { useAuth } from '@/app/context/AuthContext';
import { Navbar } from '../components/Navbar';
export interface BlogPostDetailData {
  id: number;
  title: string;
  username: string;
  content: string;
  cover_image: string;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowed?: boolean;
  comments: Comment[];
}

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<BlogPostDetailData | null>(null);
  const [isPostSaved, setIsPostSaved] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { callAPI, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();
  // 1. Fetch post details and comments from API
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {

        setLoading(true);
        setError(null);

        const response = await callAPI(`/post/getpost/${postId}`,
            {
                credentials: 'include',
            }
        );
        
      if(!response.isSessionActive){
        setUser(null);
        navigate('/login');
      }
      
        if (!response.success) {
          throw new Error(`Failed to load post.`);
        }
        console.log("RESPONSE", response);
        const data: BlogPostDetailData = response.data;
        setPost(data);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading post');
      } finally {
        setLoading(false);
      }
    };
    
    if (postId) {
      fetchPostDetail();
    }

  }, [postId]);

  const handleSave = async() => {
    if (!post) return;
    try{
      const response = await callAPI('/post/updatesavedpost', {
        method: "POST",
        headers: {'Content-Type' : 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          postId: postId,
          isSaved: !post.isSaved
        })
      });
      
      if(!response.isSessionActive){
        setUser(null);
        navigate('/login');
      }
      
      if(response.success){
        setPost({...post, isSaved: !post.isSaved}); 
      }else{
        throw new Error('Failed to update save post.');
      }
    }catch(err){
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    
  }

  // 2. Handle Like Toggle with optimistic UI update
  const handleLike = async () => {
    if (!post) return;
    
    const nextIsLiked = post.isLiked ? false : true;
    const nextLikesCount = nextIsLiked ? post.likes + 1 : post.likes - 1;
    
    // Immediate UI update
    setPost({ ...post, likes: nextLikesCount, isLiked: nextIsLiked });
  
    try {
      const response = await callAPI('/post/updatepostlike', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  
          isLiked: nextIsLiked,
          postId: post.id
        }),
        credentials: 'include'
      });
      
      if(!response.isSessionActive){
        setUser(null);
        navigate('/login');
      }
      
      if (!response.success) {
        throw new Error('Failed to update like status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPost({ ...post, likes: post.likes, isLiked: post.isLiked });
    }
  };

  // 3. Handle comment added callback
  const handleAddComment = (newComment: Comment) => {
    if (!post) return;
    setPost({
      ...post,
      comments: [newComment, ...post.comments],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-slate-600 font-medium">Loading post details...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Unable to render post</h2>
          <p className="text-slate-600 mb-6">{error || 'Post not found'}</p>
          <Link
            to={PATHS.BLOG}
            className="inline-flex items-center space-x-2 text-indigo-600 font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all posts</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-10">
        {/* Back Link */}
        <Link
          to={PATHS.BLOG}
          className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to blog posts</span>
        </Link>

        {/* Post Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Metadata Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-slate-100 text-sm">
          <div className="flex items-center flex-row space-x-2">
            <div className='h-10 w-10 rounded-full overflow-hidden'>
              <img
                src={post.cover_image || undefined}
                crossOrigin="use-credentials"
                alt='coverPic'
                className='h-full w-full object-cover'
              />   
            </div>

            <div className='flex flex-col gap-1'>
              <span className="font-semibold text-left text-md pl-1 text-slate-700 capitalize">{post.username}</span>
              <button
                className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                  post.isFollowed
                    ? 'bg-rose-50 text-rose-600 font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <div className='flex flex-row items-center gap-1 text-xs'>
                  <UserPlus className={`h-3 w-3 inline ${post.isFollowed ? 'fill-current' : ''}`} />
                  <span>Follow</span>
                </div>
              </button>
            </div>

            
          </div>
          <div className='flex flex-row gap-2'>
            <button
              onClick={handleSave}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-colors ${
                post.isSaved
                  ? 'bg-rose-50 text-rose-600 font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-current' : ''}`} />
              <span>Save</span>
            </button>
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-colors ${
                post.isLiked
                  ? 'bg-rose-50 text-rose-600 font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes} Likes</span>
            </button>
          </div>
        </div>
        <Navbar handleLike={handleLike}
                handleSave={handleSave}
                isSaved={post.isSaved}
                isLiked={post.isLiked}
                likes={post.likes}
                title={post.title}
                author={post.username}
          />
        <div className='my-8'>
          <img
            src={post.cover_image || undefined}
            crossOrigin="use-credentials"
            alt='coverPic'
            className='w-full'
          />   
        </div>
        

        {/* Main Body */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 mb-8">
          {post.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Embedded Comment Section */}
        <CommentSection
          postId={post.id}
          commentsFromDB={post.comments}
          onAddComment={handleAddComment}
        />
      </article>
    </div>
  );
}