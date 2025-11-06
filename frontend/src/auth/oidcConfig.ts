import type { OidcConfiguration } from '@axa-fr/react-oidc';

// OIDC configuration for Keycloak
export const oidcConfig: OidcConfiguration = {
  authority: 'http://localhost:8080/realms/myrealm',
  client_id: 'frontend-client',
  redirect_uri: window.location.origin + '/authentication/callback',
  silent_redirect_uri: window.location.origin + '/authentication/silent-callback',
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'openid profile email',
} as OidcConfiguration;

console.log('oidcConfig.ts: OIDC Configuration loaded:', oidcConfig);