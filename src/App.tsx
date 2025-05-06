import { ThemeProvider } from '@/v2/providers/theme-provider';
import { WalletProvider } from '@/v2/providers/WalletProvider';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/v2/layout/layout';
import Dashboard from '@/v2/dashboard/dashboard';
import { Route, Routes } from 'react-router-dom';
import CreateToken from './pages/CreateToken';
import { TokenMintingForm } from './v2/token/MintToken';
import { TokenGrid } from './v2/token/TokenGrid';

import './App.css';
import WalletInfo from './v2/wallet/WalletInfo';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <WalletProvider>
        <Routes>
          <Route path = '/' element = {<Layout />}>
          <Route index element = {<Dashboard />} />
          <Route path = "create" element = {<CreateToken />}/>
          <Route path = "mint" element = {<TokenMintingForm />} />
          <Route path = "grid" element = {<TokenGrid />} />
          <Route path = "wallet" element = {<WalletInfo />} />
          </Route>
        </Routes>
        <Toaster />
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;