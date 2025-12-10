
import React, { useState } from 'react';
import { UserState } from '../types';
import { X } from 'lucide-react';

interface AuthProps {
  onLogin: (user: Partial<UserState>) => void;
  onClose: () => void;
}

const AuthPage: React.FC<AuthProps> = ({ onLogin, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      // Mock Success
      onLogin({
        name: isRegister ? name : "Usuario QvaSun",
        email: email,
        avatar: "", // Default
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 overflow-hidden animate-fade-in">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-solar-500 rounded-full filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-solar-500 transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
           <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-solar-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">
                Q
              </div>
              <span className="text-3xl font-black text-white tracking-tight">QvaSun</span>
           </div>
           <p className="text-gray-400">Energía Solar Gamificada</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex text-sm font-bold border-b border-gray-100">
             <button 
                onClick={() => setIsRegister(false)} 
                className={`flex-1 py-4 text-center transition-colors ${!isRegister ? 'text-solar-600 bg-white' : 'text-gray-400 bg-gray-50'}`}
             >
                INICIAR SESIÓN
             </button>
             <button 
                onClick={() => setIsRegister(true)} 
                className={`flex-1 py-4 text-center transition-colors ${isRegister ? 'text-solar-600 bg-white' : 'text-gray-400 bg-gray-50'}`}
             >
                REGISTRARSE
             </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
             {isRegister && (
               <div className="animate-fade-in">
                 <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nombre Completo</label>
                 <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-solar-400 text-slate-800"
                    placeholder="Ej. Alex Solar"
                 />
               </div>
             )}
             
             <div>
               <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Correo Electrónico</label>
               <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-solar-400 text-slate-800"
                  placeholder="Ej. usuario@qvasun.com"
               />
             </div>

             <div>
               <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Contraseña</label>
               <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-solar-400 text-slate-800"
                  placeholder="••••••••"
               />
             </div>

             <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-solar-500 to-solar-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
             >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                   isRegister ? 'CREAR CUENTA' : 'ENTRAR'
                )}
             </button>
          </form>
          
          <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t border-gray-100">
             Al continuar, aceptas los <span className="underline cursor-pointer hover:text-solar-600">Términos de Servicio</span> de QvaSun.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
