import { CoinsIcon, Github, Globe, Linkedin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CoinsIcon className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">SolanaXchange</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Create and mint tokens with ease
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/danixDe/" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href = "https://linkedin.com/in/arvix17" className='text-muted-foreground hover:text-foreground'>
              <Linkedin className='h-5 w-5' />
              </a>
              <a href = "https://danixde.vercel.app" className='text-muted-foreground hover:text-foreground'>
              <Globe className='h-5 w-5' />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Guides</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">API Reference</a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Products</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Token Management</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Wallet Integration</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Developer Tools</a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SolanaXchange. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Aravind Bollapragada
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;