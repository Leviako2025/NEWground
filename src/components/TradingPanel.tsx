import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Asset } from './AssetList';
import { Wallet, ArrowRightLeft, Lock } from 'lucide-react';
import { auth } from '../lib/firebase';
import { AuthModal } from './AuthModal';
import { cn } from '@/lib/utils';

export function TradingPanel({ asset, isVerified }: { asset: Asset, isVerified: boolean }) {
  const [amount, setAmount] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [leverage, setLeverage] = useState(1);
  const user = auth.currentUser;
  const showLock = !user || !isVerified;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 h-full relative overflow-hidden flex flex-col">
      {showLock && (
        <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
            <Lock className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">
            {!user ? 'Login Required' : 'Security Verification'}
          </h3>
          <p className="text-sm text-zinc-400 mb-6">
            {!user 
              ? `Please sign in to start trading ${asset.name} and manage your portfolio.`
              : 'Please complete the security verification to unlock trading features.'}
          </p>
          {!user && <AuthModal />}
        </div>
      )}
      
      <div className="flex-1 space-y-6">
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900 mb-6">
            <TabsTrigger value="buy" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Buy</TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Sell</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setOrderType('market')}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all",
                orderType === 'market' ? "bg-zinc-800 border-zinc-700 text-zinc-100" : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              Market
            </button>
            <button 
              onClick={() => setOrderType('limit')}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all",
                orderType === 'limit' ? "bg-zinc-800 border-zinc-700 text-zinc-100" : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              Limit
            </button>
          </div>

          <TabsContent value="buy" className="space-y-6 m-0">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <span>Price</span>
                <span>USDT</span>
              </div>
              <Input 
                type="number" 
                value={orderType === 'market' ? asset.price.toFixed(2) : undefined} 
                readOnly={orderType === 'market'}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 font-mono focus-visible:ring-yellow-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <span>Amount</span>
                <span>{asset.symbol}</span>
              </div>
              <Input 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 font-mono focus-visible:ring-green-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <span>Leverage</span>
                <span className="text-yellow-500">{leverage}x</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="125" 
                step="1"
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <div className="flex justify-between text-[8px] text-zinc-600 font-bold uppercase">
                <span>1x</span>
                <span>25x</span>
                <span>50x</span>
                <span>75x</span>
                <span>100x</span>
                <span>125x</span>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-zinc-500 font-medium">Total Cost</span>
                <span className="text-zinc-100 font-mono font-bold">
                  ${((Number(amount) * asset.price) / leverage).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 shadow-lg shadow-green-900/20">
                Long {asset.symbol}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-6 m-0">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <span>Price</span>
                <span>USDT</span>
              </div>
              <Input 
                type="number" 
                value={orderType === 'market' ? asset.price.toFixed(2) : undefined} 
                readOnly={orderType === 'market'}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 font-mono focus-visible:ring-yellow-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <span>Amount</span>
                <span>{asset.symbol}</span>
              </div>
              <Input 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 font-mono focus-visible:ring-red-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <span>Leverage</span>
                <span className="text-yellow-500">{leverage}x</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="125" 
                step="1"
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <div className="flex justify-between text-[8px] text-zinc-600 font-bold uppercase">
                <span>1x</span>
                <span>25x</span>
                <span>50x</span>
                <span>75x</span>
                <span>100x</span>
                <span>125x</span>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-zinc-500 font-medium">Total Cost</span>
                <span className="text-zinc-100 font-mono font-bold">
                  ${((Number(amount) * asset.price) / leverage).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 shadow-lg shadow-red-900/20">
                Short {asset.symbol}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-8 border-t border-zinc-900">
          <div className="flex items-center gap-2 text-zinc-400 mb-4">
            <Wallet className="h-4 w-4 text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Wallet Balance</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500 font-medium">USDT</span>
              <span className="text-sm text-zinc-100 font-mono font-bold">12,450.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500 font-medium">{asset.symbol}</span>
              <span className="text-sm text-zinc-100 font-mono font-bold">0.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between shrink-0">
        <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Official Platform</span>
        <span className="text-[10px] text-yellow-500/40 font-mono">www.binanceph.com</span>
      </div>
    </div>
  );
}
