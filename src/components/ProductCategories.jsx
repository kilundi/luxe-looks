import { motion } from 'framer-motion';
import { ShoppingBag, Watch, Gem, Sparkles, Heart, MessageCircle } from 'lucide-react';

const ProductCategories = ({ siteSettings }) => {
  const { whatsapp = '' } = siteSettings || {};
  const waLink = whatsapp || 'https://chat.whatsapp.com/Gb8xGhuAacOJzY7cuMO5tK';

  const categories = [
    {
      id: 1,
      name: 'Fragrances',
      subtitle: 'Oil-Based Perfumes',
      description: 'Long-lasting designer fragrances with premium oil-based formulations',
      icon: Sparkles,
      color: 'from-amber-600 to-yellow-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
      link: waLink,
    },
    {
      id: 2,
      name: 'Beauty',
      subtitle: 'Cosmetics & Skincare',
      description: 'Luxury makeup and skincare products for radiant, flawless beauty',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
      link: waLink,
    },
    {
      id: 3,
      name: 'Hair',
      subtitle: 'Premium Human Hair',
      description: 'Authentic human hair wigs, extensions, and hair care products',
      icon: Sparkles,
      color: 'from-amber-800 to-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      link: waLink,
    },
    {
      id: 4,
      name: 'Bags',
      subtitle: 'Luxury Accessories',
      description: 'Elegant handbags and accessories for the modern woman',
      icon: ShoppingBag,
      color: 'from-stone-600 to-gray-600',
      bgColor: 'bg-gradient-to-br from-stone-50 to-gray-50',
      link: waLink,
    },
    {
      id: 5,
      name: 'Watches',
      subtitle: 'Timeless Elegance',
      description: 'Sophisticated timepieces that make a statement',
      icon: Watch,
      color: 'from-blue-600 to-slate-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-slate-50',
      link: waLink,
    },
    {
      id: 6,
      name: 'Jewelry',
      subtitle: 'Fine Accessories',
      description: 'Exquisite jewelry pieces to complement your style',
      icon: Gem,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50',
      link: waLink,
    },
  ];

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
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="product-card group cursor-pointer"
            >
              <a href={category.link} target="_blank" rel="noopener noreferrer">
                <div className={`${category.bgColor} p-8 h-64 flex items-center justify-center relative overflow-hidden`}>
                  {/* Decorative circle */}
                  <div className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500`} />

                  <category.icon
                    className={`relative z-10 w-24 h-24 text-gradient-to-br ${category.color} group-hover:scale-110 transition-transform duration-300`}
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
                        {category.subtitle}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Overlay CTA */}
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
          ))}
        </motion.div>

        {/* View All Products CTA */}
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
