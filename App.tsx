import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { wagmiConfig, chains } from './config/wagmi';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { EnsWrite } from './pages/EnsWrite';

const App: React.FC = () => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        chains={chains}
        theme={darkTheme({
          accentColor: '#14b8a6', // aqua-500
          accentColorForeground: '#020617', // slate-950
          borderRadius: 'medium',
          fontStack: 'system',
          overlayBlur: 'large',
        })}
      >
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ens-write" element={<EnsWrite />} />
            </Routes>
          </Layout>
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
