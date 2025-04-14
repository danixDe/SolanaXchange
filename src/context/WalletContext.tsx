import {useState, createContext, useContext, useEffect} from 'react';
import {Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import toast from 'react-hot-toast';
import Wallets from '../components/Wallets'

interface WalletContextType{
    connected: boolean;
    publicKey: string | null;
    balance : number;
    tokens : Array<{mint: string, balance: number}>;
    connectWallet : ()=>void;
    disconnectWallet: ()=>void;
    connection: Connection;
}
const WalletContext = createContext<WalletContextType>({} as WalletContextType);
export const useWallet = ()=> useContext(WalletContext);

export const WalletProvider: React.FC<{children:React.ReactNode }> = ({children}) => {
    const [connected, setConnected] = useState(false);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [tokens, setTokens] = useState<Array<{mint: string, balance: number} >>([]);
    const [isWalletOpen, setIsWalletOpen] = useState(false);

const connection = new Connection('https://api.devnet.solana.com');
const getBalance = async()=>{
    try{
        if(!publicKey) return;
        const balance = await connection.getBalance(new PublicKey(publicKey));
        setBalance(balance / LAMPORTS_PER_SOL);

    }
    catch(error){
        console.error(error);
    }
};
    const handleWalletSelect = async(walletType: 'phantom'| 'solflare') => {
        try{
            const {solana} = window as any;
            const solflare = (window as any).solflare;
            if(walletType === 'phantom' && !solana?.isPhantom){
                toast.error('please install phantom wallet');
                window.open('https://phantom.app/', '_blank');
                return;
            }
            if (walletType === 'solflare' && !solflare?.isSolflare) {
                toast.error('Please install Solflare wallet');
                window.open('https://solflare.com/', '_blank');
                return;
              }
              const wallet = walletType === 'phantom'? solana : solflare;
              const response = await wallet.connect();

              setPublicKey(response.publicKey.toString());
              setConnected(true);
              toast.success(`connected to ${walletType} successfully`);              
        }
        catch(error){
            console.error(error);
            toast.error('Error connecting wallet');
        }
        finally{
            setIsWalletOpen(false);
        }
    };
    const connectWallet = ()=>{
        setIsWalletOpen(true);
    }
    const disconnectWallet = ()=>{
        const {solana} = window as any;
        const solflare = (window as any).solflare;
        if(solana?.isConnected){
            solana.disconnect();
        }
        if(solflare?.isConnected){
            solflare.disconnect();
        }
        setPublicKey(null);
        setConnected(false);
        toast.success('wallet disconnected');
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
}