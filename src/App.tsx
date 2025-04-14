import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import CreateToken from './pages/CreateToken';
import SendTokens from './pages/SendTokens';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FFFFFF]">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/create" element={<CreateToken />} />
            <Route path="/send" element={<SendTokens />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;