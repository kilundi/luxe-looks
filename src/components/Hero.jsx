import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-secondary"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/60 to-secondary/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom section">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-accent mb-6 leading-tight">
              Timeless Beauty,<br />
              <span className="text-primary">Modern Elegance</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Discover curated luxury beauty essentials — from premium fragrances to exquisite cosmetics, all delivered to your doorstep across Kenya.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://chat.whatsapp.com/Gb8xGhuAacOJzY7cuMO5tK"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-3 text-lg w-full sm:w-auto justify-center"
            >
              <MessageCircle size={24} />
              Join WhatsApp Community
            </a>
            <a
              href="#collections"
              className="btn-secondary flex items-center gap-3 text-lg w-full sm:w-auto justify-center"
            >
              Explore Collections
              <ArrowRight size={20} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20"
          >
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-4">
              Trusted by customers across Kenya
            </p>
            <div className="flex items-center justify-center gap-12 flex-wrap">
              {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'].map((city) => (
                <span key={city} className="text-accent/60 font-serif text-lg">
                  {city}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-accent/30 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-2 bg-accent rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
