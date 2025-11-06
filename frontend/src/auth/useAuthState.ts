import { useOidc, useOidcAccessToken, useOidcUser, OidcUserStatus } from '@axa-fr/react-oidc';

// Custom hook to manage authentication state and provide access to tokens
export const useAuthState = () => {
  const { isAuthenticated, login, logout } = useOidc();
  const { accessToken } = useOidcAccessToken();
  const { oidcUser, oidcUserLoadingState } = useOidcUser();
  
  // Determine if we're still loading
  const isLoading = oidcUserLoadingState === OidcUserStatus.Loading;
  
  console.log('useAuthState - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
  console.log('useAuthState - accessToken:', accessToken);
  console.log('useAuthState - oidcUser:', oidcUser);
  console.log('useAuthState - oidcUserLoadingState:', oidcUserLoadingState);

  return {
    isAuthenticated,
    isLoading,
    login: () => {
      console.log('useAuthState: login function called');
      return login();
    },
    logout: () => {
      console.log('useAuthState: logout function called');
      return logout();
    },
    accessToken: accessToken?.accessToken || null,
    user: oidcUser,
  };
};