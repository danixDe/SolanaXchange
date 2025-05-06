import { useWallet } from '@/v2/providers/WalletProvider';
import WalletInfo from '@/v2/wallet/WalletInfo';
import { TokenCreationForm } from '@/v2/token/CreateToken';
import { TokenMintingForm } from '@/v2/token/MintToken';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroSection } from './hero-section';
import { TokenGrid } from '@/v2/token/TokenGrid';

const Dashboard = () => {
  const { connected } = useWallet();

  if (!connected) {
    return <HeroSection />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Card className="border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Welcome to SolanaLabs</CardTitle>
              <CardDescription>
                Manage your wallet, create and mint tokens on Solana devnet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WalletInfo />
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="tokens" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="tokens">My Tokens</TabsTrigger>
          <TabsTrigger value="create">Create Token</TabsTrigger>
          <TabsTrigger value="mint">Mint Token</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tokens" className="space-y-6">
          <TokenGrid />
        </TabsContent>
        
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Token</CardTitle>
              <CardDescription>
                Define properties for your new Solana token
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TokenCreationForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mint" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mint Token</CardTitle>
              <CardDescription>
                Mint tokens to any address on the Solana devnet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TokenMintingForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;