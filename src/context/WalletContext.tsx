import { useState, createContext, useContext, useEffect } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import toast from 'react-hot-toast';
import Wallets from '../components/Wallets';

const connection = new Connection('https://api.devnet.solana.com');

interface WalletContextType {
  connected: boolean;
  publicKey: string | null;
  balance: number;
  tokens: Array<{ mint: string; balance: number }>;
  connectWallet: () => void;
  disconnectWallet: () => void;
  connection: Connection;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);
export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<Array<{ mint: string; balance: number }>>([]);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const getBalance = async () => {
    try {
      if (!publicKey) return;
      const balance = await connection.getBalance(new PublicKey(publicKey));
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWalletSelect = async (walletType: 'phantom' | 'solflare') => {
    try {
      const { solana } = window as any;
      const solflare = (window as any).solflare;

      if (walletType === 'phantom' && !solana?.isPhantom) {
        toast.error('Please install Phantom wallet');
        window.open('https://phantom.app/', '_blank');
        return;
      }
      if (walletType === 'solflare' && !solflare?.isSolflare) {
        toast.error('Please install Solflare wallet');
        window.open('https://solflare.com/', '_blank');
        return;
      }

      const wallet = walletType === 'phantom' ? solana : solflare;
      const response = await wallet.connect();

      setPublicKey(response.publicKey.toString());
      setConnected(true);
      toast.success(`Connected to ${walletType} successfully`);
    } catch (error) {
      console.error(error);
      toast.error('Error connecting wallet');
    } finally {
      setIsWalletOpen(false);
    }
  };

  const connectWallet = () => {
    setIsWalletOpen(true);
  };

  const disconnectWallet = async () => {
    const { solana } = window as any;
    const solflare = (window as any).solflare;

    try {
      if (solana?.isConnected) {
        await solana.disconnect();
      }
      if (solflare?.isConnected) {
        await solflare.disconnect();
      }
      setPublicKey(null);
      setConnected(false);
      toast.success('Wallet disconnected');
    } catch (err) {
      console.error(err);
      toast.error('Failed to disconnect wallet');
    }
  };

  useEffect(() => {
    if (publicKey) {
      getBalance();
    }
  }, [publicKey]);

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey,
        balance,
        tokens,
        connectWallet,
        disconnectWallet,
        connection,
      }}
    >
      {children}
      <Wallets
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        onSelectWallet={handleWalletSelect}
      />
    </WalletContext.Provider>
  );
};
