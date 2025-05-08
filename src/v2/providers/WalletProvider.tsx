import { createContext, useContext, useState, useEffect } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';

export type WalletType = 'phantom' | 'solflare' | null;

interface WalletContextType {
  wallet: WalletType;
  connected: boolean;
  address: string | null;
  balance: number;
  connectWallet: (type: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  createToken: (name: string, symbol: string, decimals: number, initialSupply: number) => Promise<void>;
  mintToken: (tokenAddress: string, amount: number, recipientAddress: string) => Promise<void>;
  createdTokens: Array<{ name: string; symbol: string; address: string; decimals: number }>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connected: false,
  address: null,
  balance: 0,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  createToken: async () => {},
  mintToken: async () => {},
  createdTokens: [],
});

const connection = new Connection('https://api.devnet.solana.com');

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallet, setWallet] = useState<WalletType>(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [createdTokens, setCreatedTokens] = useState<Array<{ name: string; symbol: string; address: string; decimals: number }>>([]);
  const { toast } = useToast();

  const connectWallet = async (type: WalletType) => {
    try {
      const solana = (window as any).solana;
      const solflare = (window as any).solflare;
      const provider = type === 'phantom' ? solana : solflare;

      if (!provider) {
        toast({
          title: `${type === 'phantom' ? 'Phantom' : 'Solflare'} Wallet Not Found`,
          description: `Please install the ${type === 'phantom' ? 'Phantom' : 'Solflare'} Wallet extension.`,
          variant: 'destructive',
        });
        window.open(type === 'phantom' ? 'https://phantom.app/' : 'https://solflare.com/', '_blank');
        return;
      }

      const response = await provider.connect();
      const pubkey = response.publicKey?.toString();
      if (!pubkey) throw new Error('No public key returned');

      setWallet(type);
      setAddress(pubkey);
      setConnected(true);

      const lamports = await connection.getBalance(new PublicKey(pubkey));
      setBalance(lamports / LAMPORTS_PER_SOL);

      toast({
        title: 'Wallet Connected',
        description: `Connected to ${type} wallet`,
      });
    } catch (err) {
      console.error('Wallet connection failed:', err);
      toast({
        title: 'Connection Failed',
        description: 'Unable to connect to wallet.',
        variant: 'destructive',
      });
    }
  };

  const disconnectWallet = async () => {
    try {
      const solana = (window as any).solana;
      const solflare = (window as any).solflare;

      if (wallet === 'phantom' && solana?.isConnected) await solana.disconnect();
      if (wallet === 'solflare' && solflare?.isConnected) await solflare.disconnect();

      setWallet(null);
      setAddress(null);
      setBalance(0);
      setConnected(false);

      toast({
        title: 'Wallet Disconnected',
        description: 'You have successfully disconnected your wallet.',
      });
    } catch (err) {
      console.error('Disconnection failed:', err);
      toast({
        title: 'Disconnection Failed',
        description: 'There was a problem disconnecting your wallet.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return;
      const lamports = await connection.getBalance(new PublicKey(address));
      setBalance(lamports / LAMPORTS_PER_SOL);
    };
    fetchBalance();
  }, [address]);

  const createToken = async (name: string, symbol: string, decimals: number, initialSupply: number) => {
    if (!address) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Connect your wallet before creating a token.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const {
        createMint,
        getOrCreateAssociatedTokenAccount,
        mintTo,
      } = await import('@solana/spl-token') as any;

      const mintAuthority = new PublicKey(address);
      const payer = mintAuthority;

      const mint = await createMint(
        connection,
        payer,
        mintAuthority,
        null,
        decimals
      );

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        mintAuthority
      );

      await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        mintAuthority,
        initialSupply * Math.pow(10, decimals)
      );

      setCreatedTokens((prev) => [...prev, {
        name,
        symbol,
        address: mint.toBase58(),
        decimals
      }]);

      toast({
        title: 'Token Created',
        description: `${name} (${symbol}) created with supply ${initialSupply}`,
      });
    } catch (err) {
      console.error('Token creation error:', err);
      toast({
        title: 'Creation Failed',
        description: 'Error creating token. Check console.',
        variant: 'destructive',
      });
    }
  };

  const mintToken = async (tokenAddress: string, amount: number, recipientAddress: string) => {
    if (!address) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Connect your wallet before minting tokens.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const {
        mintTo,
        getOrCreateAssociatedTokenAccount,
      } = await import('@solana/spl-token') as any;

      const token = createdTokens.find(t => t.address === tokenAddress);
      if (!token) {
        toast({
          title: 'Token Not Found',
          description: 'Selected token not found.',
          variant: 'destructive',
        });
        return;
      }

      const mint = new PublicKey(tokenAddress);
      const recipient = new PublicKey(recipientAddress);
      const payer = new PublicKey(address);

      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        recipient
      );

      await mintTo(
        connection,
        payer,
        mint,
        recipientTokenAccount.address,
        payer,
        amount * Math.pow(10, token.decimals)
      );

      toast({
        title: 'Minted Successfully',
        description: `Minted ${amount} ${token.symbol} to ${recipientAddress.slice(0, 4)}...${recipientAddress.slice(-4)}`,
      });
    } catch (err) {
      console.error('Minting error:', err);
      toast({
        title: 'Minting Failed',
        description: 'Error minting token.',
        variant: 'destructive',
      });
    }
  };

  return (
    <WalletContext.Provider value={{
      wallet,
      connected,
      address,
      balance,
      connectWallet,
      disconnectWallet,
      createToken,
      mintToken,
      createdTokens,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
