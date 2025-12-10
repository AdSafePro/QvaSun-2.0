
import { Product, InvestmentPlan } from './types';

export const CUBAN_MUNICIPALITIES = [
  "Playa, La Habana", "Plaza de la Revolución, La Habana", "Centro Habana, La Habana",
  "Habana del Este, La Habana", "Marianao, La Habana", "Boyeros, La Habana",
  "Viñales, Pinar del Río", "Varadero, Matanzas", "Cárdenas, Matanzas",
  "Santa Clara, Villa Clara", "Cienfuegos, Cienfuegos", "Sancti Spíritus, Sancti Spíritus",
  "Trinidad, Sancti Spíritus", "Ciego de Ávila, Ciego de Ávila", "Camagüey, Camagüey",
  "Holguín, Holguín", "Santiago de Cuba, Santiago de Cuba", "Guantánamo, Guantánamo",
  "Isla de la Juventud"
];

const REVIEWS = [
  { id: 'r1', userName: 'Yosvany P.', rating: 5, comment: 'Excelente calidad, llegó en 3 días al Vedado.', date: '2023-10-15', verified: true },
  { id: 'r2', userName: 'Maria C.', rating: 4, comment: 'Funciona perfecto para los apagones. Recomendado.', date: '2023-10-10', verified: true },
  { id: 'r3', userName: 'Alejandro R.', rating: 5, comment: 'El mejor precio que encontré. Aceptan USDT sin problemas.', date: '2023-09-28', verified: true }
];

