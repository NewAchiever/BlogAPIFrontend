import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../routes/routes.config';
import { type ApiError } from './types';
import { API_BASE_URL } from '../config/api';
// ==========================================
// TYPES & INTERFACES
// ==========================================
interface SavedBlog {
  id: number;
  title: string;
  category: string;
  savedAt: string;
  slug: string;
}

interface FollowedAuthor {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

interface UserProfileState {
  username: string;
  email: string;
  profile_pic: File | undefined;
  profile_pic_url: string;
}

// ==========================================
// COMPONENT
// ==========================================
export const UserProfilePage: React.FC = () => {
  // Mock initial data states
  const [profile, setProfile] = useState<UserProfileState>({
    username: "",
    email: "",
    profile_pic: undefined,
    profile_pic_url: ""
  });

  const [savedBlogs, setSavedBlogs] = useState<SavedBlog[]>([]);

  const [followedAuthors, setFollowedAuthors] = useState<FollowedAuthor[]>([
    { id: 'a1', name: 'Sarah Connor', handle: '@sconnor_codes', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80' },
    { id: 'a2', name: 'John Doe', handle: '@johndoe_dev', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80' },
    { id: 'a3', name: 'Emily Watson', handle: '@emily_ui', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&q=80' },
  ]);

  // Form edit states
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<UserProfileState>({
    username: "",
    email: "",
    profile_pic: undefined,
    profile_pic_url: ""
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Active sub-tab state ('saved' | 'authors')
  const [activeTab, setActiveTab] = useState<'saved' | 'authors'>('saved');
  const navigate = useNavigate();
  // Loading User profile
   useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          setLoading(true);
          // Replace with your actual backend endpoint
          const response = await fetch(`${API_BASE_URL}/user/getuserprofile`,{
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
          const data: any = await response.json();
          setProfile(data.user);
          setSavedBlogs(data.savedPosts)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    }, []);
  
  // Unified input management for personal details form
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(String(value) !== "") setEditForm((prev) => ({ ...prev, [name]: value }));
    
  };

  // Profile Picture Upload simulator
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setProfile((prev:UserProfileState) => ({ ...prev, profile_pic: file, profile_pic_url: localUrl }));
      setEditForm((prev:UserProfileState) => ({ ...prev, profile_pic: file, profile_pic_url: localUrl }));
    }
  };

  // Handle personal information submit updates
  const handleSaveProfile = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData();
    
    Object.entries(editForm).forEach(([key, value]) => {
      if (value instanceof File) {
          formData.append(key, value);
      } else {
          if(profile?.[key as keyof typeof profile] !== value && String(value ?? "").trim() !== ""){
            formData.append(key, String(value));
          }
          
      }
  });

    try{
      const response = await fetch(`${API_BASE_URL}/user/updateuserprofile`, {
          method: 'POST',
          credentials: 'include', 
          body: formData,
        });
      if(response.status === 200){
        //navigate(0);
        console.log(response.json()) ;
      }
      if (! (response.status === 200)) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }
       

      const profile: UserProfileState = await response.json();

      setTimeout(() => {

        setProfile({ ...profile });
        setIsEditingProfile(false);
        setIsSaving(false);

      }, 800);
      
    }catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }finally {
      setLoading(false);
    }   
  };

  // Remove a bookmark from the saved feed list state array
  const handleUnsaveBlog = async (id: number) => {
    try{
      const response = await fetch(`${API_BASE_URL}/public/posts/handle_save_post`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            postId: id,
            isSaved: false
        })
      })
      if(response.status === 200){
        setSavedBlogs((prev) => prev.filter((blog) => blog.id !== id));
      }else{
        throw new Error('Failed to update save post.');
      }
      

    }catch(err){
      console.log(err);
    }
    
  };

  // Sever connection following with a creator
  const handleUnfollowAuthor = (id: string) => {
    setFollowedAuthors((prev) => prev.filter((author) => author.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Profile Card Header Top Box Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            
            {/* Left: Avatar Upload, Username, Email Display Block */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left w-full">
              <div className="relative group">
                <img 
                  src={profile?.profile_pic_url} 
                  alt="User Avatar Profile Banner" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                />
                {isEditingProfile ? (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    Change Photo
                    <input type="file" name="profile_pic" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
                  </label>
                ):(<></>)}
                
              </div>
              
              <div className="flex-1">
                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-3 max-w-md mt-2">
                    <div>
                      <label htmlFor="username" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Username</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={editForm.username}
                        placeholder={profile?.username}
                        onChange={handleProfileInputChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editForm.email}
                        placeholder={profile?.email}
                        onChange={handleProfileInputChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium disabled:opacity-50 transition-colors"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm({ ...profile });
                          setIsEditingProfile(false);
                        }}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">@{profile?.username}</h1>
                    <p className="text-gray-500 text-sm mt-0.5">{profile?.email}</p>
                    <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start text-xs text-gray-500">
                      <span>📚 **{savedBlogs.length}** Saved Articles</span>
                      <span>👥 **{followedAuthors.length}** Following</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quick Action Buttons (Edit Profile & Change Password Anchor) */}
            {!isEditingProfile && (
              <div className="flex sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="flex-1 md:flex-initial text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => alert('Redirecting to password update workspace component layout module...')}
                  className="flex-1 md:flex-initial text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Change Password
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Tab Interface Navigation Strip Container */}
        <div className="border-b border-gray-200 mb-6 flex gap-6">
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'saved' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Saved Blogs ({savedBlogs.length})
          </button>
          <button
            onClick={() => setActiveTab('authors')}
            className={`pb-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'authors' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Followed Authors ({followedAuthors.length})
          </button>
        </div>

        {/* Tab Feed Content View Window Block */}
        <div>
          {activeTab === 'saved' ? (
            <div className="space-y-4">
              {savedBlogs.length > 0 ? (
                savedBlogs.map((blog) => (
                  <div key={blog.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between gap-4 transition-all hover:border-gray-300">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-2 truncate hover:text-blue-600 cursor-pointer">
                        {blog.title}
                      </h3>
                      
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUnsaveBlog(blog.id)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors shrink-0"
                    >
                      Unsave
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200 text-gray-400">
                  <p className="text-sm">You haven\'t saved any blog posts yet.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {followedAuthors.length > 0 ? (
                followedAuthors.map((author) => (
                  <div key={author.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center transition-all hover:border-gray-300">
                    <img 
                      src={author.avatarUrl} 
                      alt={author.name} 
                      className="w-16 h-16 rounded-full object-cover border border-gray-100 mb-3 shadow-xs"
                    />
                    <h3 className="text-sm font-bold text-gray-900">{author.name}</h3>
                    <p className="text-xs text-gray-400 mb-4">{author.handle}</p>
                    <button
                      type="button"
                      onClick={() => handleUnfollowAuthor(author.id)}
                      className="w-full text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
                    >
                      Unfollow
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200 text-gray-400">
                  <p className="text-sm">You aren\'t following any authors yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
