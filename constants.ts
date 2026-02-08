// In a real Next.js app, these would be process.env.NEXT_PUBLIC_...
export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY || 'demo-alchemy-key';
export const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo-project-id';

// Contract Addresses (Sepolia Placeholders)
export const AQUA_IDENTITY_NFT_ADDRESS = '0x1234567890123456789012345678901234567890';
export const AQUA_FLOW_ENS_RESOLVER = '0x0987654321098765432109876543210987654321';

export const PARENT_DOMAIN = 'acquaflow0.eth';

export const NAV_LINKS = [
  { name: 'Dashboard', path: '/' },
  { name: 'Identity Management', path: '/ens-write' },
  { name: 'Governance', path: '/governance' },
  { name: 'DeFi Treasury', path: '/treasury' },
];