
import React, { useState, useEffect } from 'react';
import { X, Zap, AlertTriangle } from 'lucide-react';
import { Product } from '../types';

interface PushNotificationProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export const PushNotification: React.FC<PushNotificationProps> = ({ products, onProductClick }) => {
  const [notification, setNotification] = useState<{product: Product, type: 'stock' | 'sale'} | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Start loop after initial delay
    const initialTimeout = setTimeout(() => {
        scheduleNext();
    }, 5000);

    let loopTimeout: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
        const delay = Math.floor(Math.random() * (45000 - 20000) + 20000); // 20-45s
        
        // Find relevant products
        const lowStock = products.filter(p => p.stock > 0 && p.stock < 10);
        const flashSales = products.filter(p => p.flashSale);
        
        const candidates = [...lowStock, ...flashSales];
        
        if (candidates.length > 0) {
            const randomProduct = candidates[Math.floor(Math.random() * candidates.length)];
            // Determine type
            let type: 'stock' | 'sale' = 'sale';
            if (randomProduct.stock < 10) type = 'stock';
            if (randomProduct.flashSale && Math.random() > 0.5) type = 'sale';

            setNotification({ product: randomProduct, type });
            setVisible(true);
            
            // Hide after 6s
            setTimeout(() => {
                setVisible(false);
                loopTimeout = setTimeout(scheduleNext, delay);
            }, 6000);
        } else {
             loopTimeout = setTimeout(scheduleNext, delay);
        }
    };

    return () => {
        clearTimeout(initialTimeout);
        clearTimeout(loopTimeout);
    };
  }, [products]);

  if (!visible || !notification) return null;

  return (
    <div 
        onClick={() => { onProductClick(notification.product); setVisible(false); }}
        className="fixed bottom-24 left-4 right-4 md:bottom-8 md:right-8 md:left-auto md:w-96 z-50 bg-white rounded-xl shadow-2xl border-l-4 border-solar-500 p-4 cursor-pointer transform transition-all hover:scale-105 animate-slide-up flex items-start gap-3 backdrop-blur-sm bg-opacity-95 ring-1 ring-black/5"
    >
       <button 
         onClick={(e) => { e.stopPropagation(); setVisible(false); }} 
         className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
       >
         <X size={16}/>
       </button>
       
       <div className={`p-3 rounded-full flex-shrink-0 ${notification.type === 'stock' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
           {notification.type === 'stock' ? <AlertTriangle size={24}/> : <Zap size={24}/>}
       </div>
       
       <div className="flex-1 pr-4">
           <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
               {notification.type === 'stock' ? '¡Stock Crítico!' : '⚡ Oferta Relámpago'}
           </h4>
           <p className="text-xs text-gray-600 font-medium line-clamp-1 mt-0.5">{notification.product.name}</p>
           <p className="text-xs font-bold mt-1 text-solar-600">
               {notification.type === 'stock' 
                 ? `¡Solo quedan ${notification.product.stock} unidades!` 
                 : `¡Descuento de ${(100 - (notification.product.price/notification.product.originalPrice)*100).toFixed(0)}% por tiempo limitado!`}
           </p>
       </div>
    </div>
  );
};
