import React, { useState } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PARENT_DOMAIN, AQUA_IDENTITY_NFT_ADDRESS } from '../constants';
import { BadgeCheck, Flame, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

// NOTE: In a real app, this would be the ABI for the custom ENS registrar contract
const MOCK_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "label", "type": "string" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "burnToMintIdentity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const EnsWrite: React.FC = () => {
  const { isConnected } = useAccount();
  const [subdomain, setSubdomain] = useState('');
  const [selectedNftId, setSelectedNftId] = useState<string | null>(null);

  // Mock NFT Data (In reality, fetch from an API or contract read)
  const mockUserNfts = [
    { id: '1042', name: 'Aqua Scout #1042', image: 'https://picsum.photos/200' },
    { id: '3055', name: 'Aqua Scout #3055', image: 'https://picsum.photos/201' },
  ];

  // Wagmi Write Hook Preparation
  const { config, error: prepareError } = usePrepareContractWrite({
    address: AQUA_IDENTITY_NFT_ADDRESS as `0x${string}`,
    abi: MOCK_ABI,
    functionName: 'burnToMintIdentity',
    args: [subdomain, selectedNftId],
    enabled: Boolean(subdomain && selectedNftId),
  });

  const { data, write, isLoading: isWriteLoading } = useContractWrite(config);

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleMint = () => {
    if (write) write();
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet Required</h2>
        <p className="text-slate-400 text-center max-w-md">
          You must connect your wallet to view your qualifying NFTs and mint your identity.
        </p>
      </div>
    );
  }

  if (isTxSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6 pt-10">
        <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
          <BadgeCheck className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-white">Identity Secured!</h2>
        <p className="text-slate-300">
          You have successfully burned your NFT and claimed:
        </p>
        <div className="bg-slate-900/50 p-6 rounded-xl border border-aqua-500/30">
          <span className="text-2xl font-mono text-aqua-400">{subdomain}.{PARENT_DOMAIN}</span>
        </div>
        <Button onClick={() => window.location.reload()}>Mint Another (Demo)</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Identity Forge</h1>
        <p className="text-slate-400">Burn a Scout NFT to generate your Web3 Identity on <span className="text-aqua-400">{PARENT_DOMAIN}</span></p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Step 1: Select NFT */}
        <Card title="1. Select Catalyst NFT" className={selectedNftId ? 'border-aqua-500/50' : ''}>
          <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {mockUserNfts.map((nft) => (
              <div 
                key={nft.id}
                onClick={() => setSelectedNftId(nft.id)}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedNftId === nft.id 
                    ? 'border-aqua-500 shadow-[0_0_20px_rgba(20,184,166,0.3)]' 
                    : 'border-transparent hover:border-slate-600'
                }`}
              >
                <img src={nft.image} alt={nft.name} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-sm font-bold text-white truncate">{nft.name}</p>
                  <p className="text-xs text-slate-400">ID: {nft.id}</p>
                </div>
                {selectedNftId === nft.id && (
                  <div className="absolute top-2 right-2 bg-aqua-500 text-slate-900 p-1 rounded-full">
                    <BadgeCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {mockUserNfts.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No qualifying NFTs found in wallet.
            </div>
          )}
        </Card>

        {/* Step 2: Configure & Burn */}
        <div className="space-y-6">
          <Card title="2. Configuration">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Desired Subdomain
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="neo-diver"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-aqua-500 focus:border-transparent outline-none font-mono"
                  />
                  <div className="absolute right-4 top-3.5 text-slate-500 pointer-events-none">
                    .{PARENT_DOMAIN}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Only lowercase letters, numbers, and hyphens allowed.
                </p>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border border-red-500/20">
                <div className="flex items-start gap-3">
                  <Flame className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-400">Irreversible Action</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Proceeding will permanently burn the selected NFT. This action cannot be undone. 
                      Your new identity will be minted immediately upon confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Button 
            className="w-full h-14 text-lg" 
            disabled={!selectedNftId || !subdomain || !!prepareError || isWriteLoading || isTxLoading}
            onClick={handleMint}
            variant={prepareError ? 'secondary' : 'primary'}
          >
            {isWriteLoading || isTxLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                {isWriteLoading ? 'Confirm in Wallet...' : 'Minting Identity...'}
              </span>
            ) : prepareError ? (
              <span className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Invalid Config
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Burn & Mint Identity
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>

          {prepareError && (
             <p className="text-center text-xs text-red-400">
               {(prepareError as any)?.shortMessage || "Error in contract preparation. Check inputs."}
             </p>
          )}
        </div>
      </div>
    </div>
  );
};
