import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SelectedEventProvider } from './context/SelectedEventContext';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SelectedEventProvider>
        <App />
      </SelectedEventProvider>
    </AuthProvider>
  </StrictMode>
);
