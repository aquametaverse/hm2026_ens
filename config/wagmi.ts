import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';
import { ALCHEMY_API_KEY, WALLET_CONNECT_PROJECT_ID } from '../constants';

export const chains = [mainnet, sepolia] as const;

export const wagmiConfig = getDefaultConfig({
  appName: 'AquaMetaverse',
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains,
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
  },
});