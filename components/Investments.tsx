
import React, { useState } from 'react';
import { TrendingUp, Info, DollarSign, ArrowLeft } from 'lucide-react';
import { UserState, UserInvestment } from '../types';
import { INVESTMENT_PLANS } from '../constants';

interface InvestmentsProps {
  user: UserState;
  onBack: () => void;
  onInvest: (amount: number, planId: string) => void;
}

const Investments: React.FC<InvestmentsProps> = ({ user, onBack, onInvest }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const selectedPlan = INVESTMENT_PLANS.find(p => p.id === selectedPlanId);

  const handleInvestClick = () => {
    if (!selectedPlan) return;
    const investAmount = parseFloat(amount);
    
    if (isNaN(investAmount) || investAmount < selectedPlan.minEntry) {
      alert(`La inversión mínima para este plan es $${selectedPlan.minEntry}`);
      return;
    }
    if (investAmount > user.usdtBalance) {
      alert("Saldo insuficiente en tu Billetera USDT.");
      return;
    }

    onInvest(investAmount, selectedPlan.id);
    setAmount('');
    setSelectedPlanId(null);
    alert("¡Inversión iniciada con éxito! Comenzarás a recibir monedas QvaSun mañana.");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-safe animate-fade-in">
       {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm p-4 flex items-center gap-4">
        <button onClick={onBack}><ArrowLeft size={24} className="text-slate-800"/></button>
        <h1 className="text-xl font-bold text-slate-900">Inversiones QvaSun</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Intro */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-solar-500 rounded-full blur-3xl opacity-20"></div>
             <h2 className="text-2xl font-bold mb-2">Haz crecer tu saldo</h2>
             <p className="text-gray-300 text-sm mb-4">Invierte en infraestructura solar y recibe retornos diarios en QvaCoins. Retirable en USDT.</p>
             <div className="flex items-center gap-2">
                 <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                     <DollarSign size={12} /> Saldo Disponible: ${user.usdtBalance.toFixed(2)}
                 </div>
             </div>
        </div>

        {/* Plans */}
        <h3 className="font-bold text-lg text-slate-800">Planes Disponibles</h3>
        <div className="grid gap-4">
            {INVESTMENT_PLANS.map(plan => (
                <div key={plan.id} className={`bg-white rounded-xl shadow-md border-l-4 overflow-hidden transition-all ${selectedPlanId === plan.id ? 'ring-2 ring-solar-500 transform scale-102' : ''}`}
                     style={{ borderLeftColor: plan.id === 'mundial' ? '#2563EB' : plan.id === 'regional' ? '#D97706' : '#334155' }}
                >
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-lg">{plan.name}</h4>
                             <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs">{plan.dailyRoiPercent}% Diario</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                        
                        <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
                            <span className="text-gray-400">Mínimo: <b className="text-slate-700">${plan.minEntry}</b></span>
                            <span className="text-gray-400">Retorno: <b className="text-solar-600">QvaCoins</b></span>
                        </div>

                        <button 
                            onClick={() => setSelectedPlanId(plan.id)}
                            className="w-full mt-4 bg-gray-100 hover:bg-solar-100 text-slate-700 font-bold py-2 rounded-lg transition-colors"
                        >
                            Seleccionar Plan
                        </button>
                    </div>
                    
                    {/* Investment Input Area (Show if selected) */}
                    {selectedPlanId === plan.id && (
                        <div className="bg-gray-50 p-4 border-t border-gray-200 animate-slide-in-down">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Monto a Invertir (USDT)</label>
                            <div className="flex gap-2 mb-3">
                                <input 
                                    type="number" 
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder={`Mín $${plan.minEntry}`}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-solar-500 outline-none"
                                />
                                <button onClick={handleInvestClick} className="bg-solar-500 text-white font-bold px-4 rounded-lg hover:bg-solar-600">
                                    Confirmar
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Info size={10} /> Recibirás aprox. {((parseFloat(amount || '0') * plan.dailyRoiPercent) / 100 * 100).toFixed(0)} Monedas/día
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* User Active Investments */}
        {user.investments.length > 0 && (
            <>
                <h3 className="font-bold text-lg text-slate-800 mt-6">Mis Inversiones Activas</h3>
                <div className="space-y-3">
                    {user.investments.map(inv => (
                        <div key={inv.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-sm text-slate-800">{inv.planName}</p>
                                <p className="text-xs text-gray-400">{inv.startDate}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600 text-sm">+{inv.dailyEarnings} Monedas/día</p>
                                <p className="text-xs text-slate-500">Invertido: ${inv.amountInvested}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}

      </div>
    </div>
  );
};

export default Investments;
