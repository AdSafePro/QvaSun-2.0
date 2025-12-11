
import React, { useState, useEffect, useRef } from 'react';
import { Home, ShoppingBag, Wallet, User as UserIcon, Zap, Star, Search, Menu, MessageCircle, X, ChevronRight, ShoppingCart, Send, DollarSign, Plus, Copy, TrendingUp, Users, Link as LinkIcon, Lock, RotateCw, Filter, SlidersHorizontal, Check, CreditCard } from 'lucide-react';
import { MOCK_PRODUCTS, INVESTMENT_PLANS, RANDOM_REVIEW_DATA } from './constants';
import { Product, CartItem, UserState, Order, UserInvestment, Review } from './types';
import VirtualCard from './components/VirtualCard';
import { DailyCheckIn, FlashSaleBanner, SpinWheel } from './components/Gamification';
import PaymentModal from './components/PaymentModal';
import { getGeminiResponse } from './services/geminiService';
import { SocialProofToast } from './components/SocialProofToast';
import ProductDetails from './components/ProductDetails';
import UserProfile from './components/UserProfile';
import Investments from './components/Investments';
import AuthPage from './components/Auth';
import CardManager from './components/CardManager';
import { PushNotification } from './components/PushNotification';

// --- Shared Components ---

const ProductCard: React.FC<{ product: Product; onAdd: (p: Product) => void; onClick: (p: Product) => void }> = ({ product, onAdd, onClick }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div onClick={() => onClick(product)} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full relative group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-solar-200">
      {product.flashSale && (
        <div className="absolute top-0 left-0 bg-urgency-500 text-white text-xs font-bold px-3 py-1 z-10 rounded-br-lg animate-pulse shadow-md">
          OFERTA RELÁMPAGO
        </div>
      )}
      <div className="relative h-48 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" />
        {product.stock < 10 && (
           <div className="absolute bottom-0 w-full bg-red-600 bg-opacity-90 text-white text-[10px] text-center py-1 font-bold tracking-wide backdrop-blur-sm">
             ¡Solo quedan {product.stock}!
           </div>
        )}
        {/* Quick Add Overlay on Desktop */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center">
            <button 
                onClick={(e) => { e.stopPropagation(); onClick(product); }}
                className="bg-white text-slate-900 font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
                Ver Detalles
            </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow relative">
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight mb-1 group-hover:text-solar-600 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={`${i < Math.floor(product.rating) ? 'text-solar-500 fill-solar-500' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-gray-400">({product.reviews ? product.reviews.length : 0})</span>
        </div>
        
        <div className="mt-auto">
            <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-urgency-600">${product.price}</span>
                <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
            </div>
            <button 
                onClick={handleAdd}
                disabled={isAdded}
                className={`w-full mt-3 text-white text-sm py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md active:scale-95 ${
                    isAdded 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-slate-900 hover:bg-solar-500'
                }`}
            >
                {isAdded ? (
                    <>
                        <Check size={14} className="animate-scale-in" /> Agregado
                    </>
                ) : (
                    <>
                        <ShoppingBag size={14} /> Agregar
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

const FloatingCart: React.FC<{ count: number, onClick: () => void, animating: boolean }> = ({ count, onClick, animating }) => {
    if (count === 0) return null;
    return (
        <button 
            onClick={onClick}
            className={`fixed bottom-24 right-4 md:bottom-10 md:right-10 bg-solar-500 text-slate-900 p-4 rounded-full shadow-2xl z-30 hover:scale-110 transition-transform flex items-center gap-2 border-4 border-white ${animating ? 'animate-bounce' : 'animate-bounce-slow hover:animate-none'}`}
        >
            <div className="relative">
                <ShoppingCart size={28} className="text-white drop-shadow-sm" />
                <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm transform scale-110">
                    {count}
                </span>
            </div>
        </button>
    );
};

// --- Pages ---

const HomePage: React.FC<{ products: Product[], onAdd: (p: Product) => void, onOpenDaily: () => void, onOpenWheel: () => void, onNavigate: (view: string) => void, onProductClick: (p: Product) => void }> = ({ products, onAdd, onOpenDaily, onOpenWheel, onNavigate, onProductClick }) => {
  return (
    <div className="pb-20 md:pb-0">
      <FlashSaleBanner />
      
      {/* Hero */}
      <div className="bg-slate-900 text-white p-8 md:p-16 relative overflow-hidden rounded-b-3xl md:rounded-3xl md:mx-4 md:mt-4 shadow-2xl group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-solar-500 rounded-full filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2 animate-pulse-fast"></div>
        <div className="relative z-10 max-w-2xl animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-black italic mb-4 leading-tight drop-shadow-lg">POTENCIA<br/><span className="text-solar-400">TU VIDA</span></h1>
          <p className="text-gray-300 mb-6 text-lg max-w-md leading-relaxed">Soluciones de energía solar de primera calidad con hasta 70% de descuento. Paga con Crypto, Ahorra con Sol.</p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => onNavigate('shop')} className="bg-solar-500 text-black px-6 py-3 rounded-full font-bold hover:bg-white transition-all transform hover:scale-105 shadow-lg shadow-solar-500/20">Comprar Ahora</button>
            <button onClick={onOpenDaily} className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white/20 transition-all border border-white/10 hover:border-white/30">
              <Zap size={18} className="fill-yellow-400 text-yellow-400 animate-pulse"/> Premio Diario
            </button>
            <button onClick={onOpenWheel} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-purple-500/50 hover:-translate-y-1 transition-transform">
              <RotateCw size={18} className="group-hover:animate-spin-slow"/> Ruleta
            </button>
             <button onClick={() => onNavigate('investments')} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1 transition-transform">
              <TrendingUp size={18} /> Inversiones
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-xl font-bold mb-4 text-slate-800 animate-slide-up" style={{animationDelay: '0.1s'}}>Categorías Populares</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible animate-slide-up" style={{animationDelay: '0.2s'}}>
          {['Paneles', 'Baterías', 'Inversores', 'Kits', 'Accesorios'].map((cat, idx) => (
            <div key={cat} onClick={() => onNavigate('shop')} className="flex flex-col items-center min-w-[100px] cursor-pointer group bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-solar-200 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-solar-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-solar-100 transition-colors text-2xl group-hover:scale-110 duration-300">
                  {cat === 'Paneles' ? '☀️' : cat === 'Baterías' ? '🔋' : cat === 'Inversores' ? '⚡' : cat === 'Kits' ? '📦' : '🔌'}
              </div>
              <span className="font-bold text-slate-700 group-hover:text-solar-600 transition-colors">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex justify-between items-end mb-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="fill-urgency-500 text-urgency-500 animate-pulse" /> Ofertas Rayo
          </h2>
          <span onClick={() => onNavigate('shop')} className="text-sm text-solar-600 font-bold cursor-pointer hover:underline hover:text-solar-700 transition-colors">Ver Todo &gt;</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
          {products.filter(p => p.flashSale).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} onAdd={onAdd} onClick={onProductClick} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-orange-50 py-8 mt-8 rounded-t-3xl md:rounded-3xl md:mx-4 animate-slide-up" style={{animationDelay: '0.5s'}}>
         <div className="max-w-7xl mx-auto px-4">
           <div className="mb-4">
              <h2 className="text-xl font-bold text-orange-800">Selección Solar Verificada</h2>
           </div>
           <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-4 md:overflow-visible">
               {products.filter(p => !p.flashSale).map(p => (
                   <div key={p.id} className="min-w-[200px]">
                      <ProductCard product={p} onAdd={onAdd} onClick={onProductClick} />
                   </div>
               ))}
           </div>
         </div>
      </div>
    </div>
  );
};

const CATEGORIES = ['Todos', 'Paneles', 'Baterías', 'Inversores', 'Kits', 'Accesorios'];

const ShopPage: React.FC<{ products: Product[], onAdd: (p: Product) => void, onProductClick: (p: Product) => void }> = ({ products, onAdd, onProductClick }) => {
    const [category, setCategory] = useState('Todos');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const filteredProducts = products.filter(p => {
        const catMap: Record<string, string> = {
            'Todos': 'all',
            'Paneles': 'paneles',
            'Baterías': 'baterias',
            'Inversores': 'inversores',
            'Kits': 'kits',
            'Accesorios': 'accesorios'
        };
        
        const targetCat = catMap[category];
        const categoryMatch = targetCat === 'all' || p.category === targetCat;

        const price = p.price;
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;
        const priceMatch = price >= min && price <= max;

        return categoryMatch && priceMatch;
    });

    return (
        <div className="flex flex-col md:flex-row gap-6 p-4 pb-20 pt-16 md:pt-24 max-w-7xl mx-auto min-h-screen">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-2 flex justify-between items-center sticky top-16 bg-white z-20 py-2 border-b border-gray-100">
                <span className="font-bold text-slate-700">{filteredProducts.length} Resultados</span>
                <button onClick={() => setShowMobileFilters(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md active:scale-95 transition-transform">
                    <SlidersHorizontal size={16}/> Filtros
                </button>
            </div>

            {/* Sidebar / Filter Panel */}
            <div className={`
                fixed inset-0 z-50 bg-white p-6 transform transition-transform duration-300 overflow-y-auto shadow-2xl
                md:relative md:translate-x-0 md:bg-transparent md:p-0 md:w-64 md:block md:shadow-none md:z-0
                ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex justify-between items-center md:hidden mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Filtros</h2>
                    <button onClick={() => setShowMobileFilters(false)} className="bg-gray-100 p-2 rounded-full"><X size={20}/></button>
                </div>

                <div className="md:sticky md:top-24 animate-slide-up">
                    {/* Categories */}
                    <div className="mb-8">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Filter size={18}/> Categorías</h3>
                        <div className="space-y-2">
                            {CATEGORIES.map(cat => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${category === cat ? 'border-solar-500' : 'border-gray-300'}`}>
                                        {category === cat && <div className="w-2.5 h-2.5 rounded-full bg-solar-500 animate-scale-in"></div>}
                                    </div>
                                    <input type="radio" name="category" value={cat} checked={category === cat} onChange={() => setCategory(cat)} className="hidden"/>
                                    <span className={`text-sm transition-colors ${category === cat ? 'text-solar-600 font-bold' : 'text-gray-600 group-hover:text-slate-900'}`}>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><DollarSign size={18}/> Precio (USDT)</h3>
                        <div className="flex gap-2 items-center mb-4">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-2.5 text-gray-400 text-xs">$</span>
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    value={minPrice} 
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-6 pr-3 py-2 text-sm outline-none focus:border-solar-500 focus:ring-2 focus:ring-solar-100 transition-all"
                                />
                            </div>
                            <span className="text-gray-400">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-2.5 text-gray-400 text-xs">$</span>
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    value={maxPrice} 
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-6 pr-3 py-2 text-sm outline-none focus:border-solar-500 focus:ring-2 focus:ring-solar-100 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => {setCategory('Todos'); setMinPrice(''); setMaxPrice(''); setShowMobileFilters(false);}} 
                        className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 hover:text-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-95"
                    >
                        <RotateCw size={14} /> Limpiar Filtros
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
                 <div className="hidden md:flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold text-slate-900 animate-fade-in">{category === 'Todos' ? 'Todos los Productos' : category}</h2>
                     <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full animate-fade-in">{filteredProducts.length} Resultados</span>
                 </div>
                 
                 {filteredProducts.length === 0 ? (
                     <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 animate-fade-in">
                         <Search size={48} className="mx-auto text-gray-300 mb-4" />
                         <h3 className="text-lg font-bold text-slate-800">No encontramos productos</h3>
                         <p className="text-gray-400 mb-4">Intenta ajustar tus filtros de búsqueda.</p>
                         <button onClick={() => {setCategory('Todos'); setMinPrice(''); setMaxPrice('');}} className="text-solar-600 font-bold hover:underline">Limpiar Filtros</button>
                     </div>
                 ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredProducts.map((p, idx) => (
                            <div key={p.id} className="animate-slide-up" style={{animationDelay: `${idx * 0.05}s`}}>
                                <ProductCard product={p} onAdd={onAdd} onClick={onProductClick} />
                            </div>
                        ))}
                    </div>
                 )}
            </div>
            
            {/* Backdrop for mobile */}
            {showMobileFilters && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-fade-in" onClick={() => setShowMobileFilters(false)}></div>
            )}
        </div>
    );
}

const WalletPage: React.FC<{ user: UserState, onNavigate: (view: string) => void }> = ({ user, onNavigate }) => {
    const [copied, setCopied] = useState(false);
    const refLink = `https://qvasun.com/ref/${user.referralCode}`;

    const handleCopyRef = () => {
        navigator.clipboard.writeText(refLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
  <div className="p-4 pb-20 pt-16 bg-gray-50 min-h-screen md:max-w-4xl md:mx-auto md:pt-24">
    <div className="mb-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 animate-slide-up">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Mi Billetera Solar</h1>
            <VirtualCard balance={user.usdtBalance} holderName={user.name} />
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-4 content-center animate-slide-up" style={{animationDelay: '0.1s'}}>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden h-full flex flex-col justify-center transition-transform hover:scale-105 duration-300">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-yellow-100 rounded-full opacity-50 animate-pulse"></div>
                <p className="text-xs text-gray-500 uppercase z-10 relative">QvaCoins</p>
                <p className="text-3xl font-black text-solar-500 flex items-center gap-1 z-10 relative my-2">
                    <div className="w-5 h-5 rounded-full bg-yellow-400 border border-yellow-600"></div>
                    {user.qvaCoins}
                </p>
                <p className="text-[10px] text-green-500 z-10 relative font-bold bg-green-50 inline-block px-2 py-1 rounded w-max">Valor: ${(user.qvaCoins * 0.01).toFixed(2)} USDT</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col justify-center transition-transform hover:scale-105 duration-300">
                <p className="text-xs text-gray-500 uppercase">Referidos</p>
                <p className="text-3xl font-black text-trust-500 my-2">{user.referrals}</p>
                <div className="flex items-center bg-gray-100 rounded px-2 py-1 max-w-full cursor-pointer hover:bg-gray-200 transition-colors" onClick={handleCopyRef}>
                    <p className="text-[10px] text-gray-500 truncate flex-1 font-mono">{user.referralCode}</p>
                    <button className="text-solar-600 ml-1"><Copy size={12}/></button>
                </div>
                {copied && <span className="text-[9px] text-green-500 text-center mt-1 animate-fade-in">¡Copiado!</span>}
            </div>
        </div>
    </div>
    
    {/* Referral Rules Info */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-500" /> Sistema de Referidos Multinivel
        </h3>
        <p className="text-sm text-gray-500 mb-4">Gana QvaCoins automáticamente cuando tus referidos realicen compras en la plataforma.</p>
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100 hover:shadow-md transition-shadow">
                <div className="text-2xl font-black text-blue-600">4%</div>
                <div className="text-xs text-gray-500 font-bold uppercase mt-1">Nivel 1</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100 hover:shadow-md transition-shadow">
                <div className="text-2xl font-black text-blue-500">1.5%</div>
                <div className="text-xs text-gray-500 font-bold uppercase mt-1">Nivel 2</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100 hover:shadow-md transition-shadow">
                <div className="text-2xl font-black text-blue-400">0.5%</div>
                <div className="text-xs text-gray-500 font-bold uppercase mt-1">Nivel 3</div>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
            <LinkIcon size={16} className="text-solar-600"/>
            <p className="text-sm text-gray-600">
                <span className="font-bold text-solar-600">Bonus Afiliado:</span> Gana <span className="font-bold">5%</span> extra por compartir enlaces de productos específicos.
            </p>
        </div>
    </div>

    {/* Investments Banner Link */}
    <div 
        onClick={() => onNavigate('investments')}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white mb-6 flex justify-between items-center shadow-lg cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-blue-500/30 group animate-slide-up" style={{animationDelay: '0.3s'}}
    >
        <div className="flex items-center gap-4">
             <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-colors"><TrendingUp size={24}/></div>
             <div>
                 <p className="font-bold text-lg">Inversiones Activas</p>
                 <p className="text-sm text-blue-200">Haz crecer tu capital hasta 1.2% diario</p>
             </div>
        </div>
        <div className="bg-white/20 p-2 rounded-full group-hover:translate-x-1 transition-transform">
             <ChevronRight size={24} />
        </div>
    </div>
    
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white mb-6 flex justify-between items-center shadow-lg animate-slide-up" style={{animationDelay: '0.4s'}}>
        <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Racha Actual</p>
            <p className="text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <Zap size={24} fill="currentColor" className="animate-pulse" /> {user.checkInStreak} Días
            </p>
        </div>
        <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Próximo Premio</p>
            <p className="text-2xl font-bold">+{user.checkInStreak < 30 ? user.checkInStreak + 1 : 1} Monedas</p>
        </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up" style={{animationDelay: '0.5s'}}>
        <div className="p-4 border-b border-gray-100 font-bold text-slate-800 flex justify-between items-center">
            <span>Transacciones Recientes</span>
            <span className="text-xs text-solar-600 cursor-pointer hover:underline">Ver Todas</span>
        </div>
        {[1,2,3].map(i => (
            <div key={i} className="p-4 border-b border-gray-50 flex justify-between items-center last:border-0 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i===2 ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                        {i===2 ? <ShoppingCart size={18}/> : <DollarSign size={18}/>}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">{i===2 ? 'Compra Kit Solar' : 'Depósito USDT'}</p>
                        <p className="text-xs text-gray-400">Oct {10+i}, 2023 • 14:30</p>
                    </div>
                </div>
                <span className={`font-mono text-base font-bold ${i===2 ? 'text-red-500' : 'text-green-500'}`}>
                    {i===2 ? '-' : '+'}{i*50}.00
                </span>
            </div>
        ))}
    </div>
  </div>
)};

const CartPage: React.FC<{ cart: CartItem[], user: UserState, onCheckout: () => void, onRemove: (id: string) => void, onNavigate: (view: string) => void, onUpdateQty: (id: string, delta: number) => void }> = ({ cart, user, onCheckout, onRemove, onNavigate, onUpdateQty }) => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    if (cart.length === 0) return (
        <div className="flex flex-col items-center justify-center h-screen pb-20 text-gray-400 bg-gray-50 animate-fade-in">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4 animate-bounce-slow">
                <ShoppingBag size={64} className="text-gray-300" />
            </div>
            <p className="text-lg font-bold text-slate-600">Tu carrito está vacío</p>
            <p className="text-sm mb-6">¡Descubre nuestras ofertas solares!</p>
            <button onClick={() => onNavigate('shop')} className="bg-solar-500 text-slate-900 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-white hover:text-solar-600 transition-all hover:scale-105 active:scale-95">Ir a la Tienda</button>
        </div>
    );

    return (
        <div className="p-4 pb-32 pt-16 bg-gray-50 min-h-screen md:pt-24 md:max-w-5xl md:mx-auto md:flex md:gap-8 md:items-start">
            <div className="flex-1 space-y-4">
                <h1 className="text-2xl font-bold mb-6 text-slate-800">Carrito de Compras ({cart.length})</h1>
                <div className="space-y-4">
                    {cart.map((item, idx) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 relative border border-gray-100 group hover:shadow-md transition-all animate-slide-up" style={{animationDelay: `${idx * 0.1}s`}}>
                            <img src={item.image} className="w-24 h-24 object-cover rounded-lg bg-gray-200" alt={item.name} />
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-800 line-clamp-1 mb-1">{item.name}</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">{item.category}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xl font-bold text-slate-900">${item.price}</span>
                                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                        <button onClick={() => onUpdateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-500 font-bold transition-colors active:scale-90">-</button>
                                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => onUpdateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-green-500 font-bold transition-colors active:scale-90">+</button>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => onRemove(item.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-2 transition-colors transform hover:rotate-90">
                                <X size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Checkout Bar / Desktop Sidebar */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-30 md:static md:w-96 md:border md:rounded-2xl md:shadow-lg md:p-6 md:block animate-slide-up">
                <h3 className="hidden md:block font-bold text-lg mb-4 text-slate-800">Resumen del Pedido</h3>
                
                <div className="space-y-2 mb-4 hidden md:block text-sm text-gray-600">
                     <div className="flex justify-between">
                         <span>Subtotal</span>
                         <span>${total.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between">
                         <span>Envío</span>
                         <span className="text-green-600 font-bold">Gratis</span>
                     </div>
                </div>

                <div className="flex justify-between items-center mb-4 md:border-t md:pt-4">
                    <span className="text-gray-500 md:font-bold md:text-slate-800">Total:</span>
                    <span className="text-3xl font-black text-slate-900">${total.toFixed(2)}</span>
                </div>
                <button 
                    onClick={onCheckout}
                    className="w-full bg-solar-500 hover:bg-slate-900 hover:text-white text-slate-900 font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 transition-all transform active:scale-95"
                >
                    PAGAR AHORA (USDT)
                </button>
                <div className="text-center mt-3 text-xs text-gray-400 flex items-center justify-center gap-1">
                    <Lock size={12}/> Pagos encriptados y seguros
                </div>
            </div>
        </div>
    );
};

// --- Chat Bot ---

const ChatSupport: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
        {role: 'bot', text: '¡Hola! Soy Solecito ☀️. ¿Cómo puedo ayudarte a ahorrar energía hoy?'}
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if(!input.trim()) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
        setLoading(true);

        const reply = await getGeminiResponse(userMsg);
        setMessages(prev => [...prev, {role: 'bot', text: reply || '¡Las nubes taparon mi señal! Intenta de nuevo.'}]);
        setLoading(false);
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none p-4">
            <div className="bg-white w-full sm:max-w-md h-[80vh] sm:h-[600px] shadow-2xl flex flex-col pointer-events-auto rounded-t-2xl sm:rounded-2xl border border-gray-200 overflow-hidden animate-slide-up">
                <div className="bg-gradient-to-r from-solar-500 to-solar-600 p-4 flex justify-between items-center text-white shadow-md">
                    <div className="flex items-center gap-2">
                        <div className="bg-white text-solar-600 rounded-full p-1.5 shadow-sm"><MessageCircle size={20} /></div>
                        <div>
                            <span className="font-bold block text-sm">Soporte QvaSun AI</span>
                            <span className="text-[10px] opacity-80 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> En línea</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X size={20} /></button>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-gray-200 rounded-tl-none'}`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                         <div className="flex justify-start">
                             <div className="bg-gray-200 p-3 rounded-2xl rounded-tl-none animate-pulse text-xs text-gray-500 font-medium">Solecito está escribiendo...</div>
                         </div>
                    )}
                    <div ref={endRef}></div>
                </div>

                <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-solar-400 transition-all"
                        placeholder="Pregunta sobre paneles..."
                    />
                    <button onClick={handleSend} className="bg-solar-500 text-white p-3 rounded-full hover:bg-solar-600 disabled:opacity-50 transition-colors shadow-md" disabled={loading}>
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Layout & App ---

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<UserState>({
    usdtBalance: 1240.50,
    withdrawableBalance: 0,
    qvaCoins: 350,
    referralCode: 'SUN-8821',
    referrals: 12,
    name: 'Invitado', 
    email: '',
    avatar: '',
    lastCheckInDate: '',
    checkInStreak: 0,
    withdrawalAddress: '',
    addresses: [],
    orders: [],
    investments: [],
    reviewedProductIds: [],
    stockAlerts: [],
    hasCard: false,
    cardBalance: 0,
    cardNumber: '',
    cvv: '',
    expiryDate: '',
    cardBlocked: false
  });
  
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showDaily, setShowDaily] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartAnimating, setCartAnimating] = useState(false);

  // Initialize Data and Generate Random Reviews on Mount
  useEffect(() => {
    const initializedProducts = MOCK_PRODUCTS.map(p => {
        const currentReviews = p.reviews || [];
        
        if (currentReviews.length < 5) {
            const numToAdd = Math.floor(Math.random() * 5) + 3; // Add 3 to 7 reviews
            
            // Create a shuffled copy of available comments/names to ensure no duplicates for this product
            const availableComments = [...RANDOM_REVIEW_DATA.comments].sort(() => 0.5 - Math.random());
            const availableNames = [...RANDOM_REVIEW_DATA.names].sort(() => 0.5 - Math.random());
            
            const newReviews: Review[] = [];
            
            for (let i = 0; i < numToAdd; i++) {
                // Safely pick unique items from the shuffled lists
                const randomName = availableNames[i % availableNames.length];
                const randomComment = availableComments[i % availableComments.length];
                
                // 99% chance of being positive (4 or 5 stars)
                const isPositive = Math.random() > 0.01;
                const randomRating = isPositive 
                    ? (Math.random() > 0.3 ? 5 : 4) // Mostly 5, some 4
                    : (Math.floor(Math.random() * 3) + 1); // 1, 2, or 3
                
                newReviews.push({
                    id: `rnd-${p.id}-${i}`,
                    userName: randomName,
                    rating: randomRating,
                    comment: randomComment,
                    date: '2023-10-18', // Static recent date for demo
                    verified: true
                });
            }
            const allReviews = [...currentReviews, ...newReviews];
            const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

            return {
                ...p,
                reviews: allReviews,
                rating: parseFloat(avgRating.toFixed(1))
            };
        }
        return p;
    });
    setProducts(initializedProducts);
  }, []);

  const handleLogin = (userInfo: Partial<UserState>) => {
      setUser(prev => ({
          ...prev,
          ...userInfo,
          // Add default address if new user (simulated)
          addresses: prev.addresses.length === 0 ? [
             { id: '1', label: 'Casa', line1: 'Calle 23 #123', municipality: 'Vedado', province: 'La Habana', phone: '+53 55555555', isDefault: true }
          ] : prev.addresses
      }));
      setIsAuthenticated(true);
      setShowAuthModal(false);
  };
  
  // Guard Helper
  const requireAuth = (action: () => void) => {
      if (isAuthenticated) {
          action();
      } else {
          setShowAuthModal(true);
      }
  };

  const addToCart = (product: Product) => {
    requireAuth(() => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? {...i, quantity: i.quantity + 1} : i);
            }
            return [...prev, {...product, quantity: 1}];
        });
        setCartAnimating(true);
        setTimeout(() => setCartAnimating(false), 500);
    });
  };

  const removeFromCart = (id: string) => {
      setCart(prev => prev.filter(i => i.id !== id));
  };
  
  const updateCartQty = (id: string, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.id === id) {
              const newQty = Math.max(1, item.quantity + delta);
              return { ...item, quantity: newQty };
          }
          return item;
      }));
  };

  const handleCheckoutSuccess = (finalAmount: number, coinsUsed: number, coinsEarned: number) => {
      const newOrder: Order = {
          id: `ORD-${Date.now().toString().slice(-6)}`,
          date: new Date().toISOString().split('T')[0],
          total: finalAmount,
          items: [...cart],
          status: 'procesando'
      };

      setCart([]);
      setUser(prev => ({
          ...prev, 
          usdtBalance: prev.usdtBalance - finalAmount,
          qvaCoins: prev.qvaCoins - coinsUsed + coinsEarned,
          orders: [newOrder, ...prev.orders]
      }));
      alert(`¡Pago Completado! Pagado: $${finalAmount.toFixed(2)}. Usaste ${coinsUsed} Monedas. Ganaste ${coinsEarned} Monedas.`);
      setCurrentView('wallet'); 
  };

  const handleRewardClaim = (coins: number, newStreak: number) => {
      const today = new Date().toISOString().split('T')[0];
      setUser(prev => ({
          ...prev, 
          qvaCoins: prev.qvaCoins + coins,
          checkInStreak: newStreak,
          lastCheckInDate: today
      }));
  };

  const handleWheelReward = (coins: number) => {
      setUser(prev => ({
          ...prev,
          qvaCoins: prev.qvaCoins + coins
      }));
      setTimeout(() => setShowWheel(false), 2000);
  };

  const handleInvestment = (amount: number, planId: string) => {
      const plan = INVESTMENT_PLANS.find(p => p.id === planId);
      if(!plan) return;

      const newInvestment: UserInvestment = {
          id: `INV-${Date.now()}`,
          planId: plan.id,
          planName: plan.name,
          amountInvested: amount,
          startDate: new Date().toISOString().split('T')[0],
          dailyEarnings: Number(((amount * plan.dailyRoiPercent) / 100 * 100).toFixed(0)), 
          totalEarnedCoins: 0,
          status: 'active'
      };

      setUser(prev => ({
          ...prev,
          usdtBalance: prev.usdtBalance - amount,
          investments: [newInvestment, ...prev.investments]
      }));
  };

  // Card Actions
  const handleCreateCard = () => {
      setUser(prev => ({
          ...prev,
          hasCard: true,
          cardNumber: '4288 1234 5678 9010',
          cvv: '882',
          expiryDate: '10/28',
          cardBalance: 0
      }));
      alert("¡Tarjeta VISA Virtual QvaSun creada con éxito!");
  };

  const handleCardTopUp = (amount: number) => {
      setUser(prev => ({
          ...prev,
          usdtBalance: prev.usdtBalance - amount,
          cardBalance: prev.cardBalance + amount
      }));
      alert(`¡Recarga de $${amount.toFixed(2)} USDT exitosa!`);
  };

  const handleCardWithdraw = (amount: number) => {
      setUser(prev => ({
          ...prev,
          usdtBalance: prev.usdtBalance + amount,
          cardBalance: prev.cardBalance - amount
      }));
      alert(`¡Retiro de $${amount.toFixed(2)} USDT a Billetera exitoso!`);
  };

  const handleSubmitReview = (productId: string, rating: number, comment: string) => {
      requireAuth(() => {
          const rewardCoins = 3;
          
          setUser(prev => ({
              ...prev,
              qvaCoins: prev.qvaCoins + rewardCoins,
              reviewedProductIds: [...prev.reviewedProductIds, productId]
          }));

          // Update local product state
          setProducts(prevProducts => prevProducts.map(p => {
              if (p.id === productId) {
                 const newReview: Review = {
                      id: `r-user-${Date.now()}`,
                      userName: user.name,
                      rating: rating,
                      comment: comment,
                      date: new Date().toISOString().split('T')[0],
                      verified: true
                 };
                 const newReviews = [newReview, ...(p.reviews || [])];
                 const newRating = newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length;
                 return { ...p, reviews: newReviews, rating: parseFloat(newRating.toFixed(1)) };
              }
              return p;
          }));
          
          if (selectedProduct && selectedProduct.id === productId) {
             setSelectedProduct(prev => {
                 if(!prev) return null;
                 const newReview: Review = {
                      id: `r-user-${Date.now()}`,
                      userName: user.name,
                      rating: rating,
                      comment: comment,
                      date: new Date().toISOString().split('T')[0],
                      verified: true
                 };
                 const newReviews = [newReview, ...(prev.reviews || [])];
                 const newRating = newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length;
                 return { ...prev, reviews: newReviews, rating: parseFloat(newRating.toFixed(1)) };
             });
          }
          
          alert(`¡Reseña enviada! Has ganado ${rewardCoins} QvaCoins.`);
      });
  };

  // Subscribe to low stock alerts
  const handleToggleStockAlert = (productId: string) => {
      setUser(prev => {
          const isSubscribed = prev.stockAlerts.includes(productId);
          let newAlerts;
          if (isSubscribed) {
              newAlerts = prev.stockAlerts.filter(id => id !== productId);
          } else {
              newAlerts = [...prev.stockAlerts, productId];
          }
          return { ...prev, stockAlerts: newAlerts };
      });
  };

  const NavLink = ({ view, icon: Icon, label, protectedView }: any) => {
      const isActive = currentView === view;
      const handleClick = () => {
          if (protectedView) {
              requireAuth(() => {
                  setCurrentView(view);
                  setSelectedProduct(null);
              });
          } else {
              setCurrentView(view);
              setSelectedProduct(null);
          }
      };
      
      return (
        <button onClick={handleClick} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${isActive ? 'text-solar-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
            <Icon size={20} className={isActive ? 'fill-current' : ''} />
            <span className="text-[10px] font-medium">{label}</span>
        </button>
      );
  };

  const handleProductClick = (p: Product) => {
      const currentP = products.find(prod => prod.id === p.id) || p;
      setSelectedProduct(currentP);
      setCurrentView('product-detail');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
      <div className="w-full md:max-w-7xl mx-auto bg-white min-h-screen shadow-2xl relative overflow-x-hidden">
        
        {/* Components integrated */}
        <PushNotification products={products} onProductClick={handleProductClick} />
        <SocialProofToast />
        
        {/* Authentication Modal Overlay */}
        {showAuthModal && (
            <AuthPage onLogin={handleLogin} onClose={() => setShowAuthModal(false)} />
        )}

        {/* Top Header - Responsive */}
        {currentView !== 'product-detail' && currentView !== 'profile' && currentView !== 'investments' && currentView !== 'card-manager' && (
            <header className="sticky top-0 w-full bg-white/95 backdrop-blur-sm z-40 border-b border-gray-100 px-4 py-3 transition-all animate-fade-in">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCurrentView('home')}>
                        <div className="w-9 h-9 bg-gradient-to-tr from-solar-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-black italic shadow-md transform group-hover:rotate-12 transition-transform">
                            Q
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">QvaSun</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => setCurrentView('home')} className={`text-sm font-bold transition-all hover:scale-105 ${currentView === 'home' ? 'text-solar-600' : 'text-slate-600 hover:text-solar-600'}`}>Inicio</button>
                        <button onClick={() => setCurrentView('shop')} className={`text-sm font-bold transition-all hover:scale-105 ${currentView === 'shop' ? 'text-solar-600' : 'text-slate-600 hover:text-solar-600'}`}>Tienda</button>
                        <button onClick={() => requireAuth(() => setCurrentView('wallet'))} className={`text-sm font-bold transition-all hover:scale-105 ${currentView === 'wallet' ? 'text-solar-600' : 'text-slate-600 hover:text-solar-600'}`}>Billetera</button>
                        <button onClick={() => requireAuth(() => setCurrentView('investments'))} className={`text-sm font-bold transition-all hover:scale-105 ${currentView === 'investments' ? 'text-solar-600' : 'text-slate-600 hover:text-solar-600'}`}>Inversiones</button>
                        <button onClick={() => requireAuth(() => setCurrentView('card-manager'))} className={`text-sm font-bold transition-all hover:scale-105 ${currentView === 'card-manager' ? 'text-solar-600' : 'text-slate-600 hover:text-solar-600'}`}>Tarjeta</button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div onClick={() => requireAuth(() => setShowDaily(true))} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-yellow-50 border border-gray-200 transition-colors hover:shadow-sm active:scale-95">
                            <div className="w-5 h-5 rounded-full bg-yellow-400 border border-yellow-600 flex items-center justify-center">
                                <span className="text-[8px] font-bold">Q</span>
                            </div>
                            <span className="text-xs font-bold text-slate-700">{isAuthenticated ? user.qvaCoins : '0'}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                            <button onClick={() => setCurrentView('cart')} className="relative text-gray-600 hover:text-solar-500 transition-colors hidden md:block">
                                <ShoppingBag size={24} className={cartAnimating ? 'animate-bounce' : ''} />
                                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-scale-in">{cartCount}</span>}
                            </button>
                            <button onClick={() => requireAuth(() => setCurrentView('profile'))} className="text-gray-600 hover:text-solar-500 transition-colors">
                                <UserIcon size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        )}

        {/* Content */}
        <div key={currentView} className="animate-fade-in">
            {currentView === 'home' && (
                <HomePage 
                    products={products} 
                    onAdd={addToCart} 
                    onOpenDaily={() => requireAuth(() => setShowDaily(true))} 
                    onOpenWheel={() => requireAuth(() => setShowWheel(true))}
                    onNavigate={(view) => {
                         if (['investments', 'wallet', 'card-manager'].includes(view)) {
                             requireAuth(() => setCurrentView(view));
                         } else {
                             setCurrentView(view);
                         }
                    }} 
                    onProductClick={handleProductClick} 
                />
            )}
            
            {currentView === 'shop' && <ShopPage products={products} onAdd={addToCart} onProductClick={handleProductClick} />}
            
            {currentView === 'cart' && (
                <CartPage 
                    cart={cart} 
                    user={user} 
                    onCheckout={() => requireAuth(() => setShowPayment(true))} 
                    onRemove={removeFromCart} 
                    onNavigate={(view) => setCurrentView(view)} 
                    onUpdateQty={updateCartQty} 
                />
            )}
            
            {currentView === 'wallet' && <WalletPage user={user} onNavigate={(view) => requireAuth(() => setCurrentView(view))} />}
            
            {currentView === 'card-manager' && (
                <>
                  <div className="bg-white sticky top-0 z-30 shadow-sm p-4 flex items-center gap-4">
                     <button onClick={() => setCurrentView('home')}><ChevronRight size={24} className="rotate-180 text-slate-800"/></button>
                     <h1 className="text-xl font-bold text-slate-900">Tarjeta Virtual</h1>
                  </div>
                  <CardManager 
                      user={user} 
                      onCreateCard={handleCreateCard}
                      onTopUp={handleCardTopUp}
                      onWithdraw={handleCardWithdraw}
                  />
                </>
            )}
            
            {currentView === 'product-detail' && selectedProduct && (
                <ProductDetails 
                    product={selectedProduct} 
                    user={user}
                    onBack={() => setCurrentView('shop')} 
                    onAdd={addToCart} 
                    onSubmitReview={handleSubmitReview}
                    onToggleStockAlert={handleToggleStockAlert}
                />
            )}

            {currentView === 'profile' && (
                <UserProfile 
                    user={user} 
                    onBack={() => setCurrentView('home')} 
                    onUpdateUser={(updated) => setUser(prev => ({ ...prev, ...updated }))}
                />
            )}

            {currentView === 'investments' && (
                <Investments
                    user={user}
                    onBack={() => setCurrentView('wallet')}
                    onInvest={handleInvestment}
                />
            )}
        </div>

        {/* Mobile Bottom Nav (Hidden on Desktop) */}
        {currentView !== 'product-detail' && currentView !== 'profile' && currentView !== 'investments' && currentView !== 'card-manager' && (
            <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 h-16 flex justify-around items-center z-40 pb-safe md:hidden animate-slide-up">
                <NavLink view="home" icon={Home} label="Inicio" />
                <NavLink view="shop" icon={Search} label="Tienda" />
                <NavLink view="card-manager" icon={CreditCard} label="Tarjeta" protectedView={true} />
                <NavLink view="cart" icon={ShoppingBag} label="Carrito" />
                <NavLink view="wallet" icon={Wallet} label="Billetera" protectedView={true} />
            </nav>
        )}

        {/* Floating Cart Button (Mobile Only since Desktop has it in header) */}
        {currentView !== 'cart' && currentView !== 'product-detail' && currentView !== 'profile' && currentView !== 'investments' && currentView !== 'card-manager' && (
            <div className="md:hidden">
                <FloatingCart count={cartCount} onClick={() => setCurrentView('cart')} animating={cartAnimating} />
            </div>
        )}

        {/* Floating AI Button (if chat closed) */}
        {!showChat && currentView !== 'product-detail' && (
            <button 
                onClick={() => setShowChat(true)}
                className="fixed bottom-20 right-4 bg-slate-900 text-white p-3 rounded-full shadow-lg z-30 hover:scale-110 transition-transform border-2 border-solar-500 md:bottom-8 md:right-8 animate-scale-in"
            >
                <MessageCircle size={28} />
            </button>
        )}

        {/* Modals */}
        {showDaily && (
            <DailyCheckIn 
                onClose={() => setShowDaily(false)} 
                onReward={handleRewardClaim} 
                lastCheckInDate={user.lastCheckInDate}
                currentStreak={user.checkInStreak}
            />
        )}
        {showWheel && (
            <SpinWheel 
                onClose={() => setShowWheel(false)} 
                onReward={handleWheelReward}
            />
        )}
        {showPayment && (
            <PaymentModal 
                amount={cart.reduce((a, b) => a + (b.price * b.quantity), 0)} 
                userCoins={user.qvaCoins}
                onClose={() => setShowPayment(false)} 
                onSuccess={handleCheckoutSuccess} 
            />
        )}
        <ChatSupport isOpen={showChat} onClose={() => setShowChat(false)} />
        
      </div>
  );
};

export default App;
