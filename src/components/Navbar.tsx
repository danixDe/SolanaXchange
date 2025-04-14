import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coins, Wallet } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

function Navbar() {
  const { connected, connectWallet, disconnectWallet } = useWallet();
  const location = useLocation();

  return (
    <nav className="bg-[#000000] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Coins className="w-6 h-6" />
          <span className="text-xl font-bold">SolanaXchange</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {connected && (
            <div className="hidden md:flex gap-4">
              <Link
                to="/wallet"
                className={`btn ${location.pathname === '/wallet' ? 'bg-[#826C7F]' : 'bg-[#A88FAC] hover:bg-[#826C7F]'}`}
              >
                Wallet
              </Link>
              <Link
                to="/create"
                className={`btn ${location.pathname === '/create' ? 'bg-[#826C7F]' : 'bg-[#A88FAC] hover:bg-[#826C7F]'}`}
              >
                Create Token
              </Link>
              <Link
                to="/send"
                className={`btn ${location.pathname === '/send' ? 'bg-[#826C7F]' : 'bg-[#A88FAC] hover:bg-[#826C7F]'}`}
              >
                Send Tokens
              </Link>
            </div>
          )}
          
          {!connected ? (
            <button onClick={connectWallet} className="btn bg-[#A88FAC] hover:bg-[#826C7F] flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button>
          ) : (
            <button onClick={disconnectWallet} className="btn bg-[#826C7F] hover:bg-[#A88FAC] flex items-center gap-2">
              Disconnect
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;