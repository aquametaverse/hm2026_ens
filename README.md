# AquaMetaverse Identity Portal

A banking-grade DeFi and GameFi dashboard for the AquaMetaverse. This application enables members to view treasury statistics and manage their Web3 identities by registering ENS subdomains (e.g., `username.acquaflow0.eth`).

## Features

- **Dashboard**: Real-time view of Total Value Locked (TVL), treasury yields, and user identity status.
- **Identity Registry**: A dedicated interface to register subdomains via the ENS Subdomain Registrar.
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

// Address of the ENS Subdomain Registrar contract
export const SUBDOMAIN_REGISTRAR_ADDRESS = '0x...'; 

// Address of your Public Resolver
export const AQUA_FLOW_ENS_RESOLVER = '0x...'; 

// The root ENS domain you control
export const PARENT_DOMAIN = 'acquaflow0.eth'; 
export const PARENT_LABEL = 'acquaflow0';
```

### 2. Contract Interface

The application interacts with a `SubdomainRegistrar` contract. Ensure your deployed contract implements the following interface:

```solidity
function register(
    bytes32 label,       // keccak256(PARENT_LABEL)
    string calldata subdomain, 
    address _owner, 
    address referrer, 
    address resolver
) external payable;
```

This interface is based on the [ENS Subdomain Registrar](https://github.com/ensdomains/ens-contracts/tree/feature/subdomain-registrar/contracts/subdomainregistrar) feature branch.

### 3. Customizing Chains

The app is pre-configured for **Sepolia** and **Mainnet**. To add other networks (e.g., Polygon, Arbitrum):

1. Open `config/wagmi.ts`.
2. Import the chain from `wagmi/chains`.
3. Add it to the `chains` array in `wagmiConfig`.

## Deployment (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com/).

### 1. Import Project
- Push your code to a Git repository.
- Log in to Vercel and click **Add New Project**.

### 2. Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Set Environment Variables
Add `NEXT_PUBLIC_ALCHEMY_KEY` and `NEXT_PUBLIC_WC_PROJECT_ID` in Vercel project settings.

## Tech Stack

- **Framework**: React (Vite/Next.js compatible structure)
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v2, Viem, RainbowKit
- **Icons**: Lucide React
- **Router**: React Router DOM
