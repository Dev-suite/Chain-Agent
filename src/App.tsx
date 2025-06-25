import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={
              <>
                <Navbar />
                <Landing />
              </>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<div className="p-6 text-white">Settings page coming soon...</div>} />
            <Route path="/profile" element={<div className="p-6 text-white">Profile page coming soon...</div>} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;