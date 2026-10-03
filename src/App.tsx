import { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './lib/web3';
import { WalletConnect } from './components/WalletConnect';
import { AssetList, Asset } from './components/AssetList';
import { TradingChart } from './components/TradingChart';
import { TradingPanel } from './components/TradingPanel';
import { OrderHistory } from './components/OrderHistory';
import { AuthModal } from './components/AuthModal';
import { SecurityVerification } from './components/SecurityVerification';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { LayoutDashboard, ArrowLeftRight, Wallet, History, Settings, Bell, Menu, LogOut, User as UserIcon, ShieldCheck, Maximize2, Minimize2 } from 'lucide-react';
import { Button, buttonVariants } from './components/ui/button';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';

const queryClient = new QueryClient();

const INITIAL_ASSETS: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 64231.50, change: 2.45, volume: '32.1B' },
  { symbol: 'ETH', name: 'Ethereum', price: 3452.12, change: -1.20, volume: '15.4B' },
  { symbol: 'BNB', name: 'BNB', price: 582.40, change: 0.85, volume: '2.1B' },
  { symbol: 'SOL', name: 'Solana', price: 145.20, change: 5.60, volume: '4.2B' },
  { symbol: 'XRP', name: 'XRP', price: 0.62, change: -0.45, volume: '1.2B' },
  { symbol: 'ADA', name: 'Cardano', price: 0.45, change: 1.10, volume: '0.8B' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.16, change: -2.30, volume: '1.5B' },
];

