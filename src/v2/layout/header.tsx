import { useEffect, useState, } from 'react';
import { useWallet } from '@/v2/providers/WalletProvider';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { WalletConnectButton } from '@/v2/wallet/WalletConnect';
import { CoinsIcon, Menu } from 'lucide-react';

const Header = () => {
  const { connected, address } = useWallet();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-md border-b shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <CoinsIcon className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">SolanaLabs</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="link" className="text-foreground/80 hover:text-foreground">
          <Link to = '/'>Dashboard</Link>
          </Button>
          <Button variant="link" className="text-foreground/80 hover:text-foreground">
            <Link to = '/create'>Create Token</Link>
          </Button>
          <Button variant="link" className="text-foreground/80 hover:text-foreground">
            <Link to = '/mint'>Mint Token</Link>
          </Button>
          <Button variant="link" className="text-foreground/80 hover:text-foreground">
            <Link to = '/grid'>My wallet</Link>
          </Button>
        </nav>
        
        <div className="flex items-center gap-4">
          {connected && address && (
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">
                {address.slice(0, 4)}...{address.slice(-4)}
              </p>
            </div>
          )}
          
          <WalletConnectButton />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
              <DropdownMenuItem>Create Token</DropdownMenuItem>
              <DropdownMenuItem>Mint Token</DropdownMenuItem>
              <DropdownMenuItem>My Wallet</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;