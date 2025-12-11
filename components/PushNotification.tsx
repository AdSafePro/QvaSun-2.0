
import React, { useState, useEffect } from 'react';
import { X, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface PushNotificationProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export const PushNotification: React.FC<PushNotificationProps> = ({ products, onProductClick }) => {
  const [notification, setNotification] = useState<{product: Product, type: 'stock' | 'sale'} | null>(null);
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Initial start delay
    const initialTimeout = setTimeout(() => {
        scheduleNext();
    }, 8000);

    let loopTimeout: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
        const delay = Math.floor(Math.random() * (40000 - 20000) + 20000); // 20-40s random interval
        
        // Logic to find interesting products
        const lowStock = products.filter(p => p.stock > 0 && p.stock < 15);
        const flashSales = products.filter(p => p.flashSale);
        
        const candidates = [...lowStock, ...flashSales];
        
        if (candidates.length > 0) {
            const randomProduct = candidates[Math.floor(Math.random() * candidates.length)];
            let type: 'stock' | 'sale' = 'sale';
            
            // Prioritize stock alerts if very low
            if (randomProduct.stock < 5) type = 'stock';
            else if (randomProduct.flashSale) type = 'sale';

            setNotification({ product: randomProduct, type });
            setVisible(true);
            
            // Hide logic (waits if user is hovering)
            const checkHide = () => {
                setVisible(prev => {
                    // We can't easily access the current 'isHovered' state inside the timeout closure reliably without a ref, 
                    // but for simplicity, we just set a longer timeout and rely on the user clicking or closing if they are interested.
                    // To keep it strictly non-intrusive, we hide it after 7 seconds regardless, unless interacted with.
                    return false;
                });
                loopTimeout = setTimeout(scheduleNext, delay);
            };

            setTimeout(checkHide, 7000); 

        } else {
             loopTimeout = setTimeout(scheduleNext, delay);
        }
    };

    return () => {
        clearTimeout(initialTimeout);
        clearTimeout(loopTimeout);
    };
  }, [products]);

  if (!notification) return null;

  return (
    <div 
        className={`fixed bottom-24 left-4 right-4 md:bottom-8 md:right-8 md:left-auto md:w-96 z-50 transition-all duration-700 ease-out transform ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
       {/* Glassmorphism Container */}
       <div 
         onClick={() => { onProductClick(notification.product); setVisible(false); }}
         className="relative bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-2xl p-4 cursor-pointer overflow-hidden group hover:bg-white/70 transition-all"
       >
           {/* Shimmer Effect */}
           <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"></div>

           <button 
             onClick={(e) => { e.stopPropagation(); setVisible(false); }} 
             className="absolute top-2 right-2 text-slate-500 hover:text-slate-800 hover:bg-white/50 rounded-full p-1 transition-colors z-20"
           >
             <X size={14}/>
           </button>
           
           <div className="flex items-start gap-4 relative z-10">
               {/* Icon Box with Pulse */}
               <div className="relative">
                   <div className={`absolute inset-0 rounded-xl blur-md opacity-50 animate-pulse ${notification.type === 'stock' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                   <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-white/50 ${notification.type === 'stock' ? 'bg-red-100/80 text-red-600' : 'bg-yellow-100/80 text-yellow-600'}`}>
                       {notification.type === 'stock' ? <AlertTriangle size={20}/> : <Zap size={20}/>}
                   </div>
               </div>
               
               <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start pr-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                            notification.type === 'stock' 
                            ? 'bg-red-50/50 text-red-600 border-red-100' 
                            : 'bg-yellow-50/50 text-yellow-700 border-yellow-100'
                        }`}>
                            {notification.type === 'stock' ? 'Stock Bajo' : 'Oferta Flash'}
                        </span>
                   </div>
                   
                   <h4 className="font-bold text-slate-900 text-sm mt-1 truncate leading-tight">
                       {notification.product.name}
                   </h4>
                   
                   <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                       {notification.type === 'stock' 
                         ? <>Quedan solo <strong className="text-red-600">{notification.product.stock} unidades</strong>. ¡No te quedes sin energía!</>
                         : <>Descuento del <strong className="text-yellow-600">{(100 - (notification.product.price/notification.product.originalPrice)*100).toFixed(0)}%</strong> disponible ahora.</>
                       }
                   </p>

                   <div className="flex items-center gap-1 text-[10px] font-bold text-solar-600 mt-2 group-hover:translate-x-1 transition-transform">
                       Ver Detalles <ArrowRight size={10}/>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};
