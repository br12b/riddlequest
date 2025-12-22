// This file currently simulates Web3 interactions.
// BELOW IS THE TEMPLATE CODE YOU WOULD USE FOR REAL BASE NETWORK INTEGRATION.

/*
  REAL INTEGRATION INSTRUCTIONS (Base Network):
  
  1. Install dependencies: 
     npm install wagmi viem @tanstack/react-query

  2. Setup Wagmi Config:
  
  import { createConfig, http } from 'wagmi'
  import { base } from 'wagmi/chains'
  import { injected } from 'wagmi/connectors'

  export const config = createConfig({
    chains: [base],
    transports: {
      [base.id]: http(),
    },
    connectors: [injected()],
  })

  3. Use Hooks in App.tsx:
     const { connect } = useConnect()
     const { address, isConnected } = useAccount()
     const { writeContract } = useWriteContract()

*/

// --- MOCK SIMULATION BELOW (For Demo Purposes) ---

export const connectWalletMock = async (): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate Metamask delay
    setTimeout(() => {
      resolve("0x71C...9A23");
    }, 800);
  });
};

export const switchToBaseNetworkMock = async (): Promise<boolean> => {
  console.log("Requesting switch to Base Network (Chain ID: 8453)...");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Switched to Base Network.");
      resolve(true);
    }, 500);
  });
};

export const payEntryFeeMock = async (amount: number): Promise<boolean> => {
  console.log(`Sending ${amount} ETH to Game Contract on Base...`);
  // In real app: 
  // writeContract({ 
  //   address: CONTRACT_ADDRESS, 
  //   abi: GAME_ABI, 
  //   functionName: 'play', 
  //   value: parseEther(amount.toString()) 
  // })
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // 95% chance of success, 5% simulate failed tx
      const success = Math.random() > 0.05;
      if (success) console.log("Transaction Confirmed: Block 129384...");
      else console.error("Transaction Failed: Insufficient Gas");
      resolve(success);
    }, 2000);
  });
};

export const claimPrizeMock = async (amount: number): Promise<boolean> => {
  console.log(`Claiming ${amount} ETH prize...`);
  // In real app:
  // writeContract({
  //   address: CONTRACT_ADDRESS,
  //   abi: GAME_ABI,
  //   functionName: 'claimPrize'
  // })
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Prize transferred to wallet.");
      resolve(true);
    }, 2500);
  });
};