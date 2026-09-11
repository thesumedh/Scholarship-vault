import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// Code-split pages so 12MB of WASM and ledger runtimes are NOT loaded on initial visit
const LandingPage = lazy(() => import('./pages/LandingPage'));
const VerifyPage = lazy(() => import('./pages/VerifyPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '0.75rem',
      color: 'var(--text-muted)',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.8rem',
    }}>
      <div style={{
        width: 20,
        height: 20,
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: '#fafafa',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <span>Loading Midnight Module…</span>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar />
        
        <main className="main-content" style={{ flex: '1 0 auto' }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export function AppWithProviders() {
  return (
    <WalletProvider>
      <App />
    </WalletProvider>
  );
}

