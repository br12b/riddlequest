import React from 'react';
import { WalletState } from '../types';

interface Props {
  wallet: WalletState;
  onConnect: () => void;
}

export const WalletButton: React.FC<Props> = ({ wallet, onConnect }) => {
  return (
    <button
      onClick={wallet.isConnected ? undefined : onConnect}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200
        ${wallet.isConnected 
          ? 'bg-fc-card border border-fc-purple/30 text-fc-purple cursor-default' 
          : 'bg-white text-fc-dark hover:bg-gray-200 active:scale-95 shadow-lg shadow-white/10'}
      `}
    >
      <span className={`w-2 h-2 rounded-full ${wallet.isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
      {wallet.isConnected ? (
        <span>{wallet.address}</span>
      ) : (
        <span>Connect Wallet</span>
      )}
    </button>
  );
};