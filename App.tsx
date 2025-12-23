
import React, { useState, useEffect, useCallback } from 'react';
import { RiddleData, WalletState, GameState, ActivityLog, LanguageCode, LeaderboardEntry } from './types';
import { generateDailyRiddle, validateAnswerWithAI } from './services/geminiService';
import { connectWalletMock } from './services/mockBlockchain';
import { getLeaderboard } from './services/leaderboardService';
import { WalletButton } from './components/WalletButton';
import { RiddleCard } from './components/RiddleCard';
import { Leaderboard } from './components/Leaderboard';
import { RocketLaunchIcon, SparklesIcon, LockClosedIcon, BoltIcon, ClockIcon, StarIcon, CheckBadgeIcon, ChartBarIcon } from '@heroicons/react/24/solid';

// Points System
const POINTS_MAP = {
  Easy: 500,
  Medium: 1000,
  Hard: 2000
};

// Translations Dictionary
const TRANSLATIONS = {
  en: {
    title: "ARTIFACT",
    subtitle: "QUEST",
    edition: "Farcaster Edition",
    userScore: "Your Score",
    entryFee: "FREE ENTRY",
    winnerTakesAll: "COMPETE FOR GLORY",
    jackpotSecured: "ARTIFACT DECODED",
    outsmarted: "Your vision is clear.",
    totalPayout: "XP Earned",
    accessDenied: "SYNC FAILED",
    retry: "Try Again",
    placeholder: "What is this?",
    connectToPlay: "Connect to Decipher",
    verifying: "Analyzing Signal...",
    submit: "Decipher",
    processing: "Processing...",
    rejected: "Connection Rejected.",
    oracle: "Scanning Neural Network...",
    missed: "Interpretation Mismatch.",
    winMsg: "ARTIFACT SUCCESSFULLY DECODED!",
    network: "Neural Activity",
    footerJoined: "linked",
    footerFailed: "lost signal",
    footerThinking: "scanning...",
    loading: "Materializing Artifact...",
    collect: "COLLECT XP",
    claimed: "XP SECURED",
    claimedMsg: "You've risen in the ranks.",
    leaderboardBtn: "Leaderboard"
  },
  fr: {
    title: "ARTEFACT",
    subtitle: "QUÊTE",
    edition: "Édition Farcaster",
    userScore: "Votre Score",
    entryFee: "ENTRÉE GRATUITE",
    winnerTakesAll: "COMPÉTITION POUR LA GLOIRE",
    jackpotSecured: "ARTEFACT DÉCODÉ",
    outsmarted: "Votre vision est claire.",
    totalPayout: "XP Gagné",
    accessDenied: "SYNC ÉCHOUÉE",
    retry: "Réessayer",
    placeholder: "Qu'est-ce que c'est ?",
    connectToPlay: "Connecter pour Déchiffrer",
    verifying: "Analyse...",
    submit: "Déchiffrer",
    processing: "Traitement...",
    rejected: "Connexion Rejetée.",
    oracle: "Scan du Réseau Neural...",
    missed: "Interprétation Incorrecte.",
    winMsg: "ARTEFACT DÉCODÉ AVEC SUCCÈS !",
    network: "Activité Neurale",
    footerJoined: "lié",
    footerFailed: "signal perdu",
    footerThinking: "scan...",
    loading: "Matérialisation...",
    collect: "RÉCUPÉRER XP",
    claimed: "XP SÉCURISÉ",
    claimedMsg: "Vous avez monté en rang.",
    leaderboardBtn: "Classement"
  },
  es: {
    title: "ARTEFACTO",
    subtitle: "QUEST",
    edition: "Edición Farcaster",
    userScore: "Tu Puntuación",
    entryFee: "ENTRADA GRATIS",
    winnerTakesAll: "COMPITE POR LA GLORIA",
    jackpotSecured: "ARTEFACTO DECODIFICADO",
    outsmarted: "Tu visión es clara.",
    totalPayout: "XP Ganado",
    accessDenied: "FALLO DE SYNC",
    retry: "Intentar de Nuevo",
    placeholder: "¿Qué es esto?",
    connectToPlay: "Conectar para Descifrar",
    verifying: "Analizando...",
    submit: "Descifrar",
    processing: "Procesando...",
    rejected: "Conexión Rechazada.",
    oracle: "Escaneando Red Neural...",
    missed: "Interpretación Incorrecta.",
    winMsg: "¡ARTEFACTO DECODIFICADO!",
    network: "Actividad Neural",
    footerJoined: "conectado",
    footerFailed: "perdió señal",
    footerThinking: "escaneando...",
    loading: "Materializando...",
    collect: "RECOGER XP",
    claimed: "XP ASEGURADO",
    claimedMsg: "Has subido de rango.",
    leaderboardBtn: "Clasificación"
  },
  tr: {
    title: "ESER",
    subtitle: "GÖREVİ",
    edition: "Farcaster Sürümü",
    userScore: "Puanın",
    entryFee: "ÜCRETSİZ KATILIM",
    winnerTakesAll: "SIRALAMAYA GİR",
    jackpotSecured: "ESER ÇÖZÜLDÜ",
    outsmarted: "Vizyonun netleşti.",
    totalPayout: "Kazanılan XP",
    accessDenied: "YANLIŞ TAHMİN",
    retry: "Tekrar Dene",
    placeholder: "Bu nedir?",
    connectToPlay: "Çözmek için Bağlan",
    verifying: "Sinyal Analiz Ediliyor...",
    submit: "Şifreyi Çöz",
    processing: "İşleniyor...",
    rejected: "Bağlantı Reddedildi.",
    oracle: "Sinir Ağı Taranıyor...",
    missed: "Hatalı yorum.",
    winMsg: "ESER BAŞARIYLA ÇÖZÜLDÜ!",
    network: "Sinirsel Aktivite",
    footerJoined: "bağlandı",
    footerFailed: "yanlış bildi",
    footerThinking: "taranıyor...",
    loading: "Eser Oluşturuluyor...",
    collect: "XP TOPLA",
    claimed: "XP KAYDEDİLDİ",
    claimedMsg: "Sıralamada yükseldin.",
    leaderboardBtn: "Liderlik Tablosu"
  }
};

