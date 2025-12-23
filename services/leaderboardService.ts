
import { LeaderboardEntry } from "../types";

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, address: "0x71C...9A23", score: 15400, badges: ["👑", "🧠"] },
  { rank: 2, address: "0xA4B...11FE", score: 12200, badges: ["🔥"] },
  { rank: 3, address: "0x99C...44DD", score: 9800, badges: ["⚡"] },
  { rank: 4, address: "0x12F...88AA", score: 8500, badges: [] },
  { rank: 5, address: "0x33D...22BB", score: 6000, badges: [] },
];

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_LEADERBOARD);
    }, 500);
  });
};

export const submitScore = async (address: string, scoreToAdd: number): Promise<boolean> => {
  console.log(`Adding ${scoreToAdd} XP to ${address}`);
  return true; // Simulate API success
};
