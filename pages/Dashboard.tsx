import React from 'react';
import { useAccount, useBalance, useEnsName } from 'wagmi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Wallet, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address });

  const stats = [
    { label: 'Total Value Locked', value: '$12,450,900', change: '+12.5%', icon: Wallet, color: 'text-blue-400' },
    { label: 'Active Members', value: '4,203', change: '+3.2%', icon: Users, color: 'text-teal-400' },
    { label: 'Treasury Yield (APY)', value: '8.4%', change: '-0.5%', icon: TrendingUp, color: 'text-green-400' },
  ];

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-aqua-500/10 p-4 rounded-full mb-6 animate-pulse">
          <ShieldCheck className="w-16 h-16 text-aqua-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-4">
          Welcome to AquaMetaverse
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8">
          The banking-grade financial layer of the deep web. Connect your wallet to manage your identity, 
          access the treasury, and participate in governance.
        </p>
        <div className="pointer-events-none opacity-50 filter blur-[1px]">
          {/* Visual placeholder for connect, actual button is in nav */}
          <Button size="lg">Connect Wallet to Enter</Button>
        </div>
        <p className="mt-4 text-xs text-slate-500">Please use the Connect Button in the top right.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Command Center</h1>
          <p className="text-slate-400">Welcome back, <span className="text-aqua-400 font-mono">{ensName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Commander')}</span></p>
        </div>
        <div className="flex gap-3">
          <Link to="/ens-write">
            <Button variant="outline">Manage Identity</Button>
          </Link>
          <Button>View Portfolio</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col justify-between h-32">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="flex items-center text-xs">
              <span className={stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                {stat.change}
              </span>
              <span className="text-slate-500 ml-1">from last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Identity Section */}
        <div className="lg:col-span-2">
          <Card title="Identity Status" className="h-full">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-aqua-500 to-blue-600 flex items-center justify-center shadow-lg shadow-aqua-500/20">
                  {ensName ? (
                    <span className="text-3xl font-bold text-white">{ensName.charAt(0).toUpperCase()}</span>
                  ) : (
                    <ShieldCheck className="w-10 h-10 text-white/80" />
                  )}
                </div>
                {!ensName && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-slate-900" />
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                {ensName ? (
                  <>
                    <h3 className="text-xl font-bold text-white">{ensName}</h3>
                    <p className="text-slate-400 text-sm mb-4">Official Member of AquaMetaverse</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Verified on-chain
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-white">Identity Not Minted</h3>
                    <p className="text-slate-400 text-sm mb-4">
                      You are holding a default address. Burn an Identity NFT to claim your unique 
                      <span className="text-aqua-300 font-mono mx-1">.acquaflow0.eth</span> 
                      subdomain.
                    </p>
                    <Link to="/ens-write">
                      <Button size="sm" className="w-full md:w-auto">Mint Identity Now</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-950/50">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Wallet Balance</p>
                <p className="text-lg font-mono text-white">
                  {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '...'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/50">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Governance Power</p>
                <p className="text-lg font-mono text-white">0.00 VP</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card title="Recent Activity">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Yield Harvested</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                  <p className="text-sm text-green-400">+0.45 ETH</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
