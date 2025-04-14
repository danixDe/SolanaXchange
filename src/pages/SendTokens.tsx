import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicKey } from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import { useWallet } from '../context/WalletContext';
import toast from 'react-hot-toast';

function SendTokens() {
  const [loading, setLoading] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const { publicKey, connection, tokens } = useWallet();
  const navigate = useNavigate();

  const sendTokens = async () => {
    if (!publicKey || tokens.length === 0) return;
    setLoading(true);
    try {
      const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        new PublicKey(tokens[0].mint),
        publicKey
      );

      const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        new PublicKey(tokens[0].mint),
        new PublicKey(recipientAddress)
      );

      const amount = parseFloat(sendAmount) * Math.pow(10, 9);
      await splToken.transfer(
        connection,
        publicKey,
        fromTokenAccount.address,
        toTokenAccount.address,
        publicKey,
        amount
      );

      toast.success('Tokens sent successfully!');
      navigate('/wallet');
    } catch (error) {
      console.error(error);
      toast.error('Error sending tokens');
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

  if (tokens.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No tokens available to send</h2>
        <button onClick={() => navigate('/create')} className="btn btn-primary">Create Token</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-[#A88FAC]">
        <h2 className="text-2xl font-bold mb-6">Send Tokens</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="input"
              placeholder="Enter recipient address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              className="input"
              placeholder="Enter amount to send"
            />
          </div>
          <button
            onClick={sendTokens}
            disabled={loading || !recipientAddress || !sendAmount}
            className="btn btn-primary w-full"
          >
            {loading ? 'Sending...' : 'Send Tokens'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendTokens;
