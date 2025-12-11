
import React, { useState, useEffect, useRef } from 'react';
import { Gift, X, Zap, CheckCircle, RotateCw, Clock, ExternalLink, PlayCircle } from 'lucide-react';

interface GamificationProps {
  onClose: () => void;
  onReward: (coins: number, newStreak: number) => void;
  lastCheckInDate: string;
  currentStreak: number;
}

export const DailyCheckIn: React.FC<GamificationProps> = ({ onClose, onReward, lastCheckInDate, currentStreak }) => {
  const [claimed, setClaimed] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [nextStreak, setNextStreak] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (lastCheckInDate === today) {
      setCanClaim(false);
      setStatusMessage("¡Ya reclamaste tu premio hoy!");
      setRewardAmount(currentStreak); // Just for display
      setNextStreak(currentStreak);
    } else if (lastCheckInDate === yesterday) {
      // Continued streak
      const next = currentStreak >= 30 ? 1 : currentStreak + 1;
      setRewardAmount(next);
      setNextStreak(next);
      setCanClaim(true);
      setStatusMessage(`¡Racha Día ${next}! ¡Sigue así!`);
    } else {
      // Missed a day or first time
      setRewardAmount(1);
      setNextStreak(1);
      setCanClaim(true);
      setStatusMessage(lastCheckInDate ? "¡Racha perdida! Empezando de nuevo." : "¡Bienvenido! Inicia tu racha.");
    }
  }, [lastCheckInDate, currentStreak]);

  const handleClaim = () => {
    if (!canClaim) return;
    setClaimed(true);
    setTimeout(() => {
      onReward(rewardAmount, nextStreak);
      onClose();
    }, 1500);
  };

  // Generate a mini calendar visualization of next 5 days
  const renderUpcomingRewards = () => {
    return (
      <div className="flex justify-center gap-2 mt-4 mb-6">
        {[0, 1, 2, 3].map((offset) => {
          let day = nextStreak + offset;
          if (!canClaim && offset === 0) day = currentStreak; // show current if claimed
          // Logic for wrap around 30 isn't strictly necessary for simple visual unless near 30
          if (day > 30) day = 1 + (day - 31);
          
          const isToday = offset === 0;
          return (
             <div key={offset} className={`flex flex-col items-center p-2 rounded-lg border ${isToday ? 'bg-solar-100 border-solar-500' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[10px] uppercase text-gray-500">{isToday ? 'Hoy' : `Día +${offset}`}</span>
                <div className="font-bold text-slate-800 flex items-center">
                    <span className="text-yellow-500 mr-0.5">●</span>{day}
                </div>
             </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative animate-bounce-slow shadow-2xl border-4 border-solar-400">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-solar-300 to-urgency-500 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-white relative">
            <Gift className="text-white w-12 h-12" />
            <div className="absolute -bottom-2 bg-slate-900 text-white text-xs px-2 py-1 rounded-full font-bold">
               Día {canClaim ? nextStreak : currentStreak}/30
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 uppercase italic">Impulso Solar Diario</h2>
          <p className="text-sm font-medium text-solar-600 mt-1">{statusMessage}</p>

          {renderUpcomingRewards()}
          
          {!claimed ? (
            <button 
              onClick={handleClaim}
              disabled={!canClaim}
              className={`w-full font-bold py-4 rounded-xl text-xl shadow-lg transition-all flex items-center justify-center gap-2
                ${canClaim 
                  ? 'bg-gradient-to-r from-solar-500 to-urgency-500 text-white hover:shadow-xl transform hover:-translate-y-1' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {canClaim ? (
                <>
                  <Zap className="fill-current" />
                  RECLAMAR {rewardAmount} MONEDAS
                </>
              ) : (
                <>
                  <CheckCircle />
                  VUELVE MAÑANA
                </>
              )}
            </button>
          ) : (
            <div className="text-green-500 font-bold text-xl animate-pulse py-4">
              ¡+{rewardAmount} QvaCoins Añadidas!
            </div>
          )}
          
          <p className="text-xs text-gray-400 mt-4">La racha se reinicia a 1 después del día 30 o si fallas un día.</p>
        </div>
      </div>
    </div>
  );
};

export const FlashSaleBanner: React.FC = () => {
  // Start with 4 hours, 15 mins, 22 seconds in seconds
  const [timeLeft, setTimeLeft] = useState(15322);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 86400)); // Reset to 24h if hits 0
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-urgency-600 via-solar-500 to-urgency-600 text-white text-center py-2 px-4 font-bold text-sm sm:text-base shadow-md relative overflow-hidden cursor-pointer group hover:brightness-110 transition-all">
      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-x-12 translate-x-full animate-shimmer"></div>
      <div className="flex justify-center items-center gap-2 flex-wrap">
          <span className="animate-pulse">⚡ OFERTA RELÁMPAGO TERMINA EN</span>
          <span className="font-mono bg-black/20 px-2 py-0.5 rounded text-yellow-200 min-w-[80px] inline-block">
             {formatTime(timeLeft)}
          </span>
          <span className="animate-pulse">- ¡HASTA 80% OFF! ⚡</span>
      </div>
    </div>
  );
};

interface WheelSegment {
  label: string;
  value: number; // -1 for retry, 0 for nothing
  color: string;
  text: string;
}

const WHEEL_SEGMENTS: WheelSegment[] = [
  { label: '1 Coin', value: 1, color: '#fcd34d', text: '1' },
  { label: 'Nada', value: 0, color: '#ef4444', text: '😢' },
  { label: '10 Coins', value: 10, color: '#fbbf24', text: '10' },
  { label: 'Nuevo Tiro', value: -1, color: '#22c55e', text: '↻' },
  { label: '20 Coins', value: 20, color: '#f59e0b', text: '20' },
  { label: '40 Coins', value: 40, color: '#d97706', text: '40' },
  { label: '100 Coins', value: 100, color: '#9333ea', text: '100' },
];

const AD_LINKS = [
  "https://t.co/KrAbgCwu6C",
  "https://t.co/wYAXqNcmmi",
  "https://t.co/m3FyPkarYK",
  "https://t.co/qcuZL2idu0",
  "https://t.co/OJqP6nNA8q",
  "https://t.co/z8SlYjot0O"
];

export const SpinWheel: React.FC<{ onClose: () => void, onReward: (coins: number) => void }> = ({ onClose, onReward }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelSegment | null>(null);

  // 24h & Ad Logic State
  const [canFreeSpin, setCanFreeSpin] = useState(false);
  const [extraSpinsUsed, setExtraSpinsUsed] = useState(0);
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');
  
  // Ad Watching State
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adTimer, setAdTimer] = useState(0);
  const [readyToSpinExtra, setReadyToSpinExtra] = useState(false);

  useEffect(() => {
    checkAvailability();
    const interval = setInterval(() => {
        checkAvailability();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkAvailability = () => {
      const lastFreeSpin = localStorage.getItem('qvasun_last_free_spin');
      const extraUsed = parseInt(localStorage.getItem('qvasun_extra_spins') || '0');
      
      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000;

      if (!lastFreeSpin) {
          setCanFreeSpin(true);
          setExtraSpinsUsed(0);
          localStorage.setItem('qvasun_extra_spins', '0');
          setTimeUntilNext('');
      } else {
          const lastTime = parseInt(lastFreeSpin);
          const diff = now - lastTime;
          
          if (diff >= ONE_DAY) {
              setCanFreeSpin(true);
              setExtraSpinsUsed(0);
              localStorage.setItem('qvasun_extra_spins', '0');
              setTimeUntilNext('');
          } else {
              setCanFreeSpin(false);
              setExtraSpinsUsed(extraUsed);
              
              // Format Countdown
              const remaining = ONE_DAY - diff;
              const h = Math.floor(remaining / (1000 * 60 * 60));
              const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
              const s = Math.floor((remaining % (1000 * 60)) / 1000);
              setTimeUntilNext(`${h}h ${m}m ${s}s`);
          }
      }
  };

  const handleWatchAd = () => {
      if (extraSpinsUsed >= 6) return;

      const link = AD_LINKS[extraSpinsUsed] || AD_LINKS[0];
      window.open(link, '_blank');
      
      setIsWatchingAd(true);
      setAdTimer(10);

      const timer = setInterval(() => {
          setAdTimer(prev => {
              if (prev <= 1) {
                  clearInterval(timer);
                  setIsWatchingAd(false);
                  setReadyToSpinExtra(true);
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
  };

  const spinWheel = () => {
    if (mustSpin) return;
    setMustSpin(true);
    setResult(null);

    // Wheel Setup Logic...
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    const randomIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const selectedSegment = WHEEL_SEGMENTS[randomIndex];

    const centerAngle = (randomIndex + 0.5) * segmentAngle;
    const safeZone = segmentAngle * 0.4; 
    const jitter = (Math.random() * safeZone * 2) - safeZone;
    const targetRotation = 360 * 5 + (360 - centerAngle) + jitter;
    const finalRotation = rotation + targetRotation;
    
    setRotation(finalRotation);

    setTimeout(() => {
      setMustSpin(false);
      setResult(selectedSegment);
      
      // Update Logic after spin completes
      if (canFreeSpin) {
          localStorage.setItem('qvasun_last_free_spin', Date.now().toString());
          setCanFreeSpin(false);
          checkAvailability(); // Update UI immediately
      } else if (readyToSpinExtra) {
          const newExtra = extraSpinsUsed + 1;
          localStorage.setItem('qvasun_extra_spins', newExtra.toString());
          setExtraSpinsUsed(newExtra);
          setReadyToSpinExtra(false);
      }
      
      if (selectedSegment.value > 0) {
        setTimeout(() => onReward(selectedSegment.value), 1000);
      } else if (selectedSegment.value === 0) {
        setTimeout(() => {
           window.location.href = 'https://t.co/0NFBrp6ZwV';
        }, 1500);
      }
    }, 4000); 
  };

  // Determine Button State
  const isButtonDisabled = mustSpin || (!canFreeSpin && !readyToSpinExtra) || (result !== null && result.value !== -1);
  const showAdButton = !canFreeSpin && !readyToSpinExtra && extraSpinsUsed < 6 && result === null;
  const showCountdown = !canFreeSpin && extraSpinsUsed >= 6;

  // Create conic gradient string
  const gradient = `conic-gradient(
    ${WHEEL_SEGMENTS.map((seg, i) => {
      const start = (i * 100) / WHEEL_SEGMENTS.length;
      const end = ((i + 1) * 100) / WHEEL_SEGMENTS.length;
      return `${seg.color} ${start}% ${end}%`;
    }).join(', ')}
  )`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4 animate-fade-in">
       <div className="relative w-full max-w-sm flex flex-col items-center">
          <button onClick={onClose} className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-white/10 p-2 rounded-full backdrop-blur-md">
            <X size={24} />
          </button>

          <div className="mb-4 text-center text-white">
            <h2 className="text-3xl font-black italic text-solar-400 drop-shadow-lg">RULETA SOLAR</h2>
            <p className="text-sm opacity-80">¡Gira y gana QvaCoins!</p>
          </div>

          <div className="relative w-72 h-72 sm:w-80 sm:h-80 mb-6">
             {/* Pointer */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-10 bg-white shadow-lg" 
                  style={{clipPath: 'polygon(100% 0, 0 0, 50% 100%)'}}></div>
             
             {/* Wheel */}
             <div 
                className="w-full h-full rounded-full border-4 border-white shadow-2xl relative overflow-hidden"
                style={{
                  background: gradient,
                  transform: `rotate(${rotation}deg)`,
                  transition: mustSpin ? 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
                }}
             >
                {/* Labels */}
                {WHEEL_SEGMENTS.map((seg, i) => {
                  const angle = (360 / WHEEL_SEGMENTS.length) * i + (360 / WHEEL_SEGMENTS.length) / 2;
                  return (
                    <div 
                      key={i}
                      className="absolute top-1/2 left-1/2 text-white font-bold text-sm sm:text-base text-shadow-md origin-left"
                      style={{
                        transform: `rotate(${angle - 90}deg) translate(20px, -50%)`,
                        width: '50%',
                        textAlign: 'center',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                       <span className="block transform rotate(90deg) translate-x-8">{seg.text}</span>
                    </div>
                  );
                })}
             </div>
             
             {/* Center Cap */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-inner flex items-center justify-center z-10 border-4 border-slate-200">
                <div className="text-solar-500 font-bold text-xs uppercase text-center leading-tight">Qva<br/>Sun</div>
             </div>
          </div>

          {/* Action Area */}
          <div className="w-full flex flex-col items-center gap-3">
             
             {/* Countdown / Status Message */}
             {!canFreeSpin && (
                <div className="text-white text-center bg-slate-800/80 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-700">
                    {extraSpinsUsed < 6 ? (
                        <p className="text-xs text-gray-300">Giro diario usado. Próximo en: <span className="font-mono text-yellow-400">{timeUntilNext}</span></p>
                    ) : (
                        <div>
                             <p className="text-sm font-bold text-red-400 mb-1">¡Límite alcanzado!</p>
                             <div className="flex items-center gap-2 text-xs text-gray-300">
                                 <Clock size={14}/> Vuelve en: <span className="font-mono text-white text-base">{timeUntilNext}</span>
                             </div>
                        </div>
                    )}
                </div>
             )}

             {/* AD BUTTON */}
             {showAdButton && (
                 <div className="w-full">
                     <p className="text-white text-center text-sm mb-2 font-bold animate-pulse">¿Quieres girar de nuevo?</p>
                     <button
                        onClick={handleWatchAd}
                        disabled={isWatchingAd}
                        className={`w-full py-3 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
                            ${isWatchingAd 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105'
                            }`}
                     >
                        {isWatchingAd ? (
                            `Espera ${adTimer}s...`
                        ) : (
                            <>
                                <PlayCircle size={24} /> VER ANUNCIO ({6 - extraSpinsUsed} Restantes)
                            </>
                        )}
                     </button>
                 </div>
             )}

             {/* SPIN BUTTON */}
             {(!showAdButton && !showCountdown) && (
                 <button 
                    onClick={spinWheel}
                    disabled={isButtonDisabled} 
                    className={`w-full px-8 py-3 rounded-full font-bold text-xl shadow-lg transition-all transform flex items-center justify-center gap-2
                    ${isButtonDisabled 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-solar-500 to-orange-600 text-white hover:scale-105 active:scale-95'}`}
                >
                    {mustSpin 
                        ? 'GIRANDO...' 
                        : result 
                            ? (result.value === -1 ? 'GIRAR DE NUEVO' : (result.value > 0 ? `¡GANASTE ${result.value}!` : 'NADA 😢')) 
                            : (readyToSpinExtra ? '¡GIRAR AHORA!' : '¡GIRAR GRATIS!')
                    }
                </button>
             )}
          </div>
          
          {result && result.value > 0 && (
             <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="animate-bounce text-6xl">🎉</div>
             </div>
          )}
       </div>
    </div>
  );
};
