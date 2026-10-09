import React, { useState } from 'react';
import type { SignupFormData, ApiError } from './types';
import { Link } from "react-router-dom";

export default function Signup(){

const [formData, setFormData] = useState<SignupFormData>({
username: '',
email: '',
password: '',
confirmPassword: '',
});

const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);

// Handle typing inputs safely
const handleChange = (e: React.ChangeEvent) => {
const { name, value } = e.target;
setFormData((prev:FormData) => ({
...prev,
[name]: value,
}));
};
// Form submission handler
const handleSubmit = async (e: React.SubmitEvent) => {
e.preventDefault();
setError(null);

// 1. Client-side validation: Password Match
if (formData.password !== formData.confirmPassword) {
setError('Passwords do not match');
return;
}

setLoading(true);

try {

const response = await fetch('http://localhost/blog_api/public/authentication/add_user', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
username: formData.username,
email: formData.email,
password: formData.password,
}),
});

const data = await response.json();

if (!response.ok) {
// Cast backend error to our custom ApiError interface
const apiError = data as ApiError;
throw new Error(apiError.message || 'Something went wrong during signup.');
}

// Success: Save token if your backend sends one (e.g., localStorage.setItem('token', data.token))
setSuccess(true);
} catch (err: any) {
setError(err.message || 'Failed to connect to server.');
} finally {
setLoading(false);
}

};


if(success){
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.successIcon}>✓</div>
        <h2 style={styles.title}>Account Created!</h2>
        <p style={styles.subtitle}>Welcome aboard! Your registration was successful...</p>
        <button style={styles.primaryButton} onClick={() => window.location.href = '/login'}>
          <Link to='/login'>Login</Link>
        </button>
      </div>
    </div>
}

return(
    <div style={styles.container}>
  <div style={styles.card}>
    <div style={styles.header}>
      <h2 style={styles.title}>Create your account</h2>
      <p style={styles.subtitle}>Join us today! It only takes a minute.</p>
    </div>
    
    {error && (
      <div style={styles.errorBanner}>
        <span style={{ fontWeight: 'bold' }}>Error:</span> {error}
      </div>
    )}

    {/* Form Fields: Name, Email, Password, Confirm Password */}
    <form onSubmit={handleSubmit} style={styles.form}>
      
      {/* 1. Full Name Input */}
      <div style={styles.inputGroup}>
        <label style={styles.label} htmlFor="name">Username</label>
        <input
          type="text"
          id="name"
          name="username"
          placeholder="John Doe"
          value={formData.username}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </div>

      {/* 2. Email Address Input */}
      <div style={styles.inputGroup}>
        <label style={styles.label} htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </div>

      {/* 3. Password Input */}
      <div style={styles.inputGroup}>
        <label style={styles.label} htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </div>

      {/* 4. Confirm Password Input */}
      <div style={styles.inputGroup}>
        <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword || ''}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading} style={styles.primaryButton}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>

    </form>

    <p style={styles.footerText}>
      Already have an account? <a href="/login" style={styles.link}>Log in</a>
    </p>
  </div>
</div>

)





}

// Modern component styling
const styles: Record<string, React.CSSProperties> = {
container: {
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
minHeight: '100vh',
backgroundColor: '#f3f4f6',
fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
padding: '1rem',
},
card: {
backgroundColor: '#ffffff',
padding: '2.5rem',
borderRadius: '12px',
boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
width: '100%',
maxWidth: '440px',
boxSizing: 'border-box',
},
header: {
marginBottom: '1.5rem',
textAlign: 'center',
},
title: {
fontSize: '1.75rem',
fontWeight: '700',
color: '#111827',
margin: '0 0 0.5rem 0',
},
subtitle: {
fontSize: '0.95rem',
color: '#6b7280',
margin: 0,
},
form: {
display: 'flex',
flexDirection: 'column',
gap: '1.25rem',
},
inputGroup: {
display: 'flex',
flexDirection: 'column',
gap: '0.375rem',
},
label: {
fontSize: '0.875rem',
fontWeight: '500',
color: '#374151',
},
input: {
padding: '0.75rem',
fontSize: '1rem',
border: '1px solid #d1d5db',
borderRadius: '6px',
outline: 'none',
backgroundColor: '#f9fafb',
transition: 'border-color 0.2s',
},
errorBanner: {
color: '#991b1b',
backgroundColor: '#fee2e2',
padding: '0.75rem',
borderRadius: '6px',
marginBottom: '1.25rem',
fontSize: '0.875rem',
border: '1px solid #fca5a5',
},
primaryButton: {
padding: '0.75rem',
fontSize: '1rem',
fontWeight: '600',
backgroundColor: '#2563eb',
color: '#ffffff',
border: 'none',
borderRadius: '6px',
cursor: 'pointer',
marginTop: '0.5rem',
transition: 'background-color 0.2s',
},
successIcon: {
width: '56px',
height: '56px',
backgroundColor: '#d1fae5',
color: '#059669',
borderRadius: '50%',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
fontSize: '1.5rem',
fontWeight: 'bold',
margin: '0 auto 1.5rem auto',
},
footerText: {
textAlign: 'center',
fontSize: '0.875rem',
color: '#4b5563',
marginTop: '1.5rem',
marginBottom: 0,
},
link: {
color: '#2563eb',
textDecoration: 'none',
fontWeight: '500',
}
};
