import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWallet } from '../providers/WalletProvider';
import { PublicKey } from '@solana/web3.js';

export function TokenGrid() {
  const { toast } = useToast();
  const { 
    createdTokens, 
    address, 
    connected,
    mintToken,
  } = useWallet();
  
  const [tokenDetails, setTokenDetails] = useState<Array<{
    address: string;
    supply?: number;
    balance?: number;
    decimals?: number;
  }>>([]);

  const fetchTokenDetails = async () => {
    if (!connected || createdTokens.length === 0) return [];

    const details = await Promise.all(
      createdTokens.map(async (token) => {
        try {
          const splToken = await import('@solana/spl-token') as any;
          const mint = new PublicKey(token.address);
          
          const mintInfo = await splToken.getMint(connected, mint);
          const supply = Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals);
          
          let balance = 0;
          if (address) {
            const ata = await splToken.getAssociatedTokenAddress(
              mint,
              new PublicKey(address)
            );
            
            try {
              const account = await splToken.getAccount(connected, ata);
              balance = Number(account.amount) / Math.pow(10, mintInfo.decimals);
            } catch (e) {
              console.log("Associated token account does not exist",e);
            }
          }
          
          return { 
            address: token.address, 
            supply,
            balance,
            decimals: mintInfo.decimals
          };
        } catch (error) {
          console.error('Error fetching token details:', error);
          return { 
            address: token.address, 
            supply: 0, 
            balance: 0,
            decimals: 0
          };
        }
      })
    );
    return details;
  };

  useEffect(() => {
    const load = async () => {
      const details = await fetchTokenDetails();
      setTokenDetails(details);
    };
    load();
  }, [createdTokens, address, connected]);

  const handleMintTokens = async (tokenAddress: string) => {
    if (!address) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to mint tokens',
        variant: 'destructive'
      });
      return;
    }

    try {
      const amount = 1000;
      await mintToken(tokenAddress, amount, address);
      
      toast({
        title: 'Tokens Minted',
        description: `Successfully minted ${amount} tokens to your wallet`,
      });
      
      const details = await fetchTokenDetails();
      setTokenDetails(details);
    } catch (error) {
      console.error('Minting failed:', error);
      toast({
        title: 'Minting Failed',
        description: 'Failed to mint new tokens',
        variant: 'destructive'
      });
    }
  };

  const handleViewDetails = (tokenAddress: string) => {
    const token = createdTokens.find(t => t.address === tokenAddress);
    const detail = tokenDetails.find(d => d.address === tokenAddress);
    
    toast({
      title: `${token?.name} (${token?.symbol}) Details`,
      description: `
        Address: ${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-6)}\n
        Decimals: ${detail?.decimals || 0}\n
        Total Supply: ${detail?.supply?.toLocaleString() || 0}
      `,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {createdTokens.map((token) => {
        
        return (
          <Card 
            key={token.address}
            className="hover-glow transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
            
            <CardHeader className="relative z-10">
              <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                {token.name}
              </CardTitle>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{token.symbol}</p>
                <span className="text-xs text-purple-400">
                  {token.decimals} Decimals
                </span>
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Your Balance</p>
                  <p className="font-medium">
                    
                    {token.decimals }
                    
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Supply</p>
                  <p className="font-medium">
                    
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="relative z-10 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleViewDetails(token.address)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Details
              </Button>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => handleMintTokens(token.address)}
              >
                <Send className="mr-2 h-4 w-4" />
                Mint Tokens
              </Button>
            </CardFooter>
          </Card> 
        );
      })}
    </div>
  );
}
