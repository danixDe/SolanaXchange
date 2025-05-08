import { Button } from '@/components/ui/button';
import { WalletConnectButton } from '@/v2/wallet/WalletConnect';
import { CoinsIcon } from 'lucide-react';
import { TokenETH } from '@web3icons/react';

export function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="flex items-center justify-center bg-primary/10 w-20 h-20 rounded-full mb-6 animate-pulse">
        <TokenETH className="h-16 w-16 text-primary" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Solana Token Manager
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-2xl mb-8">
        Connect your wallet to create, mint, and manage tokens on the Solana devnet
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <WalletConnectButton />
        <Button variant="outline">Learn More</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl w-full">
        <FeatureCard 
          title="Create Tokens" 
          description="Design and deploy your own tokens on Solana devnet" 
        />
        <FeatureCard 
          title="Mint Tokens" 
          description="Mint tokens to any address with just a few clicks" 
        />
        <FeatureCard 
          title="Manage Wallet" 
          description="View your balance and transaction history" 
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/50">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}