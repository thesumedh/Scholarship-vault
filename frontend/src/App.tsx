import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import NavBar from './components/NavBar';
import WalletBanner from './components/WalletBanner';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import VerifyPage from './pages/VerifyPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar />
        
        <main className="main-content" style={{ flex: '1 0 auto' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
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
