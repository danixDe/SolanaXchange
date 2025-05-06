import { useWallet } from '@/v2/providers/WalletProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const WalletInfo = () => {
  const { address, balance, wallet } = useWallet();

  const recentTransactions = [
    { 
      id: 1, 
      type: 'incoming', 
      amount: 0.5, 
      address: 'ph3jy8nc7m2k4', 
      date: new Date(Date.now() - 8400000).toISOString() 
    },
    { 
      id: 2, 
      type: 'outgoing', 
      amount: 0.12, 
      address: 'sf8jw92mxp12', 
      date: new Date(Date.now() - 42000000).toISOString() 
    },
    { 
      id: 3, 
      type: 'incoming', 
      amount: 0.05, 
      address: 'ph1kt93mx72p', 
      date: new Date(Date.now() - 126000000).toISOString() 
    },
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 border bg-card/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Connected Wallet</p>
              <p className="font-medium text-lg capitalize">{wallet} Wallet</p>
              {address && (
                <p className="text-xs text-muted-foreground mt-1">
                  {address}
                </p>
              )}
            </div>
            <div className="p-2 rounded-full bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border bg-card/80">
          <div>
            <p className="text-sm text-muted-foreground">SOL Balance</p>
            <p className="font-medium text-2xl">{balance.toFixed(4)} SOL</p>
            <div className="mt-2">
              <Progress value={balance * 10} className="h-1" />
            </div>
          </div>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
        
        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg bg-card/60">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  tx.type === 'incoming' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-red-500/10 text-red-500'
                }`}>
                  {tx.type === 'incoming' 
                    ? <ArrowDownRight className="h-4 w-4" /> 
                    : <ArrowUpRight className="h-4 w-4" />
                  }
                </div>
                <div>
                  <p className="font-medium">
                    {tx.type === 'incoming' ? 'Received' : 'Sent'} SOL
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.type === 'incoming' ? 'From' : 'To'}: {tx.address}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  tx.type === 'incoming' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {tx.type === 'incoming' ? '+' : '-'}{tx.amount} SOL
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(tx.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;