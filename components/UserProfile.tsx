
import React, { useState } from 'react';
import { User, MapPin, Wallet, Package, ArrowLeft, Settings, LogOut, CheckCircle, RefreshCcw, DollarSign, Clock, Save, Edit2, Plus, Trash2, X, Copy, Check } from 'lucide-react';
import { UserState, Address } from '../types';
import { CUBAN_MUNICIPALITIES } from '../constants';

interface UserProfileProps {
  user: UserState;
  onBack: () => void;
  onUpdateUser: (updated: Partial<UserState>) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onBack, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'wallet' | 'address'>('info');
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [editWithdrawAddress, setEditWithdrawAddress] = useState(false);
  const [withdrawAddressInput, setWithdrawAddressInput] = useState(user.withdrawalAddress || '');
  const [copiedRef, setCopiedRef] = useState(false);

  // Address Form State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState<Address>({
    id: '',
    label: '',
    line1: '',
    municipality: CUBAN_MUNICIPALITIES[0],
    province: '',
    phone: '',
    isDefault: false
  });

  // Helper to remove old delivered orders (simulated)
  React.useEffect(() => {
    const cleanOrders = () => {
       const now = new Date();
       const validOrders = user.orders.filter(o => {
          if (o.status !== 'entregado' || !o.deliveredDate) return true;
          const delivery = new Date(o.deliveredDate);
          const diffDays = Math.ceil((now.getTime() - delivery.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays <= 30;
       });
       if (validOrders.length !== user.orders.length) {
         onUpdateUser({ orders: validOrders });
       }
    };
    cleanOrders();
  }, [user.orders]);

  const handleCopyRefLink = () => {
      const link = `https://qvasun.com/ref/${user.referralCode}`;
      navigator.clipboard.writeText(link);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleExchange = () => {
    const coins = parseInt(exchangeAmount);
    if (isNaN(coins) || coins <= 0 || coins > user.qvaCoins) return;
    
    // Rate: 100 Coins = 1 USDT (Example logic)
    const usdtValue = coins * 0.01;
    
    onUpdateUser({
      qvaCoins: user.qvaCoins - coins,
      withdrawableBalance: user.withdrawableBalance + usdtValue
    });
    setExchangeAmount('');
    alert(`¡Has intercambiado ${coins} Monedas por $${usdtValue.toFixed(2)} USDT!`);
  };

  const handleWithdraw = () => {
      if (user.withdrawableBalance <= 0) return;
      if (!user.withdrawalAddress) {
          alert("Por favor, agrega una dirección de retiro USDT BEP20 en Facturación/Configuración.");
          return;
      }
      alert(`Solicitud de retiro de $${user.withdrawableBalance.toFixed(2)} enviada a la blockchain (Dirección: ${user.withdrawalAddress}). Procesando...`);
      onUpdateUser({ withdrawableBalance: 0 });
      setShowWithdraw(false);
  };

  const handleSaveWithdrawAddress = () => {
      onUpdateUser({ withdrawalAddress: withdrawAddressInput });
      setEditWithdrawAddress(false);
      alert("Dirección de retiro guardada correctamente.");
  };

  // --- Address Logic ---

  const handleEditAddress = (addr: Address) => {
      setAddressForm({ ...addr });
      setShowAddressModal(true);
  };

  const handleAddAddress = () => {
      setAddressForm({
        id: '',
        label: 'Casa',
        line1: '',
        municipality: CUBAN_MUNICIPALITIES[0],
        province: '',
        phone: '+53 ',
        isDefault: false
      });
      setShowAddressModal(true);
  };

  const handleDeleteAddress = (id: string) => {
      if (confirm("¿Estás seguro de eliminar esta dirección?")) {
          const updated = user.addresses.filter(a => a.id !== id);
          // If we deleted default, make first one default
          if (updated.length > 0 && !updated.find(a => a.isDefault)) {
              updated[0].isDefault = true;
          }
          onUpdateUser({ addresses: updated });
          setShowAddressModal(false);
      }
  };

  const handleSubmitAddress = () => {
      if (!addressForm.line1 || !addressForm.phone) {
          alert("La dirección y el teléfono son obligatorios.");
          return;
      }

      let updatedAddresses = [...user.addresses];

      // If setting as default, uncheck others
      if (addressForm.isDefault) {
          updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
      }

      if (addressForm.id) {
          // Update existing
          updatedAddresses = updatedAddresses.map(a => a.id === addressForm.id ? addressForm : a);
      } else {
          // Create new
          const newAddr = { ...addressForm, id: Date.now().toString() };
          updatedAddresses.push(newAddr);
      }

      // Ensure at least one default
      if (updatedAddresses.length > 0 && !updatedAddresses.find(a => a.isDefault)) {
          updatedAddresses[0].isDefault = true;
      }

      onUpdateUser({ addresses: updatedAddresses });
      setShowAddressModal(false);
  };

  // --- Renders ---

  const renderInfo = () => (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center relative overflow-hidden">
         <div className="absolute top-0 w-full h-16 bg-gradient-to-r from-solar-400 to-orange-500 opacity-20"></div>
         <div className="w-24 h-24 bg-gradient-to-tr from-solar-400 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg z-10 border-4 border-white">
            {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover"/> : user.name[0]}
         </div>
         <h2 className="text-xl font-bold z-10">{user.name}</h2>
         <p className="text-gray-500 text-sm z-10">{user.email}</p>
         
         <div className="mt-6 flex flex-col w-full gap-3">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div>
                   <p className="text-[10px] text-gray-400 uppercase font-bold">Código de Referido</p>
                   <p className="font-mono font-bold text-solar-600 text-lg">{user.referralCode}</p>
                </div>
                <button 
                    onClick={handleCopyRefLink}
                    className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-slate-700 hover:text-solar-600 active:scale-95 transition-all"
                >
                    {copiedRef ? <Check size={14}/> : <Copy size={14}/>}
                    {copiedRef ? 'Copiado' : 'Copiar Enlace'}
                </button>
            </div>
            <p className="text-[10px] text-center text-gray-400">Enlace: qvasun.com/ref/{user.referralCode}</p>
         </div>
      </div>

      {/* Billing / Configuration Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-800">
             <Settings size={16} /> Facturación y Retiros
         </h3>
         <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
             <div className="flex justify-between items-center mb-1">
                 <span className="text-xs font-bold text-gray-500 uppercase">Dirección USDT (BEP20)</span>
                 <button onClick={() => setEditWithdrawAddress(!editWithdrawAddress)} className="text-solar-600 text-xs font-bold hover:underline">
                     {editWithdrawAddress ? 'Cancelar' : (user.withdrawalAddress ? 'Editar' : 'Agregar')}
                 </button>
             </div>
             {editWithdrawAddress ? (
                 <div className="flex gap-2 mt-2">
                     <input 
                        type="text" 
                        value={withdrawAddressInput}
                        onChange={(e) => setWithdrawAddressInput(e.target.value)}
                        placeholder="0x..."
                        className="flex-1 text-xs border border-gray-300 rounded p-2 focus:ring-2 focus:ring-solar-500 outline-none"
                     />
                     <button onClick={handleSaveWithdrawAddress} className="bg-green-500 text-white p-2 rounded hover:bg-green-600"><Save size={14}/></button>
                 </div>
             ) : (
                 <p className="font-mono text-xs text-slate-700 break-all bg-white p-2 rounded border border-gray-200">
                     {user.withdrawalAddress || "No configurada"}
                 </p>
             )}
         </div>
      </div>
      
      <button className="w-full bg-red-50 p-4 rounded-xl shadow-sm border border-red-100 flex justify-between items-center text-red-600 hover:bg-red-100 transition-colors">
         <div className="flex items-center gap-3 font-bold text-sm">
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
         </div>
      </button>
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-4">
       <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-solar-500 rounded-full blur-3xl opacity-20"></div>
          <p className="text-sm text-gray-400 mb-1 font-medium">Saldo Retirable</p>
          <div className="flex justify-between items-end">
              <h2 className="text-3xl font-black tracking-tight">${user.withdrawableBalance.toFixed(2)} <span className="text-sm font-normal text-gray-400">USDT</span></h2>
              <button onClick={() => setShowWithdraw(true)} className="bg-solar-500 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-white transition-colors shadow-lg">Retirar</button>
          </div>
       </div>

       <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
             <RefreshCcw className="text-solar-500" size={20} />
             <h3 className="font-bold text-slate-900">Intercambiar Monedas</h3>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-xs text-yellow-800 border border-yellow-100">
             <span className="font-bold">Tasa Actual:</span> 1 QvaCoin = $0.01 USDT
             <br/><span className="mt-1 block">Disponibles: <b>{user.qvaCoins}</b> Monedas</span>
          </div>
          
          <div className="flex gap-2">
             <input 
               type="number" 
               placeholder="Cant. Monedas" 
               value={exchangeAmount}
               onChange={(e) => setExchangeAmount(e.target.value)}
               className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-solar-400 focus:bg-white transition-all"
             />
             <button onClick={handleExchange} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">Convertir</button>
          </div>
       </div>
       
       {showWithdraw && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
             <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in">
                <h3 className="text-lg font-bold mb-2 text-slate-900">Confirmar Retiro</h3>
                <p className="text-sm text-gray-600 mb-4">¿Estás seguro de retirar <b>${user.withdrawableBalance.toFixed(2)}</b> a tu billetera?</p>
                <div className="bg-gray-100 p-3 rounded-lg mb-4 border border-gray-200">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Destino (BEP20)</p>
                    <p className="text-xs font-mono break-all text-slate-800">{user.withdrawalAddress || "ERROR: NO ADDRESS"}</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setShowWithdraw(false)} className="flex-1 bg-gray-100 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200">Cancelar</button>
                   <button onClick={handleWithdraw} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 shadow-lg">Confirmar</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
       {user.orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
             <Package size={48} className="mx-auto mb-3 opacity-20"/>
             <p className="font-medium">No hay órdenes activas.</p>
             <button onClick={onBack} className="text-solar-600 text-sm font-bold mt-2 hover:underline">Ir a comprar</button>
          </div>
       ) : (
          user.orders.map(order => (
             <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                <div className="flex justify-between items-center mb-3 border-b border-gray-50 pb-2">
                   <span className="text-xs font-mono text-gray-500">#{order.id.slice(0,8)}</span>
                   <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
                      order.status === 'entregado' ? 'bg-green-100 text-green-600' : 
                      order.status === 'enviado' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                   }`}>
                      {order.status}
                   </span>
                </div>
                <div className="space-y-2 mb-3">
                   {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                         <span className="text-slate-700 line-clamp-1 flex-1 pr-2">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                         <span className="font-medium text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                   ))}
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
                    <span className="text-gray-500">Total Pagado</span>
                    <span className="font-bold text-lg text-slate-900">${order.total.toFixed(2)}</span>
                </div>
                {order.status === 'entregado' && (
                    <div className="mt-3 bg-red-50 p-2 rounded text-[10px] text-red-500 flex items-center gap-1 font-medium">
                       <Clock size={12}/> Se elimina del historial en 30 días
                    </div>
                )}
             </div>
          ))
       )}
    </div>
  );

  const renderAddresses = () => (
     <div className="space-y-4 pb-20">
        {user.addresses.map(addr => (
           <div key={addr.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-solar-200 transition-colors">
              <div className="flex items-start gap-3">
                 <div className="bg-gray-100 p-2 rounded-full text-slate-600"><MapPin size={20} /></div>
                 <div className="flex-1 pr-8">
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className="font-bold text-slate-800">{addr.label}</h3>
                       {addr.isDefault && <span className="text-[10px] bg-solar-100 text-solar-700 px-1.5 py-0.5 rounded font-bold border border-solar-200">PRINCIPAL</span>}
                    </div>
                    <p className="text-sm text-gray-600 leading-snug">{addr.line1}</p>
                    <p className="text-sm text-gray-600">{addr.municipality}, {addr.province}</p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">Tel: {addr.phone}</p>
                 </div>
              </div>
              <button 
                onClick={() => handleEditAddress(addr)}
                className="absolute top-4 right-4 text-gray-300 hover:text-solar-600 p-1 hover:bg-gray-50 rounded-full transition-all"
              >
                <Edit2 size={16}/>
              </button>
           </div>
        ))}
        
        <button 
            onClick={handleAddAddress}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-400 font-bold hover:border-solar-500 hover:text-solar-500 hover:bg-solar-50 transition-all flex items-center justify-center gap-2 group"
        >
           <Plus size={20} className="group-hover:scale-110 transition-transform"/> Agregar Nueva Dirección
        </button>

        {/* Address Modal */}
        {showAddressModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-lg text-slate-800">{addressForm.id ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
                        <button onClick={() => setShowAddressModal(false)}><X size={20} className="text-gray-400 hover:text-slate-800"/></button>
                    </div>
                    
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Etiqueta (Ej. Casa, Trabajo)</label>
                            <input 
                                type="text" 
                                value={addressForm.label}
                                onChange={e => setAddressForm({...addressForm, label: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-solar-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Municipio / Provincia</label>
                            <select 
                                value={addressForm.municipality}
                                onChange={e => setAddressForm({...addressForm, municipality: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-solar-400 bg-white"
                            >
                                {CUBAN_MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dirección Exacta</label>
                            <textarea 
                                value={addressForm.line1}
                                onChange={e => setAddressForm({...addressForm, line1: e.target.value})}
                                placeholder="Calle, Número, Apto, Entre calles..."
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-solar-400 min-h-[80px]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono</label>
                            <input 
                                type="tel" 
                                value={addressForm.phone}
                                onChange={e => setAddressForm({...addressForm, phone: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-solar-400"
                            />
                        </div>
                        <div className="flex items-center gap-3 py-2">
                             <input 
                                type="checkbox" 
                                id="isDefault"
                                checked={addressForm.isDefault}
                                onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})}
                                className="w-5 h-5 text-solar-600 rounded focus:ring-solar-500 border-gray-300"
                             />
                             <label htmlFor="isDefault" className="text-sm font-medium text-slate-700 cursor-pointer">Establecer como dirección principal</label>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                        {addressForm.id && (
                            <button 
                                onClick={() => handleDeleteAddress(addressForm.id)}
                                className="bg-red-100 text-red-500 p-3 rounded-xl hover:bg-red-200 transition-colors"
                            >
                                <Trash2 size={20}/>
                            </button>
                        )}
                        <button 
                            onClick={handleSubmitAddress}
                            className="flex-1 bg-solar-500 text-white font-bold py-3 rounded-xl shadow-md hover:bg-solar-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={18}/> Guardar Dirección
                        </button>
                    </div>
                </div>
            </div>
        )}
     </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-safe animate-fade-in">
      <div className="bg-white sticky top-0 z-30 shadow-sm">
         <div className="p-4 flex items-center gap-4">
            <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={24} className="text-slate-800"/></button>
            <h1 className="text-xl font-bold text-slate-900">Mi Perfil</h1>
         </div>
         <div className="flex overflow-x-auto scrollbar-hide border-t border-gray-100">
            {[
               {id: 'info', label: 'Info', icon: User},
               {id: 'wallet', label: 'Bonos', icon: Wallet},
               {id: 'orders', label: 'Pedidos', icon: Package},
               {id: 'address', label: 'Direcciones', icon: MapPin}
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-[90px] py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${activeTab === tab.id ? 'border-solar-500 text-solar-600 bg-solar-50/30' : 'border-transparent text-gray-400 hover:text-slate-600'}`}
               >
                  <tab.icon size={20} className={activeTab === tab.id ? 'stroke-2' : 'stroke-1.5'} />
                  <span className="text-xs font-bold">{tab.label}</span>
               </button>
            ))}
         </div>
      </div>

      <div className="p-4 md:max-w-2xl md:mx-auto">
         {activeTab === 'info' && renderInfo()}
         {activeTab === 'wallet' && renderWallet()}
         {activeTab === 'orders' && renderOrders()}
         {activeTab === 'address' && renderAddresses()}
      </div>
    </div>
  );
};

export default UserProfile;
