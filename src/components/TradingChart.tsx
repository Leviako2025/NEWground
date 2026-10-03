import { useMemo, useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { Asset } from './AssetList';

export function TradingChart({ asset }: { asset: Asset }) {
  const [history, setHistory] = useState<{ time: string; price: number; volume: number }[]>([]);

  // Initialize history
  useEffect(() => {
    const points = [];
    let currentPrice = asset.price;
    const now = new Date();
    for (let i = 40; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 10000);
      currentPrice = currentPrice * (1 + (Math.random() * 0.002 - 0.001));
      points.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: currentPrice,
        volume: Math.random() * 100 + 50
      });
    }
    setHistory(points);
  }, [asset.symbol]);

  // Update history with live price
  useEffect(() => {
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (last && last.price === asset.price) return prev;
      
      const now = new Date();
      const newPoint = {
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: asset.price,
        volume: Math.random() * 150 + 50
      };
      
      const next = [...prev, newPoint];
      if (next.length > 50) return next.slice(1);
      return next;
    });
  }, [asset.price]);

  return (
    <div className="h-[450px] w-full bg-zinc-950 rounded-xl p-6 border border-zinc-800 flex flex-col shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black text-zinc-100 tracking-tighter">{asset.symbol}/USDT</h2>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{asset.name} Perpetual</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-mono font-bold ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-mono ${asset.change >= 0 ? 'text-green-500/70' : 'text-red-500/70'}`}>
              {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="flex gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
          {['1s', '1m', '5m', '15m', '1h', '4h', '1d'].map((tf) => (
            <button
              key={tf}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                tf === '1s' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full relative">
        <div className="absolute inset-0 flex flex-col">
          {/* Price Chart */}
          <div className="flex-[3] min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  hide
                />
                <YAxis 
                  hide 
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#eab308', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#71717a', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                  cursor={{ stroke: '#52525b', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#eab308" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Volume Chart */}
          <div className="flex-1 min-h-0 mt-4 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Bar dataKey="volume">
                  {history.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index > 0 && history[index].price >= history[index-1].price ? '#22c55e' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between shrink-0">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">24h High</span>
            <span className="text-[10px] font-mono text-zinc-300">{(asset.price * 1.05).toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">24h Low</span>
            <span className="text-[10px] font-mono text-zinc-300">{(asset.price * 0.95).toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">24h Volume</span>
            <span className="text-[10px] font-mono text-zinc-300">{asset.volume} USDT</span>
          </div>
        </div>
        <div className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest">
          Live Market Data Feed
        </div>
      </div>
    </div>
  );
}
