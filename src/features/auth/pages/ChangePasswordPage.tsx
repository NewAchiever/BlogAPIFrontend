import React, { useState } from 'react';

interface ChangePasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordPage(){
  const [formData, setFormData] = useState<ChangePasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (formData.newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setErrorMessage('New password must be different from your current password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Your password has been changed successfully.');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Change Password</h1>
          <p className="mt-2 text-sm text-gray-600">Please enter your current password and choose a secure new password.</p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3 rounded-md bg-green-50 border border-green-200 text-xs text-green-700">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                required
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('current')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPasswords.current ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                required
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('new')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPasswords.new ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long.</p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('confirm')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPasswords.confirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
