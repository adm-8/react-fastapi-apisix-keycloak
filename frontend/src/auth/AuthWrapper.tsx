import React from 'react';
import { useAuthState } from './useAuthState';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuthState();
  
  console.log('AuthWrapper render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  if (isLoading) {
    console.log('AuthWrapper: Still loading authentication state');
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    console.log('AuthWrapper: User is not authenticated, showing login prompt');
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Authentication Required</h2>
        <p>You need to be logged in to access this application.</p>
        <button onClick={() => {
          console.log('Login button clicked in AuthWrapper');
          login();
        }}>
          Login
        </button>
      </div>
    );
  }

  console.log('AuthWrapper: User is authenticated, rendering children');
  return <>{children}</>;
};

export default AuthWrapper;