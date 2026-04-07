import { motion } from 'framer-motion';
import { ShoppingBag, Watch, Gem, Sparkles, Heart, MessageCircle, Palette, Crown, Droplets, Scissors, Feather, Baby, Glasses, Umbrella, Sun, Anchor, Zap } from 'lucide-react';

const ICON_MAP = {
  shoppingbag: ShoppingBag,
  watch: Watch,
  gem: Gem,
  sparkles: Sparkles,
  heart: Heart,
  palette: Palette,
  crown: Crown,
  droplets: Droplets,
  scissors: Scissors,
  feather: Feather,
  baby: Baby,
  glasses: Glasses,
  umbrella: Umbrella,
  sun: Sun,
  anchor: Anchor,
  zap: Zap,
  tag: Gem,
};

const DEFAULT_CATEGORIES = [
  {
    id: 1,
    name: 'Fragrances',
    subtitle: 'Oil-Based Perfumes',
    description: 'Long-lasting designer fragrances with premium oil-based formulations',
    icon: 'sparkles',
    color: '#D4AF37',
    link: '',
  },
  {
    id: 2,
    name: 'Beauty',
    subtitle: 'Cosmetics & Skincare',
    description: 'Luxury makeup and skincare products for radiant, flawless beauty',
    icon: 'heart',
    color: '#EC4899',
    link: '',
  },
  {
    id: 3,
    name: 'Hair',
    subtitle: 'Premium Human Hair',
    description: 'Authentic human hair wigs, extensions, and hair care products',
    icon: 'sparkles',
    color: '#D97706',
    link: '',
  },
  {
    id: 4,
    name: 'Bags',
    subtitle: 'Luxury Accessories',
    description: 'Elegant handbags and accessories for the modern woman',
    icon: 'shoppingbag',
    color: '#57534E',
    link: '',
  },
  {
    id: 5,
    name: 'Watches',
    subtitle: 'Timeless Elegance',
    description: 'Sophisticated timepieces that make a statement',
    icon: 'watch',
    color: '#3B82F6',
    link: '',
  },
  {
    id: 6,
    name: 'Jewelry',
    subtitle: 'Fine Accessories',
    description: 'Exquisite jewelry pieces to complement your style',
    icon: 'gem',
    color: '#EAB308',
    link: '',
  },
];

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const getColorShade = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return { from: 'from-gray-400', to: 'to-gray-600' };
  
  const { r, g, b } = rgb;
  if (r > g && r > b) return { from: 'from-amber-600', to: 'to-yellow-600' };
  if (b > r && b > g) return { from: 'from-blue-600', to: 'to-slate-600' };
  if (g > r && g > b) return { from: 'from-green-600', to: 'to-emerald-600' };
  if (r > 200 && g > 100) return { from: 'from-yellow-500', to: 'to-amber-500' };
  if (r > 200 && g < 100 && b < 100) return { from: 'from-pink-500', to: 'to-rose-500' };
  
  const colors = [
    { from: 'from-amber-600', to: 'to-yellow-600' },
    { from: 'from-pink-500', to: 'to-rose-500' },
    { from: 'from-amber-800', to: 'to-amber-600' },
    { from: 'from-stone-600', to: 'to-gray-600' },
    { from: 'from-blue-600', to: 'to-slate-600' },
    { from: 'from-yellow-500', to: 'to-amber-500' },
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getBgColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'bg-gradient-to-br from-gray-50 to-gray-100';
  
  const { r, g, b } = rgb;
  if (r > g && r > b) return 'bg-gradient-to-br from-amber-50 to-yellow-50';
  if (b > r && b > g) return 'bg-gradient-to-br from-blue-50 to-slate-50';
  if (g > r && g > b) return 'bg-gradient-to-br from-green-50 to-emerald-50';
  if (r > 200 && g > 100) return 'bg-gradient-to-br from-yellow-50 to-amber-50';
  if (r > 200 && g < 100 && b < 100) return 'bg-gradient-to-br from-pink-50 to-rose-50';
  
  return 'bg-gradient-to-br from-gray-50 to-gray-100';
};

const ProductCategories = ({ siteSettings, categories: apiCategories }) => {
  const { whatsapp = '' } = siteSettings || {};
  const waLink = whatsapp || 'https://chat.whatsapp.com/Gb8xGhuAacOJzY7cuMO5tK';

  const categories = (apiCategories && apiCategories.length > 0) 
    ? apiCategories.map(cat => ({
        ...cat,
        link: waLink,
        icon: cat.icon?.toLowerCase() || 'sparkles',
      }))
    : DEFAULT_CATEGORIES.map(cat => ({ ...cat, link: waLink }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="collections" className="section bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-secondary mb-6">
            Our Collections
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Curated luxury products designed to enhance your beauty and style
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((category) => {
            const IconComponent = ICON_MAP[category.icon] || Sparkles;
            const colorShade = getColorShade(category.color || '#D4AF37');
            const bgColor = getBgColor(category.color || '#D4AF37');
            
            return (
              <motion.div
                key={category.id}
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="product-card group cursor-pointer"
              >
                <a href={category.link} target="_blank" rel="noopener noreferrer">
                  <div className={`${bgColor} p-8 h-64 flex items-center justify-center relative overflow-hidden`}>
                    <div className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${colorShade.from} ${colorShade.to} opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500`} />

                    <IconComponent
                      className={`relative z-10 w-24 h-24 group-hover:scale-110 transition-transform duration-300`}
                      style={{ color: '#1A1A1A' }}
                      size={96}
                    />
                  </div>

                  <div className="p-6 bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-secondary mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm text-primary uppercase tracking-wider mb-3">
                          {category.subtitle || category.name}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="product-card-overlay flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <MessageCircle className="text-white" size={32} />
                        <span className="text-white font-semibold text-lg">
                          Shop via WhatsApp
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="#products"
            className="btn-primary inline-flex items-center gap-3 text-lg"
          >
            View All Products
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductCategories;
