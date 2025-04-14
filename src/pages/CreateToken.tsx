import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Keypair, PublicKey } from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import { useWallet } from '../context/WalletContext';
import toast from 'react-hot-toast';

function CreateToken() {
  const [loading, setLoading] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');
  const { publicKey, connection } = useWallet();
  const navigate = useNavigate();

  const createToken = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const mintAuthority = Keypair.generate();

      const mint = await splToken.createMint(
        connection,
        mintAuthority,
        new PublicKey(publicKey),
        new PublicKey(publicKey),
        9
      );

      const tokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        mintAuthority,
        mint,
        new PublicKey(publicKey)
      );

      const supply = parseFloat(tokenSupply) * Math.pow(10, 9);
      await splToken.mintTo(
        connection,
        mintAuthority,
        mint,
        tokenAccount.address,
        mintAuthority,
        supply
      );

      toast.success('Token created successfully!');
      navigate('/wallet');
    } catch (error) {
      console.error(error);
      toast.error('Error creating token');
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Please connect your wallet first</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-[#A88FAC]">
        <h2 className="text-2xl font-bold mb-6">Create New Token</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Token Name</label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className="input"
              placeholder="Enter token name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Supply</label>
            <input
              type="number"
              value={tokenSupply}
              onChange={(e) => setTokenSupply(e.target.value)}
              className="input"
              placeholder="Enter initial supply"
            />
          </div>
          <button
            onClick={createToken}
            disabled={loading || !tokenName || !tokenSupply}
            className="btn btn-primary w-full"
          >
            {loading ? 'Creating...' : 'Create Token'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateToken;
