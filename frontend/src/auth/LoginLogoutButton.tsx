import React from 'react';
import { useAuthState } from './useAuthState';
import { Button } from '@chakra-ui/react';

const LoginLogoutButton: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuthState();

  const handleLogin = () => {
    console.log('Login button clicked');
    console.log('Calling login function from useAuthState');
    login();
  };

  const handleLogout = () => {
    console.log('Logout button clicked');
    console.log('Calling logout function from useAuthState');
    logout();
  };

  console.log('LoginLogoutButton render - isAuthenticated:', isAuthenticated);

  return (
    <Button 
      colorScheme={isAuthenticated ? 'red' : 'green'} 
      onClick={() => isAuthenticated ? handleLogout() : handleLogin()}
    >
      {isAuthenticated ? 'Logout' : 'Login'}
    </Button>
  );
};

export default LoginLogoutButton;