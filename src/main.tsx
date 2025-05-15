// ✅ main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App'; // ✅ Ruta corregida
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router> {/* ✅ Aquí está el único Router */}
        <App />
      </Router>
    </AuthProvider>
  </StrictMode>
);