export const RANDOM_REVIEW_DATA = {
  names: [
    "Carlos D.", "Elena M.", "Jorge L.", "Dianelis G.", "Roberto F.", "Carmen S.", 
    "Lazaro B.", "Yanet P.", "Orestes V.", "Hildelisa R.", "Yoandy T.", "Dayana C.",
    "Ariel M.", "Beatriz L.", "Camilo R.", "Daniela S.", "Eduardo J.", "Fatima G.",
    "Gabriel P.", "Hector Z.", "Irene B.", "Javier Q.", "Karla N.", "Luis Miguel"
  ],
  comments: [
    "Me resolvió el problema de los apagones.",
    "Llegó antes de lo esperado. Muy buena atención.",
    "El producto se siente de calidad. Volveré a comprar.",
    "Funciona bien, aunque la caja llegó un poco golpeada.",
    "Excelente para el clima de Cuba.",
    "Lo recomiendo 100%. Aceptan pagos fáciles.",
    "Muy útil. Ya tengo luz toda la noche.",
    "Buena relación calidad-precio.",
    "El servicio al cliente me ayudó a instalarlo.",
    "Todo correcto, vendedor serio.",
    "Impresionante la rapidez del envío.",
    "Mis vecinos me preguntan dónde lo compré.",
    "La mejor inversión que he hecho este año.",
    "Súper fácil de usar, hasta mi abuela lo entiende.",
    "Calidad premium, se nota en los materiales.",
    "QvaSun es lo máximo, gracias por existir.",
    "Me encanta poder pagar con USDT.",
    "El ahorro en la factura eléctrica se nota.",
    "Funciona de maravilla con mi refrigerador.",
    "Atención al cliente de primera categoría.",
    "Exactamente como en la descripción.",
    "Muy satisfecho con la compra.",
    "Recomendado para toda la familia cubana.",
    "Llegó bien embalado y seguro.",
    "La batería dura más de lo que pensaba."
  ]
};

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: 'local',
    name: 'Almacén Local',
    minEntry: 10,
    dailyRoiPercent: 0.5,
    description: 'Inversión básica en infraestructura local.',
    color: 'bg-slate-700'
  },
  {
    id: 'regional',
    name: 'Almacén Regional',
    minEntry: 10,
    dailyRoiPercent: 0.8,
    description: 'Expansión a provincias centrales.',
    color: 'bg-solar-600'
  },
  {
    id: 'mundial',
    name: 'Almacén Mundial',
    minEntry: 10,
    dailyRoiPercent: 1.2,
    description: 'Participación en importaciones globales.',
    color: 'bg-gradient-to-r from-purple-600 to-blue-600'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Panel Monocristalino QvaSun 450W',
    price: 120.99,
    originalPrice: 199.99,
    image: 'https://picsum.photos/400/400?random=1',
    gallery: ['https://picsum.photos/400/400?random=101', 'https://picsum.photos/400/400?random=102', 'https://picsum.photos/400/400?random=103'],
    description: 'Panel solar monocristalino de alta eficiencia perfecto para el clima cubano. Resistente a altas temperaturas y humedad.',
    specs: { 'Potencia': '450W', 'Eficiencia': '21.5%', 'Dimensiones': '180x100cm' },
    rating: 4.8,
    reviews: REVIEWS,
    soldCount: 1240,
    stock: 15,
    category: 'paneles',
    flashSale: true,
    timeLeft: 3600
  },
  {
    id: 'p2',
    name: 'Generador Solar 2000 Pro',
    price: 899.00,
    originalPrice: 1299.00,
    image: 'https://picsum.photos/400/400?random=2',
    gallery: ['https://picsum.photos/400/400?random=201', 'https://picsum.photos/400/400?random=202'],
    description: 'Alimenta toda tu casa durante los apagones. Silencioso, ecológico y de carga rápida.',
    specs: { 'Capacidad': '2000Wh', 'Salida': '220V AC', 'Recarga': 'Solar/Red' },
    rating: 4.9,
    reviews: REVIEWS,
    soldCount: 532,
    stock: 8,
    category: 'baterias',
    flashSale: true,
    timeLeft: 7200
  },
  {
    id: 'p3',
    name: 'Inversor Híbrido 5kW 48V',
    price: 450.50,
    originalPrice: 550.00,
    image: 'https://picsum.photos/400/400?random=3',
    gallery: ['https://picsum.photos/400/400?random=301'],
    description: 'Inversor inteligente que gestiona energía solar, batería y red automáticamente. Incluye monitoreo WiFi.',
    specs: { 'Potencia': '5000W', 'Voltaje': '48V', 'Tipo': 'Onda Pura' },
    rating: 4.6,
    reviews: [], // Simulating no reviews initially
    soldCount: 890,
    stock: 42,
    category: 'inversores'
  },
  {
    id: 'p4',
    name: 'Kit Cabaña Desconectada',
    price: 2499.00,
    originalPrice: 3200.00,
    image: 'https://picsum.photos/400/400?random=4',
    gallery: ['https://picsum.photos/400/400?random=401', 'https://picsum.photos/400/400?random=402', 'https://picsum.photos/400/400?random=403'],
    description: 'Todo lo que necesitas para desconectarte de la red. Incluye 4 paneles, inversor y banco de baterías de 5kWh.',
    specs: { 'Salida Diaria': '8kWh', 'Sistema': '48V', 'Instalación': 'Fácil' },
    rating: 5.0,
    reviews: REVIEWS,
    soldCount: 112,
    stock: 3,
    category: 'kits',
    flashSale: true
  },
  {
    id: 'p5',
    name: 'Cargador Solar Portátil 100W',
    price: 89.99,
    originalPrice: 149.99,
    image: 'https://picsum.photos/400/400?random=5',
    gallery: ['https://picsum.photos/400/400?random=501'],
    description: 'Plegable y ligero. Mantén tu teléfono y laptop cargados en cualquier lugar.',
    specs: { 'Salida': 'USB-C/USB-A', 'Tamaño': 'Tipo Laptop', 'Peso': '2kg' },
    rating: 4.5,
    reviews: [], // Simulating no reviews
    soldCount: 3400,
    stock: 120,
    category: 'paneles'
  },
  {
    id: 'p6',
    name: 'Batería LiFePO4 100Ah 12V',
    price: 299.00,
    originalPrice: 399.00,
    image: 'https://picsum.photos/400/400?random=6',
    gallery: ['https://picsum.photos/400/400?random=601'],
    description: 'Tecnología de batería de mayor duración. 6000+ ciclos. Reemplazo perfecto para plomo-ácido.',
    specs: { 'Química': 'LiFePO4', 'Ciclos': '6000+', 'BMS': 'Integrado' },
    rating: 4.7,
    reviews: REVIEWS,
    soldCount: 2100,
    stock: 5,
    category: 'baterias',
    flashSale: true,
    timeLeft: 1800
  }
];

export const NOWPAYMENTS_WALLET = "0x7a83920938...BEP20"; // Billetera Simulada
