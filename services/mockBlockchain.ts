
// This file currently simulates Web3 interactions.
// We removed payment logic. Now it's just for Identity (Auth).

export const connectWalletMock = async (): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate Metamask delay
    setTimeout(() => {
      // Return a random mock address for variety if not connected
      const randomAddr = "0x" + Math.floor(Math.random() * 16777215).toString(16) + "...9A23";
      resolve(randomAddr);
    }, 800);
  });
};

// No longer needed to switch networks for payments, but good to keep for future
export const switchToBaseNetworkMock = async (): Promise<boolean> => {
  return Promise.resolve(true);
};
