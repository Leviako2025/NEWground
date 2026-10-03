import { http, createConfig } from 'wagmi';
import { mainnet, bsc, polygon, arbitrum, optimism, base } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Public Project ID for demo purposes - in production, users should use their own
const projectId = 'c02f90d4983a064199a224957097e698'; 

export const config = createConfig({
  chains: [bsc, mainnet, polygon, arbitrum, optimism, base],
  connectors: [
    injected({
      target: 'metaMask',
      shimDisconnect: true,
    }),
    coinbaseWallet({ 
      appName: 'BinancePH Pro',
      preference: 'smartWalletOnly',
    }),
    walletConnect({ 
      projectId,
      showQrModal: true,
      metadata: {
        name: 'BinancePH Pro',
        description: 'Professional Crypto Trading Platform',
        url: 'https://binanceph.com',
        icons: ['https://bin.bnbstatic.com/static/images/common/favicon.ico'],
      }
    }),
  ],
  transports: {
    [bsc.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
});
