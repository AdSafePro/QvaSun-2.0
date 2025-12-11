
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingBag, ShieldCheck, Truck, Clock, Eye, Share2, Heart, ChevronLeft, ChevronRight, AlertTriangle, Link, Copy, Check, MessageSquare, Bell, BellRing, Mail, Plane, Info } from 'lucide-react';
import { Product, UserState } from '../types';

interface ProductDetailsProps {
  product: Product;
  user: UserState;
  onBack: () => void;
  onAdd: (p: Product) => void;
  onSubmitReview: (productId: string, rating: number, comment: string) => void;
  onToggleStockAlert: (productId: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, user, onBack, onAdd, onSubmitReview, onToggleStockAlert }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewers, setViewers] = useState(12);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Stock Alert State
  const [showStockModal, setShowStockModal] = useState(false);
  const [emailInput, setEmailInput] = useState(user.email || '');
  
  const isSubscribed = user.stockAlerts.includes(product.id);

  const images = [product.image, ...(product.gallery || [])];

  // Logic to check if user can review
  const hasPurchased = user.orders.some(order => order.items.some(item => item.id === product.id));
  const hasReviewed = user.reviewedProductIds.includes(product.id);
  const canReview = hasPurchased && !hasReviewed;

  useEffect(() => {
    // Simulate fluctuating viewer count
    const interval = setInterval(() => {
      setViewers(prev => Math.max(5, prev + Math.floor(Math.random() * 5) - 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const handleCopyLink = () => {
    const link = `https://qvasun.com/p/${product.id}?ref=${user.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitReview = () => {
    if (comment.trim().length < 5) {
      alert("El comentario debe tener al menos 5 caracteres.");
      return;
    }
    onSubmitReview(product.id, rating, comment);
    setShowReviewForm(false);
  };

  const handleStockSubscribe = () => {
      if (!isSubscribed) {
          if (!emailInput && !user.email) {
              alert("Por favor ingresa un correo electrónico.");
              return;
          }
          // In a real app, send API request here
      }
      onToggleStockAlert(product.id);
      setShowStockModal(false);
      if (!isSubscribed) {
          alert("¡Suscripción exitosa! Te avisaremos cuando haya novedades de stock.");
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 animate-fade-in relative z-50">
      {/* Header */}
      <div className="fixed top-0 w-full max-w-md z-40 flex justify-between items-center p-4 bg-transparent bg-gradient-to-b from-black/50 to-transparent text-white pointer-events-none">
        <button onClick={onBack} className="bg-black/40 p-2 rounded-full pointer-events-auto backdrop-blur-md hover:bg-black/60 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-3 pointer-events-auto">
           <button onClick={handleCopyLink} className="bg-black/40 p-2 rounded-full backdrop-blur-md hover:bg-black/60 transition-colors">
             {copiedLink ? <Check size={24} className="text-green-400"/> : <Share2 size={24}/>}
           </button>
           <button className="bg-black/40 p-2 rounded-full backdrop-blur-md hover:bg-black/60 transition-colors"><Heart size={24}/></button>
        </div>
      </div>

      {/* Gallery */}
      <div className="relative w-full h-96 bg-white overflow-hidden group">
        <img 
          src={images[currentImage]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full text-slate-800 hover:bg-white transition-colors"><ChevronLeft/></button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full text-slate-800 hover:bg-white transition-colors"><ChevronRight/></button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentImage ? 'bg-solar-500 w-6' : 'bg-white/50 w-2'}`}></div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Urgency Banner */}
      {product.flashSale && (
        <div className="bg-gradient-to-r from-urgency-600 to-urgency-500 text-white p-3 flex justify-between items-center shadow-inner animate-slide-up">
           <div className="flex items-center gap-2 font-bold animate-pulse">
             <Clock size={18} />
             <span>OFERTA RELÁMPAGO</span>
           </div>
           <div className="text-xs bg-white/20 px-2 py-1 rounded font-mono">01:45:22</div>
        </div>
      )}

      {/* Main Info */}
      <div className="bg-white p-4 mb-2 shadow-sm animate-slide-up" style={{animationDelay: '0.1s'}}>
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-xl font-bold text-slate-900 leading-tight flex-1">{product.name}</h1>
        </div>
        
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-black text-urgency-600">${product.price}</span>
          <span className="text-sm text-gray-400 line-through mb-1">${product.originalPrice}</span>
          <span className="text-xs font-bold text-urgency-600 bg-red-50 px-2 py-1 rounded mb-1 animate-pulse">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-1">
             <Star className="fill-yellow-400 text-yellow-400" size={16} />
             <span className="font-bold text-slate-800">{product.rating}</span>
             <span className="underline">({product.reviews?.length || 0} reseñas)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-800">
             <ShoppingBag size={16} />
             <span>{product.soldCount} Vendidos</span>
          </div>
        </div>

        {/* Social Proof Hooks & Stock Alerts */}
        <div className="space-y-3">
           <div className="flex items-center gap-2 text-sm text-orange-600 font-medium bg-orange-50 p-2 rounded">
             <Eye size={16} className="animate-pulse" />
             <span>¡{viewers} personas están viendo esto ahora!</span>
           </div>
           
           <div className="flex justify-between items-center gap-3">
               {product.stock < 10 ? (
                 <div className="flex-1 flex items-center gap-2 text-sm text-red-600 font-bold bg-red-50 p-2 rounded border border-red-100">
                   <AlertTriangle size={16} className="animate-bounce" />
                   <span>Stock Bajo: {product.stock} rest.</span>
                 </div>
               ) : (
                 <div className="flex-1 text-sm text-green-600 font-medium bg-green-50 p-2 rounded flex items-center gap-2">
                    <Check size={16}/> Stock Disponible
                 </div>
               )}

               <button 
                  onClick={() => setShowStockModal(true)}
                  className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg border transition-all active:scale-95 ${isSubscribed ? 'bg-solar-100 text-solar-700 border-solar-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
               >
                   {isSubscribed ? <BellRing size={16} className="fill-current"/> : <Bell size={16}/>}
                   {isSubscribed ? 'Suscrito' : 'Avisarme'}
               </button>
           </div>
        </div>
      </div>

      {/* NEW: Green Shipping Banner (Inclusion & Disclaimer) */}
      <div className="bg-green-50 border border-green-200 p-3 mx-4 mb-2 rounded-lg flex items-start gap-3 animate-slide-up shadow-sm">
         <Truck className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
         <div>
            <p className="text-sm font-bold text-green-800">Envío Incluido (Puerta a Puerta en Cuba)</p>
            <p className="text-xs text-green-700 mt-1 leading-relaxed">
               El precio incluye todos los costos de importación y entrega. <br/>
               <span className="font-bold flex items-center gap-1 mt-1"><AlertTriangle size={10}/> Importante:</span> Una vez el pedido es recolectado por el transportista, no se aceptan cancelaciones ni reembolsos.
            </p>
         </div>
      </div>

      {/* NEW: Shipping Logistics & Guarantee */}
      <div className="bg-white p-4 mb-2 shadow-sm animate-slide-up">
           <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-800">
               <Plane size={18} className="text-blue-500"/> Detalles de Envío a Cuba
           </h3>
           <div className="space-y-3">
               <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-xs text-gray-500 font-bold uppercase">Destino</span>
                  <span className="font-bold text-sm text-slate-800 flex items-center gap-1">
                     🇨🇺 Todos los Municipios
                  </span>
               </div>
               <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-xs text-gray-500 font-bold uppercase">Tiempo Estimado</span>
                  <span className="font-bold text-sm text-slate-800">15 - 25 Días Hábiles</span>
               </div>
               <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 border border-blue-100">
                  <ShieldCheck size={16} className="text-blue-600 flex-shrink-0 mt-0.5"/>
                  <p className="text-xs text-blue-800 leading-snug">
                     <span className="font-bold">Garantía de Puntualidad:</span> Si tu pedido demora más de 30 días, te reembolsamos el 5% del valor en crédito.
                  </p>
               </div>
           </div>
      </div>

      {/* Affiliate Link Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 mb-2 shadow-sm border border-blue-100 animate-slide-up" style={{animationDelay: '0.2s'}}>
         <div className="flex items-center gap-2 mb-2">
            <Link size={18} className="text-blue-600" />
            <h3 className="font-bold text-blue-800 text-sm">¡Gana 5% con Afiliados!</h3>
         </div>
         <p className="text-xs text-blue-600 mb-3">Comparte este producto. Si alguien compra con tu enlace, ganarás el 5% del valor en QvaCoins.</p>
         
         <div className="flex items-center gap-2 bg-white rounded-lg border border-blue-200 p-2">
            <div className="flex-1 text-xs text-gray-500 font-mono truncate">
               qvasun.com/p/{product.id}?ref={user.referralCode}
            </div>
            <button onClick={handleCopyLink} className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:bg-blue-50 p-1 rounded transition-colors">
               {copiedLink ? <Check size={14}/> : <Copy size={14}/>} {copiedLink ? 'Copiado' : 'Copiar'}
            </button>
         </div>
      </div>

      {/* Benefits / Trust */}
      <div className="bg-white p-4 mb-2 shadow-sm flex justify-between animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="flex flex-col items-center gap-1 text-center w-1/3 group">
             <ShieldCheck className="text-trust-500 group-hover:scale-110 transition-transform" />
             <span className="text-[10px] text-gray-600 font-medium">Garantía<br/>Original</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center w-1/3 border-l border-r border-gray-100 group">
             <Truck className="text-solar-600 group-hover:translate-x-1 transition-transform" />
             <span className="text-[10px] text-gray-600 font-medium">Envío<br/>Gratis</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center w-1/3 group">
             <ShieldCheck className="text-green-500 group-hover:scale-110 transition-transform" />
             <span className="text-[10px] text-gray-600 font-medium">Pago<br/>Seguro</span>
          </div>
      </div>

      {/* Description */}
      <div className="bg-white p-4 mb-2 shadow-sm animate-slide-up" style={{animationDelay: '0.4s'}}>
         <h2 className="font-bold text-lg mb-3">Descripción</h2>
         <p className="text-sm text-gray-600 leading-relaxed mb-4">{product.description}</p>
         
         <h3 className="font-bold text-sm mb-2">Especificaciones</h3>
         <div className="grid grid-cols-2 gap-2 text-sm">
             {product.specs && Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors">
                   <span className="text-gray-500 block text-xs">{key}</span>
                   <span className="font-medium text-slate-800">{val}</span>
                </div>
             ))}
         </div>
      </div>

      {/* Reviews */}
      <div className="bg-white p-4 mb-2 shadow-sm animate-slide-up" style={{animationDelay: '0.5s'}}>
          <div className="flex justify-between items-center mb-4">
             <h2 className="font-bold text-lg">Reseñas</h2>
             <span className="text-solar-600 text-sm font-medium cursor-pointer hover:underline">Ver Todas</span>
          </div>

          {/* Logic for Writing Review */}
          {canReview && !showReviewForm && (
            <div className="mb-4 bg-yellow-50 p-3 rounded-xl border border-yellow-200 animate-scale-in">
               <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={16} className="text-yellow-600"/>
                  <span className="font-bold text-sm text-slate-800">¡Compraste este producto!</span>
               </div>
               <p className="text-xs text-gray-600 mb-2">Deja una reseña y gana <b className="text-yellow-600">+3 QvaCoins</b>.</p>
               <button 
                  onClick={() => setShowReviewForm(true)}
                  className="w-full bg-slate-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-solar-500 transition-colors"
               >
                  Escribir Reseña
               </button>
            </div>
          )}

          {showReviewForm && (
            <div className="mb-4 bg-white border border-gray-200 p-4 rounded-xl shadow-sm animate-scale-in">
                <h3 className="font-bold text-sm mb-2">Tu Opinión</h3>
                <div className="flex gap-1 mb-3">
                   {[1,2,3,4,5].map(star => (
                      <button key={star} onClick={() => setRating(star)}>
                         <Star size={24} className={`transition-colors ${star <= rating ? "fill-solar-500 text-solar-500" : "text-gray-300 hover:text-solar-300"}`} />
                      </button>
                   ))}
                </div>
                <textarea 
                   className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-3 focus:ring-2 focus:ring-solar-500 outline-none transition-all"
                   rows={3}
                   placeholder="Cuéntanos qué te pareció..."
                   value={comment}
                   onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <div className="flex gap-2">
                   <button onClick={() => setShowReviewForm(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-200">Cancelar</button>
                   <button onClick={handleSubmitReview} className="flex-1 bg-solar-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-solar-600 shadow-md">Publicar (+3 Monedas)</button>
                </div>
            </div>
          )}

          <div className="space-y-4">
             {product.reviews?.map((review, idx) => (
                <div key={`${review.id}-${idx}`} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                   <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold">{review.userName[0]}</div>
                         <span className="text-sm font-bold text-slate-800">{review.userName}</span>
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                   </div>
                   <div className="flex gap-0.5 mb-1">
                       {[...Array(5)].map((_, i) => (
                           <Star key={i} size={12} className={i < review.rating ? "fill-solar-500 text-solar-500" : "text-gray-300"} />
                       ))}
                   </div>
                   <p className="text-xs text-gray-600">{review.comment}</p>
                </div>
             ))}
          </div>
      </div>

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center gap-3 z-50 animate-slide-up">
          <div className="flex flex-col items-center px-2">
             <span className="text-[10px] text-gray-500">Total</span>
             <span className="font-bold text-xl text-slate-900 animate-pulse">${product.price}</span>
          </div>
          <button 
             onClick={() => { onAdd(product); onBack(); }}
             className="flex-1 bg-gradient-to-r from-solar-500 to-solar-600 text-white font-bold py-3 rounded-full shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
          >
             <ShoppingBag size={20} /> Añadir al Carrito
          </button>
      </div>

      {/* Subscription Modal */}
      {showStockModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-scale-in">
                  <button onClick={() => setShowStockModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-slate-800"><ArrowLeft size={20}/></button>
                  
                  <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-solar-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Bell size={24} className="text-solar-600"/>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                          {isSubscribed ? 'Cancelar Suscripción' : 'Alertas de Stock'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                          {isSubscribed 
                             ? '¿Ya no quieres recibir notificaciones sobre este producto?' 
                             : 'Recibe una notificación por correo o push cuando tengamos unidades disponibles.'}
                      </p>
                  </div>

                  {!isSubscribed && (
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correo Electrónico</label>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-solar-500">
                            <Mail size={16} className="text-gray-400"/>
                            <input 
                                type="email" 
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="tu@email.com"
                                className="flex-1 outline-none text-sm text-slate-800"
                            />
                        </div>
                    </div>
                  )}

                  <button 
                      onClick={handleStockSubscribe}
                      className={`w-full py-3 rounded-xl font-bold shadow-md transition-all active:scale-95 ${
                          isSubscribed 
                          ? 'bg-gray-100 text-red-500 hover:bg-gray-200' 
                          : 'bg-solar-500 text-white hover:bg-solar-600'
                      }`}
                  >
                      {isSubscribed ? 'Dejar de Recibir Alertas' : 'Notificarme'}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProductDetails;
