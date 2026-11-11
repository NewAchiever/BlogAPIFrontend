import React, { useState, type ChangeEvent } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import usePageTitle from '@/shared/hooks/usePageTitle';
export default function PageNotFound() {
    const { setIsAuthLoading } = useAuth(); 
    setIsAuthLoading(false);
    usePageTitle('Page Not Found');
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Page Not Found</h2>
      </div>
    </div>
  );
};

// Inline styling template for ease of use
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: '1',
    backgroundColor: '#f3f4f6',
    fontFamily: 'system-ui, sans-serif'
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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
    },
  title: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.75rem',
    textAlign: 'center',
    color: '#1f2937'
  },
  
};
