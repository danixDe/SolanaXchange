import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, Send } from 'lucide-react';

export function TokenGrid() {
  const { toast } = useToast();
  
  const tokens = [
    {
      id: '1',
      name: 'My Token',
      symbol: 'MTK',
      supply: 1000000,
      balance: 950000,
      price: 0.024,
      change: 2.4,
      address: 'AKLJ83js92kSD93n2kdJSL93',
    },
    {
      id: '2',
      name: 'Game Token',
      symbol: 'GME',
      supply: 500000,
      balance: 490000,
      price: 0.053,
      change: -1.2,
      address: 'BHJK93jd02kWM83j3mdKSP39',
    },
    {
      id: '3',
      name: 'Test Token',
      symbol: 'TST',
      supply: 100000,
      balance: 95000,
      price: 0.007,
      change: 5.3,
      address: 'CNJK93js71mDP73j2nfLDK47',
    },
  ];
  
  const handleViewDetails = (token: typeof tokens[0]) => {
    toast({
      title: `${token.name} Details`,
      description: `Token Address: ${token.address.slice(0, 8)}...`,
    });
  };
  
  const handleTransfer = (token: typeof tokens[0]) => {
    toast({
      title: `Transfer ${token.symbol}`,
      description: 'Feature coming soon!',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tokens.map((token) => (
        <Card 
          key={token.id} 
          className="glass-card hover-glow overflow-hidden transition-all duration-300"
        >
          <div 
            className={`h-1 w-full ${
              token.change > 0 
                ? 'bg-gradient-to-r from-green-500/50 to-green-500' 
                : 'bg-gradient-to-r from-red-500/50 to-red-500'
            }`}
          />
          <CardHeader className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  {token.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {token.symbol}
                </p>
              </div>
              <div 
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  token.change > 0 
                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                }`}
              >
                {token.change > 0 ? '+' : ''}{token.change}%
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="font-medium text-foreground/90">{token.balance.toLocaleString()} {token.symbol}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Value</p>
                <p className="font-medium text-foreground/90">${(token.balance * token.price).toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium text-foreground/90">${token.price}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Supply</p>
                <p className="font-medium text-foreground/90">{token.supply.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full button-glow transition-all duration-300 hover:bg-accent hover:text-accent-foreground" 
              onClick={() => handleViewDetails(token)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="w-full button-glow bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300" 
              onClick={() => handleTransfer(token)}
            >
              <Send className="h-4 w-4 mr-2" />
              Transfer
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}