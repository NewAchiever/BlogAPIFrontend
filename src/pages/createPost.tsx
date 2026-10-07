import React, { useState } from 'react';

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface PostFormState {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: File | null;
  tags: string;
  isPublished: boolean;
}

// ==========================================
// COMPONENT
// ==========================================
export const CreatePostPage: React.FC = () => {
  // Local form state initialized with empty defaults
  const [formData, setFormData] = useState<PostFormState>({
    title: '',
    slug: '',
    category: 'Technology',
    excerpt: '',
    content: '',
    coverImage: null,
    tags: '',
    isPublished: false,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper function to turn strings into clean SEO-friendly URLs
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')         // Replace spaces with hyphens
      .replace(/-+/g, '-');         // Remove consecutive hyphens
  };

  // Unified change handler for text inputs, select options, and checkboxes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        // Mirror changes to the URL slug input automatically when updating the Title field
        if (name === 'title') {
          updated.slug = generateSlug(value);
        }
        return updated;
      });
    }
  };

  // Convert raw local file uploads into accessible DOM browser URLs for the preview column
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, coverImage: file }));
    }
  };

  // Reset the file selector view
  const clearCoverImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: null }));
  };

  // Mock Form Submit handling
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("formData", formData);
    const blogData = new FormData(e.currentTarget);

    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
          blogData.append(key, value);
      } else {
          blogData.append(key, String(value));
      }
  });
    const response = await fetch('http://localhost/blog_api/public/add_post',{
      method: 'POST',
      credentials: 'include',
      body: blogData
    });

    if(response.status === 200){
      console.log("Post Created");
    }
    else{
      console.log(response);
    }
    // Mock an external server latency window
    setTimeout(() => {
      console.log('Successfully Compiled Blog Post Data Object Payload:', formData);
      //alert(formData.isPublished ? '🎉 Post published successfully!' : '💾 Draft saved successfully!');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Top Header Section */}
        <div className="border-b border-gray-200 pb-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create New Post</h1>
            <p className="mt-2 text-sm text-gray-600">Draft, preview, and publish your latest thoughts to the blog.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              form="create-post-form"
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Saving...' : formData.isPublished ? 'Publish Post' : 'Save Draft'}
            </button>
          </div>
        </div>

        {/* Workspace Layout Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Editor Form Panel */}
          <div className="lg:col-span-7 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <form id="create-post-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title Form Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Post Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Understanding Tailwind Custom Layout Systems"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* URL Slug & Category Selection Subgrid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="auto-generated-slug"
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Cover Image Drag/Upload Element Container */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                {formData.coverImage ? (
                  <div className="relative rounded-md overflow-hidden border border-gray-200">
                    <img src={formData.coverImage} alt="Uploaded form banner" className="w-full h-44 object-cover" />
                    <button
                      type="button"
                      onClick={clearCoverImage}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-xs transition-colors shadow"
                      title="Remove Cover Image"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors bg-gray-50">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h16a4 4 0 004-4V12a4 4 0 00-4-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 26l7-7 7 7M34 38l-4-4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a cover photo</span>
                          <input id="file-upload" name="file-upload" type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Excerpt Meta Field with Counter */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Short Excerpt</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={2}
                  maxLength={160}
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Provide a brief summary for card decks and SEO modules..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <p className="text-right text-xs text-gray-400 mt-1">{formData.excerpt.length}/160 characters</p>
              </div>

              {/* Main Text Content Input Panel Area */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Body Content</label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={10}
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your beautiful post here..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm leading-relaxed"
                />
              </div>

              {/* Multi-Tag Entry Input */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="react, tailwind, programming"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Publish State Flag Toggle Wrapper */}
              <div className="flex items-start border-t border-gray-100 pt-5">
                <div className="flex items-center h-5">
                  <input
                    id="isPublished"
                    name="isPublished"
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isPublished" className="font-medium text-gray-700 cursor-pointer selection:bg-transparent">Publish immediately</label>
                  <p className="text-gray-500">If left unchecked, this post will default straight into your secure drafts folder.</p>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column Window Pane: Sticky Card Output Preview Engine */}
          <div className="lg:col-span-5">
            <div className="sticky top-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Live Feed Preview</h2>
              
              {/* Layout Presentation Mock Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
                {formData.coverImage ? (
                  <img src={formData.coverImage} alt="Cover preview card mockup" className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 border-b border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-1">
                    <svg className="w-8 h-8 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
                    </svg>
                    <span className="text-xs">No cover image uploaded</span>
                  </div>
                )}
                
                <div className="p-6">
                  {/* Category Pill Tag */}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mb-3">
                    {formData.category}
                  </span>

                  {/* Title Element Rendering */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 break-words leading-tight">
                    {formData.title || <span className="text-gray-300 italic">Untitled Blog Entry</span>}
                  </h3>

                  {/* Summary / Excerpt Element Rendering */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 break-words">
                    {formData.excerpt || <span className="text-gray-300 italic">Your short description or post summary text snippet preview shows up right here...</span>}
                  </p>

                  {/* Programmatic Hashtag List Builder Array */}
                  <div className="flex flex-wrap gap-1 mb-5">
                    {formData.tags ? (
                      formData.tags.split(',').map((tag, idx) => (
                        tag.trim() !== '' && (
                          <span key={idx} className="text-xs bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-gray-600 font-medium">
                            #{tag.trim()}
                          </span>
                        )
                      ))
                    ) : (
                      <span className="text-xs text-gray-300 italic">No custom tags added</span>
                    )}
                  </div>

                  {/* Card Bottom Meta Data Signature Row */}
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-[10px]">A</div>
                      <span>Author Profile</span>
                    </div>
                    <span className={`font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded \${formData.isPublished ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {formData.isPublished ? '● Ready to Publish' : '○ Draft'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inline Help Context Banner */}
              <div className="mt-4 p-4 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                💡 **SEO Sync Enabled**: Your clean web URL slug updates automatically as you adjust the post text field title header above.
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
