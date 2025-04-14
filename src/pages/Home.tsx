import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Coins } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

function Home() {
  const { connected, connectWallet } = useWallet();

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to Solana Token Manager</h1>
      <p className="text-[#826C7F] mb-8">Create, manage, and send Solana tokens with ease</p>
      
      {!connected ? (
        <button onClick={connectWallet} className="btn btn-primary flex items-center gap-2 mx-auto">
          <Wallet className="w-5 h-5" />
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-6">What would you like to do?</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/wallet" className="btn btn-primary flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              View Wallet
            </Link>
            <Link to="/create" className="btn btn-secondary flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Create Token
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;