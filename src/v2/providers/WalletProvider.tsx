import { createContext, useContext, useState, useEffect } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';

export type WalletType = 'phantom' | 'solflare' | null;

interface WalletContextType {
  wallet: WalletType;
  connected: boolean;
  address: string | null;
  balance: number;
  connectWallet: (type: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  createToken: (tokenName: string, tokenSymbol: string, tokenDecimals: number, initialSupply: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connected: false,
  address: null,
  balance: 0,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  createToken: async () => {},
});

const connection = new Connection('https://api.devnet.solana.com');

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallet, setWallet] = useState<WalletType>(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const { toast } = useToast();

  const connectWallet = async (type: WalletType) => {
    try {
      const solana = (window as any).solana;
      const solflare = (window as any).solflare;
      const walletProvider = type === 'phantom' ? solana : solflare;

      if (type === 'phantom' && !solana?.isPhantom) {
        toast({
          title: 'Phantom Wallet Not Found',
          description: 'Please install the Phantom Wallet extension.',
          variant: 'destructive',
        });
        window.open('https://phantom.app/', '_blank');
        return;
      }

      if (type === 'solflare' && !solflare?.isSolflare) {
        toast({
          title: 'Solflare Wallet Not Found',
          description: 'Please install the Solflare Wallet extension.',
          variant: 'destructive',
        });
        window.open('https://solflare.com/', '_blank');
        return;
      }

      const response = await walletProvider.connect();
      const pubkey = response.publicKey?.toString();

      if (!pubkey) throw new Error('No public key returned');

      setWallet(type);
      setAddress(pubkey);
      setConnected(true);

      toast({
        title: 'Wallet Connected',
        description: `Connected to ${type} wallet`,
      });

      const lamports = await connection.getBalance(new PublicKey(pubkey));
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
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

      if (wallet === 'phantom' && solana?.isConnected) {
        await solana.disconnect();
      }
      if (wallet === 'solflare' && solflare?.isConnected) {
        await solflare.disconnect();
      }

      setWallet(null);
      setAddress(null);
      setBalance(0);
      setConnected(false);

      toast({
        title: 'Wallet Disconnected',
        description: 'You have successfully disconnected your wallet.',
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
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

  const createToken = async (
    tokenName: string,
    tokenSymbol: string,
    tokenDecimals: number,
    initialSupply: number
  ) => {
    if (!address) {
      toast({
        title: 'Wallet Not Connected',
        description: 'You need to connect your wallet first.',
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
        tokenDecimals
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
        initialSupply * Math.pow(10, tokenDecimals)
      );

      // Add the created token to the state
      setCreatedTokens((prevTokens) => [
        ...prevTokens,
        {
          name: tokenName,
          symbol: tokenSymbol,
          address: mint.toBase58(),
        },
      ]);

      toast({
        title: 'Token Created',
        description: `Successfully created ${tokenName} (${tokenSymbol}) with an initial supply of ${initialSupply}`,
      });

      console.log('New mint address:', mint.toBase58());
      console.log('Token account address:', tokenAccount.address.toBase58());
    } catch (error) {
      console.error('Failed to create token:', error);
      toast({
        title: 'Token Creation Failed',
        description: 'There was an error creating your token. See console for details.',
        variant: 'destructive',
      });
    }
  };

  const mintToken = async (tokenAddress: string, amount: number) => {
    if (!address) {
      toast({
        title: 'Wallet Not Connected',
        description: 'You need to connect your wallet first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { mintTo, getAssociatedTokenAddress } = await import('@solana/spl-token') as any;

      const tokenMint = new PublicKey(tokenAddress);
      const payer = new PublicKey(address);

      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenMint,
        payer
      );

      await mintTo(connection, payer, tokenMint, associatedTokenAddress, payer, amount);

      toast({
        title: 'Tokens Minted',
        description: `Successfully minted ${amount} tokens.`,
      });

    } catch (error) {
      console.error('Failed to mint token:', error);
      toast({
        title: 'Minting Failed',
        description: 'There was an error minting your token. See console for details.',
        variant: 'destructive',
      });
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        address,
        balance,
        connectWallet,
        disconnectWallet,
        createToken,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
