
import React, { useState } from 'react';
import { CreditCard, Plus, ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Lock, ShieldCheck, History } from 'lucide-react';
import { UserState } from '../types';
import VirtualCard from './VirtualCard';

interface CardManagerProps {
  user: UserState;
  onCreateCard: () => void;
  onTopUp: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

const CardManager: React.FC<CardManagerProps> = ({ user, onCreateCard, onTopUp, onWithdraw }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'view' | 'topup' | 'withdraw'>('view');

  if (!user.hasCard) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20 pb-20 px-4 animate-fade-in">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-solar-500 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            <CreditCard size={64} className="mx-auto mb-4 text-solar-400" />
            <h1 className="text-3xl font-black italic mb-2">QvaSun VISA</h1>
            <p className="text-gray-300">Tu energía, tu dinero, en cualquier lugar.</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600"><ShieldCheck size={24} /></div>
                <div>
                  <h3 className="font-bold text-slate-800">Seguridad Total</h3>
                  <p className="text-sm text-gray-500">Protección contra fraudes y bloqueo instantáneo.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600"><ArrowDownLeft size={24} /></div>
                <div>
                  <h3 className="font-bold text-slate-800">Retiros USDT</h3>
                  <p className="text-sm text-gray-500">Mueve saldo de tu billetera a tu tarjeta al instante.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onCreateCard}
              className="w-full bg-gradient-to-r from-solar-500 to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 text-lg"
            >
              SOLICITAR TARJETA GRATIS
            </button>
            <p className="text-center text-xs text-gray-400">Sin costos de mantenimiento mensual.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAction = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    if (mode === 'topup') {
        if (val > user.usdtBalance) {
            alert("Saldo insuficiente en Billetera Principal.");
            return;
        }
        onTopUp(val);
    } else {
        if (val > user.cardBalance) {
            alert("Saldo insuficiente en la Tarjeta.");
            return;
        }
        onWithdraw(val);
    }
    setAmount('');
    setMode('view');
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-24 px-4 md:max-w-4xl md:mx-auto animate-fade-in">
       <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-slate-900">Mi Tarjeta</h2>
             <button onClick={() => setShowDetails(!showDetails)} className="text-solar-600 flex items-center gap-1 text-sm font-bold">
                {showDetails ? <EyeOff size={16}/> : <Eye size={16}/>} {showDetails ? 'Ocultar' : 'Mostrar Datos'}
             </button>
          </div>

          <div className="mb-8 transform hover:scale-[1.02] transition-transform duration-500">
             <VirtualCard 
                balance={user.cardBalance} 
                holderName={user.name} 
                cardNumber={showDetails ? user.cardNumber : "**** **** **** " + user.cardNumber.slice(-4)} 
             />
             {showDetails && (
                 <div className="mt-4 flex justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 animate-slide-up">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Fecha Exp</p>
                        <p className="font-mono text-slate-800">{user.expiryDate}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">CVV</p>
                        <p className="font-mono text-slate-800">{user.cvv}</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                        <ShieldCheck size={16}/> <span className="text-xs font-bold">Activa</span>
                    </div>
                 </div>
             )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button 
                onClick={() => setMode('topup')}
                className={`p-4 rounded-xl border-2 font-bold flex flex-col items-center gap-2 transition-all ${mode === 'topup' ? 'border-solar-500 bg-solar-50 text-solar-700' : 'border-gray-100 hover:border-solar-200 text-slate-600'}`}
             >
                <div className="bg-solar-100 p-2 rounded-full text-solar-600"><Plus size={20}/></div>
                Recargar
             </button>
             <button 
                onClick={() => setMode('withdraw')}
                className={`p-4 rounded-xl border-2 font-bold flex flex-col items-center gap-2 transition-all ${mode === 'withdraw' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-blue-200 text-slate-600'}`}
             >
                <div className="bg-blue-100 p-2 rounded-full text-blue-600"><ArrowUpRight size={20}/></div>
                Retirar
             </button>
          </div>

          {mode !== 'view' && (
              <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200 animate-slide-in-down">
                  <h3 className="font-bold text-slate-800 mb-2">{mode === 'topup' ? 'Recargar desde Billetera' : 'Retirar a Billetera'}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                      {mode === 'topup' 
                        ? `Saldo Disponible en Wallet: $${user.usdtBalance.toFixed(2)}` 
                        : `Saldo Disponible en Tarjeta: $${user.cardBalance.toFixed(2)}`}
                  </p>
                  <div className="flex gap-2">
                      <div className="relative flex-1">
                          <span className="absolute left-3 top-3 text-gray-400">$</span>
                          <input 
                              type="number" 
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg py-2.5 pl-6 pr-3 outline-none focus:ring-2 focus:ring-solar-500"
                              placeholder="0.00"
                          />
                      </div>
                      <button onClick={handleAction} className="bg-slate-900 text-white font-bold px-6 rounded-lg hover:bg-slate-800 transition-colors">
                          Confirmar
                      </button>
                  </div>
              </div>
          )}
       </div>

       <div className="bg-white rounded-3xl shadow-sm p-6">
           <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
               <History size={20} className="text-gray-400" /> Movimientos Recientes
           </h3>
           <div className="space-y-4">
               {[
                   { id: 1, name: 'Netflix Subscription', amount: -12.99, date: 'Hoy' },
                   { id: 2, name: 'Recarga QvaSun', amount: +50.00, date: 'Ayer' },
                   { id: 3, name: 'Spotify Premium', amount: -9.99, date: '15 Oct' },
                   { id: 4, name: 'Amazon Digital', amount: -24.50, date: '12 Oct' },
               ].map(tx => (
                   <div key={tx.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                       <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
                               {tx.name[0]}
                           </div>
                           <div>
                               <p className="text-sm font-bold text-slate-800">{tx.name}</p>
                               <p className="text-xs text-gray-400">{tx.date}</p>
                           </div>
                       </div>
                       <span className={`font-mono font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                           {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                       </span>
                   </div>
               ))}
           </div>
       </div>
    </div>
  );
};

export default CardManager;