export default function App() {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(INITIAL_ASSETS[0]);

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => {
        const next = prev.map(asset => {
          // Organic price movement simulation
          const volatility = 0.0012; // 0.12% max move per tick
          const trend = (Math.random() - 0.5) * 0.0001; // Slight random trend
          const changePercent = (Math.random() * 2 - 1) * volatility + trend;
          const newPrice = asset.price * (1 + changePercent);
          const newChange = asset.change + (changePercent * 100);

          return {
            ...asset,
            price: newPrice,
            change: newChange
          };
        });
        
        // Update selected asset if it's in the list
        const updatedSelected = next.find(a => a.symbol === selectedAsset.symbol);
        if (updatedSelected) {
          setSelectedAsset(updatedSelected);
        }
        
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedAsset.symbol]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthReady(true);
      // Reset verification when user changes
      if (!user) setIsVerified(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setIsVerified(false);
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-yellow-500/30">
          {/* Beta Notification Banner */}
          <div className="bg-yellow-500/10 border-b border-yellow-500/20 py-2 px-4">
            <div className="w-full flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-yellow-500">
              <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              <span>System Status: Beta Phase 1.0 — Use our official portal link for now!</span>
            </div>
          </div>

          <AnimatePresence>
            {user && !isVerified && (
              <SecurityVerification 
                email={user.email}
                onVerify={() => setIsVerified(true)}
                onCancel={handleSignOut}
              />
            )}
          </AnimatePresence>

          {/* Header */}
          <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-black text-xl">B</span>
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="text-xl font-black tracking-tighter hidden sm:block">
                    BINANCE<span className="text-yellow-500">PH</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Philippines</span>
                    <span className="text-xs">🇵🇭</span>
                  </div>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-sm font-medium text-yellow-500">Markets</a>
                <a href="#" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Trade</a>
                <a href="#" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Futures</a>
                <a href="#" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Earn</a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex items-center gap-2 text-zinc-400 hover:text-yellow-500 hover:bg-yellow-500/10"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Portal link copied to clipboard!');
                }}
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Share Portal</span>
              </Button>

              {user && (
                <div className={cn(
                  "hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all duration-500",
                  isVerified 
                    ? "bg-green-500/10 border-green-500/20 text-green-500" 
                    : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                )}>
                  <ShieldCheck className={cn("h-3 w-3", isVerified && "animate-pulse")} />
                  <span>Security Checkpoint: {isVerified ? 'Verified' : 'Pending'}</span>
                </div>
              )}
              
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-zinc-400">Network: Mainnet</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-zinc-400 hover:text-zinc-100 hidden sm:flex"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100">
                <Bell className="h-5 w-5" />
              </Button>
              
              {authReady && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "gap-2 text-zinc-100 hover:bg-zinc-900")}>
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-zinc-400" />
                        </div>
                        <span className="hidden sm:inline text-sm font-medium">
                          {user.displayName || user.email?.split('@')[0]}
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-100 w-48">
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-zinc-900">
                          <UserIcon className="h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-zinc-900">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 cursor-pointer hover:bg-zinc-900 text-red-500 focus:text-red-500"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AuthModal defaultTab="signin" />
                      <AuthModal defaultTab="signup" />
                    </div>
                  )}
                </>
              )}

              <WalletConnect />
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </header>

          <main className="p-2 lg:p-4 w-full max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Sidebar - Asset List */}
              <div className="lg:col-span-3 h-[calc(100vh-120px)]">
                <AssetList assets={assets} onSelect={setSelectedAsset} />
              </div>

              {/* Center - Chart & History */}
              <div className="lg:col-span-6 space-y-4">
                <motion.div
                  key={selectedAsset.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <TradingChart asset={selectedAsset} />
                </motion.div>

                <OrderHistory isVerified={isVerified} />
              </div>

              {/* Right Sidebar - Trading Panel */}
              <div className="lg:col-span-3 h-[calc(100vh-120px)]">
                <TradingPanel asset={selectedAsset} isVerified={isVerified} />
              </div>
            </div>

            {/* Site Footer */}
            <footer className="mt-20 py-12 border-t border-zinc-900">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <span className="text-black font-black text-xl">B</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter">BINANCE<span className="text-yellow-500">PH</span></span>
                  </div>
                  <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
                    The most trusted cryptocurrency exchange in the Philippines. 
                    Trade with confidence on the official www.binanceph.com platform.
                  </p>
                </div>
                <div>
                  <h4 className="text-zinc-100 font-bold mb-4 text-sm">Platform</h4>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><a href="#" className="hover:text-yellow-500 transition-colors">Markets</a></li>
                    <li><a href="#" className="hover:text-yellow-500 transition-colors">Trading</a></li>
                    <li><a href="#" className="hover:text-yellow-500 transition-colors">Fees</a></li>
                    <li><a href="#" className="hover:text-yellow-500 transition-colors">Security</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-zinc-100 font-bold mb-4 text-sm">Support</h4>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><a href="#" className="hover:text-yellow-500 transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-yellow-500 transition-colors">API Docs</a></li>
                    <li><a href="#" className="hover:text-yellow-500 transition-colors">Contact Us</a></li>
                    <li><a href="#" className="hover:text-yellow-500 transition-colors">Legal</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-zinc-600">
                  © 2026 BINANCEPH (www.binanceph.com). All rights reserved.
                </p>
                <div className="flex gap-6 text-xs text-zinc-600">
                  <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
                  <a href="#" className="hover:text-zinc-400">Terms of Service</a>
                  <a href="#" className="hover:text-zinc-400">Cookie Policy</a>
                </div>
              </div>
            </footer>
          </main>

          {/* Footer Stats Bar */}
          <footer className="fixed bottom-0 left-0 right-0 h-10 bg-zinc-950 border-t border-zinc-800 px-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-zinc-500 z-50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-zinc-600">BTC/USDT</span>
                <span className="text-green-500">64,231.50 (+2.45%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600">ETH/USDT</span>
                <span className="text-red-500">3,452.12 (-1.20%)</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-zinc-600">BNB/USDT</span>
                <span className="text-green-500">582.40 (+0.85%)</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>Stable Connection</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-0.5 h-2 bg-green-500" />)}
              </div>
            </div>
          </footer>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
