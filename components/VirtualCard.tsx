
import React from 'react';

interface VirtualCardProps {
  balance: number;
  holderName: string;
  cardNumber?: string;
}

const VirtualCard: React.FC<VirtualCardProps> = ({ balance, holderName, cardNumber = "**** **** **** 4288" }) => {
  return (
    <div className="relative w-full max-w-sm h-56 m-auto rounded-xl shadow-2xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-solar-600 to-solar-400 opacity-90"></div>
      
      {/* Texture/Pattern */}
      <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>

      <div className="relative p-6 h-full flex flex-col justify-between text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg tracking-wider italic">QvaSun VISA</h3>
            <p className="text-xs opacity-80">Débito Solar</p>
          </div>
          <svg className="h-10 w-auto" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
             {/* Simple Visa Logo Approximation */}
             <path d="M12 24L16 4H20L15 24H12Z" fill="white"/>
             <path d="M4 24L8 4H11.5L8.5 24H4Z" fill="white"/>
             <path d="M22 24L25 9L23 24H22Z" fill="white"/>
          </svg>
        </div>

        {/* Chip */}
        <div className="w-12 h-9 bg-yellow-200 rounded-md bg-opacity-80 border border-yellow-400 flex items-center justify-center overflow-hidden relative">
             <div className="absolute w-full h-[1px] bg-yellow-600 top-1/2"></div>
             <div className="absolute h-full w-[1px] bg-yellow-600 left-1/2"></div>
             <div className="w-6 h-4 border border-yellow-600 rounded-full"></div>
        </div>

        <div>
          <p className="font-mono text-xl tracking-widest shadow-black drop-shadow-md">{cardNumber}</p>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-[10px] uppercase opacity-70">Titular</p>
              <p className="font-semibold tracking-wide uppercase">{holderName}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase opacity-70">Saldo</p>
              <p className="font-bold text-lg text-solar-400">${balance.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCard;
