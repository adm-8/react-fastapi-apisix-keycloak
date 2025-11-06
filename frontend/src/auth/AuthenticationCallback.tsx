import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from './useAuthState';

const AuthenticationCallback: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthState();
  
  console.log('AuthenticationCallback: render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // Redirect to home page when authentication is complete
  React.useEffect(() => {
    console.log('AuthenticationCallback: useEffect - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
    if (!isLoading && isAuthenticated) {
      console.log('AuthenticationCallback: Authentication complete, redirecting to home');
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    console.log('AuthenticationCallback: Still processing authentication');
    return <div>Processing authentication...</div>;
  }

  console.log('AuthenticationCallback: Authentication complete, redirecting...');
  return <div>Authentication complete. Redirecting...</div>;
};

export default AuthenticationCallback;