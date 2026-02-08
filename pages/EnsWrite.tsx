import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from 'wagmi';
import { keccak256, toBytes, toHex, zeroAddress } from 'viem';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PARENT_DOMAIN, PARENT_LABEL, SUBDOMAIN_REGISTRAR_ADDRESS, AQUA_FLOW_ENS_RESOLVER } from '../constants';
import { BadgeCheck, Globe, ArrowRight, Loader2, AlertCircle, UserCircle } from 'lucide-react';

// ABI for ENS Subdomain Registrar
// Based on: https://github.com/ensdomains/ens-contracts/tree/feature/subdomain-registrar/contracts/subdomainregistrar
const REGISTRAR_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "label", "type": "bytes32" },
      { "name": "subdomain", "type": "string" },
      { "name": "_owner", "type": "address" },
      { "name": "referrer", "type": "address" },
      { "name": "resolver", "type": "address" }
    ],
    "name": "register",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

export const EnsWrite: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [subdomain, setSubdomain] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

  // Mock Avatar Data (Simulating GameFi Assets)
  const mockUserNfts = [
    { id: '1042', name: 'Aqua Scout #1042', image: 'https://picsum.photos/200' },
    { id: '3055', name: 'Aqua Scout #3055', image: 'https://picsum.photos/201' },
    { id: '8812', name: 'Deep Diver #8812', image: 'https://picsum.photos/202' },
  ];

  // Prepare arguments for the register function
  // label: keccak256 of the parent domain label (e.g., keccak256('acquaflow0'))
  const parentLabelHash = keccak256(toBytes(PARENT_LABEL));
  
  const { data: simulateData, error: prepareError } = useSimulateContract({
    address: SUBDOMAIN_REGISTRAR_ADDRESS as `0x${string}`,
    abi: REGISTRAR_ABI,
    functionName: 'register',
    args: [
      parentLabelHash,              // bytes32 label
      subdomain,                    // string subdomain
      address || zeroAddress,       // address _owner
      zeroAddress,                  // address referrer
      AQUA_FLOW_ENS_RESOLVER as `0x${string}` // address resolver
    ],
    value: BigInt(0), // Assuming free registration for demo
    query: {
      enabled: Boolean(subdomain && address),
    }
  });

  const { writeContract, data: txHash, isPending: isWriteLoading } = useWriteContract();

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleRegister = () => {
    if (simulateData?.request) {
      writeContract(simulateData.request);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet Required</h2>
        <p className="text-slate-400 text-center max-w-md">
          Connect your wallet to access the AquaMetaverse Identity Registry.
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
          You have successfully registered your Web3 identity:
        </p>
        <div className="bg-slate-900/50 p-6 rounded-xl border border-aqua-500/30">
          <span className="text-2xl font-mono text-aqua-400">{subdomain}.{PARENT_DOMAIN}</span>
        </div>
        <p className="text-sm text-slate-500">
          Your avatar has been linked to your profile in the local cache.
        </p>
        <Button onClick={() => window.location.reload()}>Register Another (Demo)</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Identity Registry</h1>
        <p className="text-slate-400">Mint your official <span className="text-aqua-400">.{PARENT_DOMAIN}</span> subdomain for GameFi access.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Step 1: Select Avatar */}
        <Card title="1. Select Avatar" className={selectedAvatarId ? 'border-aqua-500/50' : ''}>
          <p className="text-xs text-slate-400 mb-4">Choose a verified NFT to associate with your identity.</p>
          <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {mockUserNfts.map((nft) => (
              <div 
                key={nft.id}
                onClick={() => setSelectedAvatarId(nft.id)}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedAvatarId === nft.id 
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
                {selectedAvatarId === nft.id && (
                  <div className="absolute top-2 right-2 bg-aqua-500 text-slate-900 p-1 rounded-full">
                    <UserCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Step 2: Configure & Register */}
        <div className="space-y-6">
          <Card title="2. Registration">
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

              <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-400">Global Registry</p>
                    <p className="text-xs text-slate-400 mt-1">
                      This action interacts directly with the ENS Subdomain Registrar. 
                      You will own the node for <span className="text-white font-mono">{subdomain || '...'}</span>.{PARENT_DOMAIN}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Button 
            className="w-full h-14 text-lg" 
            disabled={!subdomain || !!prepareError || isWriteLoading || isTxLoading}
            onClick={handleRegister}
            variant={prepareError ? 'secondary' : 'primary'}
          >
            {isWriteLoading || isTxLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                {isWriteLoading ? 'Confirming...' : 'Registering...'}
              </span>
            ) : prepareError ? (
              <span className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Invalid Config
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Register Identity
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>

          {prepareError && (
             <p className="text-center text-xs text-red-400">
               {(prepareError as any)?.shortMessage || (prepareError as any)?.message || "Error in contract preparation. Check inputs."}
             </p>
          )}
        </div>
      </div>
    </div>
  );
};
