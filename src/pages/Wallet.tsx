import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Send } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

function Wallet() {
  const { publicKey, balance, tokens } = useWallet();

  if (!publicKey) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Please connect your wallet first</h2>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-[#A88FAC]">
        <h2 className="text-2xl font-bold mb-4">Wallet Info</h2>
        <div className="space-y-4">
          <div>
            <p className="text-[#826C7F]">Address</p>
            <p className="font-mono break-all">{publicKey}</p>
          </div>
          <div>
            <p className="text-[#826C7F]">Balance</p>
            <p className="text-2xl font-bold">{balance.toFixed(4)} SOL</p>
          </div>
          <div>
            <p className="text-[#826C7F]">Tokens</p>
            {tokens.map((token, index) => (
              <div key={index} className="flex justify-between items-center mt-2">
                <span className="font-mono">{token.mint.slice(0, 4)}...{token.mint.slice(-4)}</span>
                <span>{token.balance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-[#A88FAC]">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="space-y-4">
          <Link 
            to="/create" 
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Token
          </Link>
          <Link 
            to="/send"
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
            style={{ opacity: tokens.length === 0 ? 0.5 : 1, pointerEvents: tokens.length === 0 ? 'none' : 'auto' }}
          >
            <Send className="w-5 h-5" />
            Send Tokens
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Wallet;