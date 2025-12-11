

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number; // En USDT
  originalPrice: number;
  image: string;
  gallery: string[]; // Imágenes adicionales
  description: string;
  specs: Record<string, string>;
  rating: number;
  reviews: Review[];
  soldCount: number;
  stock: number;
  category: 'paneles' | 'baterias' | 'inversores' | 'kits' | 'accesorios';
  flashSale?: boolean;
  timeLeft?: number; // Segundos
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  municipality: string;
  province: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'procesando' | 'enviado' | 'entregado';
  deliveredDate?: string; // ISO String
  trackingNumber?: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minEntry: number;
  dailyRoiPercent: number;
  description: string;
  color: string;
}

export interface UserInvestment {
  id: string;
  planId: string;
  planName: string;
  amountInvested: number;
  startDate: string;
  dailyEarnings: number; // En Monedas
  totalEarnedCoins: number;
  status: 'active' | 'completed';
}

export interface UserState {
  usdtBalance: number;
  withdrawableBalance: number; // Convertido de monedas/recompensas
  qvaCoins: number;
  referralCode: string;
  referrals: number;
  name: string;
  email: string;
  avatar: string;
  lastCheckInDate: string; // YYYY-MM-DD
  checkInStreak: number;
  addresses: Address[];
  orders: Order[];
  withdrawalAddress: string; // Dirección USDT BEP20 del usuario
  investments: UserInvestment[];
  reviewedProductIds: string[];
  stockAlerts: string[]; // IDs of products user subscribed to
  // Card Fields
  hasCard: boolean;
  cardBalance: number;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  cardBlocked: boolean;
}

export interface Transaction {
  id: string;
  type: 'deposito' | 'compra' | 'retiro' | 'recompensa' | 'intercambio' | 'inversion' | 'tarjeta_recarga' | 'tarjeta_gasto';
  amount: number;
  currency: 'USDT' | 'QvaCoin';
  status: 'completado' | 'pendiente' | 'fallido';
  date: string;
  details?: string;
}