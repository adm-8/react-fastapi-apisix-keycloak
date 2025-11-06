import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { OidcProvider } from '@axa-fr/react-oidc'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { oidcConfig } from './auth/oidcConfig'
import AuthenticationCallback from './auth/AuthenticationCallback.tsx'

console.log('main.tsx: Starting application');
console.log('main.tsx: OIDC Configuration:', oidcConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <OidcProvider configuration={oidcConfig}>
        <Provider store={store}>
          <ChakraProvider value={defaultSystem}>
            <Routes>
              <Route path="/authentication/callback" element={<AuthenticationCallback />} />
              <Route path="/authentication/silent-callback" element={<AuthenticationCallback />} />
              <Route path="*" element={<App />} />
            </Routes>
          </ChakraProvider>
        </Provider>
      </OidcProvider>
    </Router>
  </StrictMode>,
)
