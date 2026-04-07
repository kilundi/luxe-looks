import { motion } from 'framer-motion';
import { Truck, Shield, Clock, Award, MapPin } from 'lucide-react';

const About = ({ siteSettings }) => {
  const whatsapp = siteSettings?.whatsapp || 'https://chat.whatsapp.com/Gb8xGhuAacOJzY7cuMO5tK';
  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Door-to-door delivery across major towns in Kenya',
    },
    {
      icon: Shield,
      title: '100% Authentic',
      description: 'Only genuine, premium products from trusted suppliers',
    },
    {
      icon: Clock,
      title: 'Fast Service',
      description: 'Quick response and efficient order processing',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Curated selection of luxury beauty & fashion items',
    },
  ];

  return (
    <section id="about" className="section bg-secondary text-accent">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative z-10">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop"
                  alt="Luxury beauty products showcase"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/20 rounded-2xl -z-10" />

            {/* Map indicator */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -top-6 -right-6 glass-dark rounded-full p-4"
            >
              <MapPin className="text-primary" size={24} />
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-accent mb-6">
              About Luxe Looks
            </h2>

            <div className="space-y-6 text-lg leading-relaxed text-gray-300">
              <p>
                At <span className="text-primary font-semibold">Luxe Looks Beauty & Cosmetics KE</span>, we believe that every individual deserves to experience the finest in beauty and luxury. Our mission is to bring premium quality products — from authentic designer fragrances to exquisite human hair and luxury accessories — closer to you.
              </p>

              <p>
                While we're currently an online-first store, we're committed to serving customers across Kenya with the same level of personalized service you'd expect from a luxury boutique. Our WhatsApp Community is the heart of our customer experience, where we share exclusive deals, beauty tips, and personalized recommendations.
              </p>

              <p>
                We carefully curate our collection to ensure only the highest quality products make it to your doorstep. Every item is authentic, sourced from trusted suppliers, and selected with you in mind.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="glass-dark rounded-xl p-5"
                >
                  <feature.icon className="text-primary mb-3" size={28} />
                  <h4 className="font-bold text-accent mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-3"
              >
                Connect with Us
                <Truck size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delivery Coverage */}
      <div className="mt-24 border-t border-gray-800 pt-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-3xl font-serif font-bold text-accent mb-6">
              Where to Find Us / Delivery Coverage
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              We deliver to all major towns across Kenya including Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and more. Stay updated on our social media for occasional pop-up events!
            </p>

            {/* Embedded Map */}
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5174.214801657642!2d37.6571884749646!3d-0.3202621996765874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1827b9216a3cab59%3A0x3c80e80a69b272d1!2sLuxe%20Looks%20Beauty%20and%20Cosmetics%2C%20Kenya!5e1!3m2!1sen!2ske!4v1775304808462!5m2!1sen!2ske"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Luxe Looks Beauty and Cosmetics Kenya Location"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
