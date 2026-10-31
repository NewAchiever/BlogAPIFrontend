import { PATHS } from '@/routes/routes.config';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, User, Loader2 } from 'lucide-react';
import {type Post} from '../types';
import { API_BASE_URL } from '@/config/api';

export default function PostsListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
    // 2. Fetch data from backend on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Replace with your actual backend endpoint
        const response = await fetch(`${API_BASE_URL}/post/getallpost`,{
            method: 'GET',
            credentials: 'include',
        });

        if (response.status === 401) {
            navigate(PATHS.LOGIN, {replace: true});
            return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const data: Post[] = (await response.json()).response;
        
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
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
/*
    try {
      // Sync update with backend
      const response = await fetch(`${API_BASE_URL}/public/posts/get_post`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLiked: nextIsLiked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }
    } catch (err) {
      // Revert optimistic update if API call fails
      console.error(err);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id
            ? { ...post, likes: targetPost.likes, isLiked: targetPost.isLiked }
            : post
        )
      );
    }


    */
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Latest Posts</h1>

        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-row bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <img
                  src={post.cover_image}
                  crossOrigin="use-credentials"
                  alt='coverPic'
                  className='w-32 h-32'
                />   
              </div>
              {/* Title integrated with router config */}
              <div className='w-full'>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 hover:text-indigo-600 transition-colors">
                  <Link to={PATHS.BLOG_DETAIL(post.id)}>
                    {post.title}
                  </Link>
                </h2>
                
                <div className="flex items-center justify-between text-sm text-slate-600 border-t border-slate-100 pt-4">
                  
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-700">{post.author}</span>
                  </div>
                  <span>Excerpt:{post.excerpt}</span>
                  <div className="flex items-center space-x-6">
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
