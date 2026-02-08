# AquaMetaverse Identity Portal

A banking-grade DeFi and GameFi dashboard for the AquaMetaverse. This application enables members to view treasury statistics and manage their Web3 identities by minting ENS subdomains (e.g., `username.acquaflow0.eth`) via an NFT burning mechanism.

## Features

- **Dashboard**: Real-time view of Total Value Locked (TVL), treasury yields, and user identity status.
- **Identity Forge**: A dedicated interface to burn "Aqua Scout" NFTs and mint subdomain identities.
- **Banking-Grade UI**: Built with Tailwind CSS, featuring glassmorphism, neon accents, and responsive design.
- **Web3 Integration**: Powered by [wagmi](https://wagmi.sh/) and [RainbowKit](https://www.rainbowkit.com/) for robust wallet connections.

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### 1. Environment Setup

Copy the example environment file and configure your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your provider keys:
- **NEXT_PUBLIC_ALCHEMY_KEY**: Obtain from [Alchemy Dashboard](https://dashboard.alchemy.com/).
- **NEXT_PUBLIC_WC_PROJECT_ID**: Obtain from [WalletConnect Cloud](https://cloud.walletconnect.com/).

### 2. Installation

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

## Integration Guide

To connect this frontend to your deployed smart contracts, follow these steps:

### 1. Configure Contract Addresses

Navigate to `constants.ts` and update the placeholder addresses with your deployed contract addresses on the target network (Sepolia/Mainnet).

```typescript
// constants.ts

// Address of the NFT collection users must burn
export const AQUA_IDENTITY_NFT_ADDRESS = '0x...'; 

// Address of your custom ENS Resolver or Registrar contract
export const AQUA_FLOW_ENS_RESOLVER = '0x...'; 

// The root ENS domain you control
export const PARENT_DOMAIN = 'acquaflow0.eth'; 
```

### 2. Update Contract ABI

The application currently uses a mock ABI for demonstration. You must replace it with your actual contract ABI.

1. Open `pages/EnsWrite.tsx`.
2. Locate the `MOCK_ABI` constant.
3. Replace it with the ABI from your deployed contract. Ensure the function signature matches your contract's method for burning/minting.

```typescript
// pages/EnsWrite.tsx

const MOCK_ABI = [
  // Replace with your actual ABI
  {
    "inputs": [
      { "internalType": "string", "name": "label", "type": "string" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "burnToMintIdentity", // Verify this function name matches your contract
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
```

### 3. Implement Real NFT Data Fetching

The "Identity Forge" page currently uses static mock data (`mockUserNfts`). To fetch real NFTs from the user's wallet:

1. Open `pages/EnsWrite.tsx`.
2. Replace the `mockUserNfts` array with a hook or API call.
3. **Option A (Alchemy API)**: Use `alchemy-sdk` to fetch NFTs for the connected address filtered by `AQUA_IDENTITY_NFT_ADDRESS`.
4. **Option B (Wagmi)**: Use `useContractRead` if your NFT contract supports `tokenOfOwnerByIndex` or similar enumerable extensions.

Example logic to implement:

```typescript
// Pseudo-code for fetching NFTs
const { address } = useAccount();
const [nfts, setNfts] = useState([]);

useEffect(() => {
  if (address) {
    // Call Alchemy/Infura API to get NFTs for 'address' 
    // Filter where contract === AQUA_IDENTITY_NFT_ADDRESS
    // setNfts(results);
  }
}, [address]);
```

### 4. Customizing Chains

The app is pre-configured for **Sepolia** and **Mainnet**. To add other networks (e.g., Polygon, Arbitrum):

1. Open `config/wagmi.ts`.
2. Import the chain from `wagmi/chains`.
3. Add it to the `configureChains` array.

```typescript
import { polygon, arbitrum } from 'wagmi/chains';

export const { chains, publicClient } = configureChains(
  [mainnet, sepolia, polygon, arbitrum],
  // ...
);
```

## Tech Stack

- **Framework**: React (Vite/Next.js compatible structure)
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v1, Viem, RainbowKit
- **Icons**: Lucide React
- **Router**: React Router DOM
