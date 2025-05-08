import { useState } from 'react';
import { useWallet, WalletType } from '@/v2/providers/WalletProvider';
import { Button } from '@/components/ui/button';
import  PhantomIcon from '@/assets/icons/phantomIcon';
import SolflareIcon from '@/assets/icons/SolflareIcon'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Wallet, 
  LogOut, 
  ChevronDown, 
  CreditCard,
  Banknote
} from 'lucide-react';
import { WalletCard } from './WalletCard';

export function WalletConnectButton() {
  const { connected, wallet, connectWallet, disconnectWallet } = useWallet();
  const [open, setOpen] = useState(false);

  const handleConnect = async (type: WalletType) => {
    await connectWallet(type);
    setOpen(false);
  };

  if (!connected) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="default" 
            className="rounded-full bg-primary font-medium"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect wallet</DialogTitle>
            <DialogDescription>
              Choose a wallet provider to connect to the Solana network.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <WalletCard
              name="Phantom"
              Icon={PhantomIcon}
              onClick={() => handleConnect('phantom')}
              description="Connect to your Phantom Wallet"
            />
            <WalletCard
              name="Solflare"
              Icon={SolflareIcon}
              onClick={() => handleConnect('solflare')}
              description="Connect to your Solflare Wallet"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full font-medium">
          {wallet === 'phantom' ? '👻' : '🔆'} 
          <span className="ml-2 hidden md:inline-flex">{wallet}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Banknote className="mr-2 h-4 w-4" />
          <span>Tokens</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}