const LANGUAGES: { code: LanguageCode; flag: string; label: string }[] = [
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'tr', flag: '🇹🇷', label: 'TR' },
];

export default function App() {
  const [lang, setLang] = useState<LanguageCode>('tr'); // Default TR as requested
  const t = TRANSLATIONS[lang]; 

  const [riddle, setRiddle] = useState<RiddleData | null>(null);
  const [isRiddleLoading, setIsRiddleLoading] = useState(true);
  
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
  });
  
  // Game Stats
  const [userScore, setUserScore] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [activityFeed, setActivityFeed] = useState<ActivityLog[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchRiddle = async () => {
      setIsRiddleLoading(true);
      setGameState(GameState.LOADING);
      try {
        const data = await generateDailyRiddle(lang);
        if (isMounted) {
          setRiddle(data);
          setGameState(GameState.IDLE);
          setIsRiddleLoading(false);
          setUserAnswer('');
          setFeedback('');
        }
      } catch (e) {
        console.error("Critical Error fetching riddle:", e);
        if (isMounted) {
          setGameState(GameState.ERROR);
          setIsRiddleLoading(false);
        }
      }
    };

    fetchRiddle();

    // Load Mock Leaderboard
    getLeaderboard().then(data => {
      if(isMounted) setLeaderboard(data);
    });

    return () => { isMounted = false; };
  }, [lang]); 

  // Activity Feed Interval
  useEffect(() => {
    const generateMockActivity = (id: number, currentLang: LanguageCode): ActivityLog => {
      const tr = TRANSLATIONS[currentLang];
      const actions = [tr.footerFailed, tr.footerJoined, tr.footerThinking];
      const addr = `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`;
      return {
        id,
        text: `${addr} ${actions[Math.floor(Math.random() * actions.length)]}`,
        type: 'fail'
      };
    };

    const interval = setInterval(() => {
      setActivityFeed(prev => [generateMockActivity(Date.now(), lang), ...prev].slice(0, 3));
    }, 4000);
    return () => clearInterval(interval);
  }, [lang]);

  const changeLanguage = (newLang: LanguageCode) => {
    if (newLang === lang) return;
    setLang(newLang);
  };

  const handleConnect = useCallback(async () => {
    try {
      const address = await connectWalletMock();
      setWallet({ address, isConnected: true });
      // Simulate fetching user's existing score
      setUserScore(1250); 
    } catch (e) {
      console.error("Failed to connect", e);
    }
  }, []);

  const triggerConfetti = () => {
    // @ts-ignore
    if (window.confetti) {
       // @ts-ignore
       window.confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00ff9d', '#FFD700', '#ffffff']
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riddle || !wallet.isConnected) return;
    
    setGameState(GameState.SUBMITTING);
    setFeedback(t.oracle);

    try {
      // Validate Answer
      const result = await validateAnswerWithAI(riddle.question, userAnswer, lang);

      if (result.isCorrect) {
        setGameState(GameState.WON);
        setFeedback(result.explanation);
        triggerConfetti();
        
        // Calculate Points
        const earnedPoints = POINTS_MAP[riddle.difficulty];
        
        // Update Activity Feed
        setActivityFeed(prev => [{id: Date.now(), text: `${t.winMsg} (+${earnedPoints} XP)`, type: 'win'}, ...prev]);

        // Add to score instantly (Mock)
        setUserScore(prev => prev + earnedPoints);

      } else {
        setGameState(GameState.LOST);
        setFeedback(result.explanation || t.missed);
        setActivityFeed(prev => [{id: Date.now(), text: `${t.missed}`, type: 'fail'}, ...prev]);
      }
    } catch (error) {
      setGameState(GameState.ERROR);
      setFeedback("System Error.");
    }
  };

  const resetGame = () => {
    setUserAnswer('');
    setGameState(GameState.IDLE);
    setFeedback('');
  };

  const startNewRound = () => {
     window.location.reload(); 
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-fc-dark text-white font-sans flex flex-col items-center">
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-fc-purple/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fc-neon/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-6xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center z-50 gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
          <div className="w-10 h-10 bg-gradient-to-br from-fc-purple to-indigo-900 rounded-xl flex items-center justify-center border border-white/10 shadow-lg shadow-fc-purple/20 flex-shrink-0">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-wide uppercase whitespace-nowrap">{t.title}<span className="text-fc-neon">{t.subtitle}</span></h1>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block">{t.edition}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3 w-full sm:w-auto">
            {/* Language Selector */}
            <div className="flex items-center bg-black/30 rounded-full p-1 border border-white/10">
                {LANGUAGES.map((l) => (
                    <button
                        key={l.code}
                        onClick={() => changeLanguage(l.code)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            lang === l.code 
                            ? 'bg-fc-purple text-white shadow-lg' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {l.flag} {l.label}
                    </button>
                ))}
            </div>

            <button 
              onClick={toggleLeaderboard}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              title="Leaderboard"
            >
              <ChartBarIcon className="w-6 h-6 text-yellow-500" />
            </button>

            <WalletButton wallet={wallet} onConnect={handleConnect} />
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl px-4 py-6 flex flex-col items-center gap-6 md:gap-10 z-10 pb-20">
        
        {/* HERO SCORE SECTION */}
        <div className="w-full relative group cursor-default">
          <div className="absolute inset-0 bg-gradient-to-r from-fc-purple/20 to-fc-neon/20 blur-2xl rounded-full opacity-50 animate-pulse-slow"></div>
          <div className="relative bg-black/40 backdrop-blur-md border border-fc-purple/30 rounded-3xl p-6 md:p-8 text-center overflow-hidden">
             
             {/* Scanlines */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>
             
             <div className="relative z-10 flex flex-col items-center">
               <span className="flex items-center gap-2 text-fc-neon font-display font-bold tracking-[0.3em] text-xs uppercase mb-2">
                 <BoltIcon className="w-4 h-4" /> {t.userScore}
               </span>
               
               <div className="text-5xl sm:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-fc-purple to-indigo-500 drop-shadow-[0_0_15px_rgba(133,93,205,0.5)]">
                 {userScore.toLocaleString()} <span className="text-3xl text-fc-purple/50">XP</span>
               </div>
               
               <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs font-mono text-gray-400 bg-black/50 px-4 py-2 rounded-full border border-white/5">
                 <span className="flex items-center gap-1">
                    <StarIcon className="w-3 h-3 text-yellow-500" />
                    {riddle ? `Prize: ${POINTS_MAP[riddle.difficulty]} XP` : 'Loading...'}
                 </span>
                 <span className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></span>
                 <span>{t.winnerTakesAll}</span>
               </div>
             </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        {showLeaderboard ? (
          <div className="w-full animate-in fade-in slide-in-from-bottom-5 duration-500">
            <Leaderboard entries={leaderboard} currentUserAddress={wallet.address} />
            <button 
              onClick={() => setShowLeaderboard(false)}
              className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold uppercase tracking-wider text-sm transition-all"
            >
              Close Leaderboard
            </button>
          </div>
        ) : (
          <div className="w-full space-y-6 md:space-y-8 relative min-h-[300px]">
             
             {/* Loading Overlay */}
             {isRiddleLoading && (
               <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-fc-dark/60 backdrop-blur-sm rounded-3xl transition-all">
                  <ClockIcon className="w-10 h-10 text-fc-neon animate-spin mb-4" />
                  <p className="text-fc-neon font-display tracking-widest text-sm animate-pulse">{t.loading}</p>
               </div>
             )}

             {/* Riddle Card */}
             {riddle && (
               <div className={`transition-opacity duration-500 ${isRiddleLoading ? 'opacity-30 blur-sm' : 'opacity-100'}`}>
                  <RiddleCard riddle={riddle} isLoading={false} />
               </div>
             )}

             <div className={`w-full max-w-md mx-auto transition-opacity duration-300 ${isRiddleLoading ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
               
               {/* WON STATE */}
               {gameState === GameState.WON ? (
                 <div className="bg-gradient-to-br from-green-900/40 to-green-600/20 border border-green-500/50 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                   <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                     <CheckBadgeIcon className="w-10 h-10 text-black" />
                   </div>
                   <h3 className="text-2xl sm:text-3xl font-display font-bold text-green-400 mb-2">{t.claimed}</h3>
                   <p className="text-white font-medium mb-6">{t.claimedMsg}</p>
                   
                   <div className="bg-black/30 p-4 rounded-xl mb-6">
                      <p className="text-sm text-gray-400 uppercase tracking-widest">{t.totalPayout}</p>
                      <p className="text-3xl font-display text-white">+{riddle ? POINTS_MAP[riddle.difficulty] : 0} XP</p>
                   </div>

                   <button 
                      onClick={startNewRound}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold uppercase tracking-wider text-sm"
                   >
                     Next Puzzle
                   </button>
                 </div>
               ) : gameState === GameState.LOST ? (
                  <div className="bg-red-500/5 border border-red-500/30 rounded-2xl p-6 sm:p-8 text-center backdrop-blur-sm">
                   <h3 className="text-xl font-display font-bold text-red-500 mb-2">{t.accessDenied}</h3>
                   <p className="text-red-200/80 mb-6 text-sm">{feedback}</p>
                   <button 
                     onClick={resetGame}
                     className="w-full py-4 bg-red-600/20 hover:bg-red-600/40 border border-red-500 text-red-100 rounded-xl font-bold transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                   >
                     <span>{t.retry}</span>
                   </button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="relative z-20 pb-4">
                    <div className="relative group">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder={t.placeholder}
                        disabled={!wallet.isConnected || gameState === GameState.SUBMITTING}
                        className="w-full bg-[#1A1523]/80 backdrop-blur-sm border border-white/10 focus:border-fc-purple/50 focus:ring-1 focus:ring-fc-purple/50 rounded-2xl py-4 sm:py-5 px-6 text-base sm:text-lg text-center outline-none transition-all placeholder:text-gray-600 text-white font-medium shadow-xl"
                      />
                      {!wallet.isConnected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl border border-white/5 z-30">
                          <span className="text-sm font-semibold flex items-center gap-2 text-gray-300">
                            <LockClosedIcon className="w-4 h-4" /> {t.connectToPlay}
                          </span>
                        </div>
                      )}
                    </div>

                    {wallet.isConnected && (
                      <button
                        type="submit"
                        disabled={gameState === GameState.SUBMITTING || !userAnswer.trim()}
                        className={`
                          w-full mt-4 py-4 rounded-2xl font-display font-bold text-base sm:text-lg uppercase tracking-wider shadow-lg transition-all relative overflow-hidden group border
                          ${gameState === GameState.SUBMITTING 
                            ? 'bg-gray-800 text-gray-400 cursor-wait border-gray-700' 
                            : 'bg-white text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] border-white'}
                        `}
                      >
                        {gameState === GameState.SUBMITTING ? (
                          <span className="flex items-center justify-center gap-2 text-sm">
                             <ClockIcon className="w-5 h-5 animate-spin" />
                             {t.verifying}
                          </span>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                             <div className="flex items-center gap-2">
                               <RocketLaunchIcon className="w-5 h-5 text-fc-purple group-hover:text-black transition-colors" />
                               <span>{t.submit}</span>
                             </div>
                          </div>
                        )}
                      </button>
                    )}
                 </form>
               )}
             </div>
          </div>
        )}

      </main>

      {/* Footer / Live Ticker */}
      <footer className="w-full border-t border-white/5 bg-black/60 backdrop-blur-xl z-50">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               {t.network}
            </div>
            
            <div className="flex-1 w-full overflow-hidden relative h-6">
               <div className="absolute inset-0 flex flex-col items-center md:items-end justify-center transition-all duration-500">
                  {activityFeed.length > 0 && (
                    <span key={activityFeed[0].id} className="text-xs font-mono text-gray-400 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       {activityFeed[0].text}
                    </span>
                  )}
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
