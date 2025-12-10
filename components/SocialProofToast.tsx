
import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { CUBAN_MUNICIPALITIES, MOCK_PRODUCTS } from '../constants';

export const SocialProofToast: React.FC = () => {
  const [notification, setNotification] = useState<{location: string, product: string, time: string} | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Random interval between 15 and 45 seconds
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * (45000 - 15000) + 15000);
      
      setTimeout(() => {
        const randomLocation = CUBAN_MUNICIPALITIES[Math.floor(Math.random() * CUBAN_MUNICIPALITIES.length)];
        const randomProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
        
        setNotification({
          location: randomLocation,
          product: randomProduct.name,
          time: 'Justo ahora'
        });
        setVisible(true);

        // Hide after 4 seconds
        setTimeout(() => {
          setVisible(false);
          scheduleNext(); // Schedule the next one after hiding
        }, 5000);

      }, delay);
    };

    scheduleNext();

    return () => {}; // Cleanup not strictly necessary for this simple simulation loop
  }, []);

  if (!visible || !notification) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-slide-in-down pointer-events-none">
      <div className="bg-slate-800 bg-opacity-95 text-white p-3 rounded-lg shadow-xl flex items-center gap-3 border-l-4 border-solar-500 backdrop-blur-sm">
        <div className="bg-solar-500 p-2 rounded-full text-slate-900">
          <ShoppingBag size={16} />
        </div>
        <div>
          <p className="text-xs font-bold text-solar-400">Nueva Compra desde {notification.location}</p>
          <p className="text-xs line-clamp-1 text-gray-200">Compró: {notification.product}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{notification.time}</p>
        </div>
      </div>
    </div>
  );
};
