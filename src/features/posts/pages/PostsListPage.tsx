import { PATHS } from '@/routes/routes.config';
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, User, Loader2 } from 'lucide-react';
import {type Post} from '../types';
import { useAuth } from '@/app/context/AuthContext';
import usePageTitle from '@/shared/hooks/usePageTitle';
export default function PostsListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { callAPI, user, setUser, setIsLoggedIn } = useAuth(); 
  usePageTitle('Home');
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await callAPI('/post/getallpost',{
            method: 'GET',
            credentials: 'include',
        });

        if(!response.isSessionActive){
          setUser(null);
        }

        if(!response.success){
          throw new Error('Failed to fetch posts.');
        }
        const data: Post[] = response.data;
        
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
        if (location.state?.showWelcome) {
            setShowWelcome(true);

            navigate(location.pathname, {
                replace: true,
                state: null
            });
        }
    }, [location, navigate]);
  // 3. Optimistic Like handler with API synchronization
  const handleLike = async (id: number) => {
    const targetPost = posts.find((p) => p.id === id);
    if (!targetPost) return;

    const nextIsLiked = !targetPost.isLiked;
    const nextLikesCount = nextIsLiked ? targetPost.likes + 1 : targetPost.likes - 1;

    // Optimistic UI Update: update state immediately for snappy UX
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, likes: nextLikesCount, isLiked: nextIsLiked } : post
      )
    );

  };

  // 4. Render Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-slate-600 font-medium">Loading posts...</span>
      </div>
    );
  }

  // 5. Render Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md text-center">
          <h2 className="text-lg font-bold mb-1">Error Loading Content</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      { showWelcome && ( 
        <span>Welcome, <span className='capitalize'>{user?.username}</span>!<br/> We're glad to have you back.</span>
        
      )}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Latest Posts</h1>

        <div className="space-y-4">
          {posts.map((post) => (
            <Link to={PATHS.BLOG_DETAIL(post.id)}>
            <article
              key={post.id}
              className="flex flex-row gap-7 my-3 bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className='w-64 h-32'>
                <img
                  src={post.cover_image || undefined}
                  crossOrigin="use-credentials"
                  alt='coverPic'
                  className='h-full w-full object-cover'
                />   
              </div>
              
              <div className='w-full'>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 hover:text-indigo-600 transition-colors">
                  
                    {post.title}
                  
                </h2>
                
                <div className="flex items-center  text-sm text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-700">{post.author}</span>
                  </div>
                  <span>Excerpt:{post.excerpt}</span>
                </div>
                <div className="flex items-center space-x-6 mt-auto">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1.5 transition-colors ${
                        post.isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                      }`}
                      aria-label="Like post"
                    >
                      <Heart
                        className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`}
                      />
                      <span className="font-medium">{post.likes}</span>
                    </button>

                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-medium">{post.comments}</span>
                    </div>
                  </div>
              </div>
              
            </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
