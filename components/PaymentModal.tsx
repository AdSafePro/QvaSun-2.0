
import React, { useState } from 'react';
import { Copy, Check, Loader2, DollarSign, Wallet } from 'lucide-react';
import { NOWPAYMENTS_WALLET } from '../constants';

interface PaymentModalProps {
  amount: number;
  userCoins: number;
  onClose: () => void;
  onSuccess: (finalAmount: number, coinsUsed: number, coinsEarned: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, userCoins, onClose, onSuccess }) => {
  const [step, setStep] = useState<'invoice' | 'processing' | 'success'>('invoice');
  const [copied, setCopied] = useState(false);
  const [useCoins, setUseCoins] = useState(false);

  // Coin Logic
  // 1 Coin = 0.01 USD
  // Max Discount = 5% of amount
  const maxDiscountAmount = amount * 0.05;
  const coinValue = 0.01;
  
  // Calculate how many coins are needed for max discount
  const maxCoinsNeeded = Math.ceil(maxDiscountAmount / coinValue);
  
  // Actual coins to use is min(needed, available)
  const coinsToUse = Math.min(maxCoinsNeeded, userCoins);
  const discountAmount = coinsToUse * coinValue;
  
  const finalAmount = useCoins ? amount - discountAmount : amount;
  const earnedCoins = Math.floor(finalAmount); // Earn 1% approx (1 coin per dollar)

  const handleCopy = () => {
    navigator.clipboard.writeText(NOWPAYMENTS_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePaymentCheck = () => {
    setStep('processing');
    // Simulate network delay
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess(finalAmount, useCoins ? coinsToUse : 0, earnedCoins);
        onClose();
      }, 2000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">NP</div>
            <span className="font-semibold">Caja (Checkout)</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="p-6">
          {step === 'invoice' && (
            <>
              {/* Discount Section */}
              {userCoins > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Wallet size={16} className="text-yellow-600" />
                      <span className="font-bold text-sm text-slate-800">Usar QvaCoins</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={useCoins} onChange={(e) => setUseCoins(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                    </label>
                  </div>
                  <div className="text-xs text-gray-600 flex justify-between">
                    <span>Disponibles: {userCoins} monedas</span>
                    {useCoins && <span className="text-green-600 font-bold">-${discountAmount.toFixed(2)} (5% Max)</span>}
                  </div>
                  {useCoins && (
                    <div className="text-[10px] text-gray-400 mt-1">
                      Usando {coinsToUse} monedas.
                    </div>
                  )}
                </div>
              )}

              <div className="text-center mb-6">
                <p className="text-gray-500 text-sm uppercase tracking-wide">Total a Pagar</p>
                <div className="text-4xl font-bold text-slate-800 flex justify-center items-center mt-1">
                  <DollarSign className="w-6 h-6 text-gray-400" />
                  {finalAmount.toFixed(2)} <span className="text-lg text-green-600 ml-2">USDT</span>
                </div>
                {useCoins && <span className="text-xs text-gray-400 line-through">${amount.toFixed(2)}</span>}
                
                <div className="mt-2 text-xs text-blue-600 font-semibold bg-blue-50 inline-block px-2 py-1 rounded">
                   + ¡Ganarás {earnedCoins} QvaCoins!
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 flex flex-col items-center">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${NOWPAYMENTS_WALLET}`} alt="QR" className="rounded-lg shadow-sm mb-4 mix-blend-multiply" />
                 
                 <div className="w-full">
                    <p className="text-xs text-gray-500 mb-1">Enviar USDT (BEP20) a:</p>
                    <div className="flex items-center bg-white border rounded p-2 justify-between">
                        <code className="text-xs sm:text-sm text-slate-600 truncate mr-2">{NOWPAYMENTS_WALLET}</code>
                        <button onClick={handleCopy} className="text-solar-600 hover:text-solar-700">
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                 </div>
              </div>

              <button 
                onClick={simulatePaymentCheck}
                className="w-full bg-trust-500 hover:bg-trust-900 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Ya he pagado
              </button>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-10">
              <Loader2 className="w-16 h-16 text-solar-500 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800">Verificando Blockchain...</h3>
              <p className="text-gray-500 mt-2">Esto suele tardar unos 30 segundos.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">¡Pago Exitoso!</h3>
              <p className="text-gray-500 mt-2">Monedas añadidas a la billetera.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
