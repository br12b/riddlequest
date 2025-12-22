export type LanguageCode = 'en' | 'fr' | 'es' | 'tr';

export interface VisualConfig {
  colors: string[]; // Hex codes ['#FF0000', '#000000']
  animationSpeed: 'slow' | 'normal' | 'fast' | 'chaos';
  shapeStyle: 'rounded' | 'sharp' | 'liquid';
  complexity: 'minimal' | 'complex';
}

export interface RiddleData {
  id: string;
  question: string; // Now a very short, cryptic poetic line
  visualConfig: VisualConfig; // Instructions for the Generative Canvas
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ValidationResponse {
  isCorrect: boolean;
  explanation: string;
}

export enum GameState {
  LOADING = 'LOADING',
  IDLE = 'IDLE', 
  SUBMITTING = 'SUBMITTING', 
  WON = 'WON',      // Puzzle solved, waiting to claim
  CLAIMING = 'CLAIMING', // Transaction in progress
  CLAIMED = 'CLAIMED',   // Funds transferred
  LOST = 'LOST', 
  ERROR = 'ERROR'
}

export interface WalletState {
  address: string | null;
  balance: number;
  isConnected: boolean;
}

export interface ActivityLog {
  id: number;
  text: string;
  type: 'entry' | 'win' | 'fail';
}