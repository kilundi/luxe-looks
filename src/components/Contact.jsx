import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, MapPin, Heart, Video, Clock, ArrowUp } from 'lucide-react';

const Contact = ({ siteSettings }) => {
  const {
    phone_number = '',
    contact_email = '',
    address = '',
    whatsapp = 'https://chat.whatsapp.com/Gb8xGhuAacOJzY7cuMO5tK',
    facebook = '',
    instagram = '',
    twitter = '',
  } = siteSettings || {};

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Heart,
      url: instagram || 'https://www.instagram.com/luxe_looks15',
      color: 'from-purple-600 to-pink-600',
    },
    {
      name: 'TikTok',
      icon: Video,
      url: 'https://www.tiktok.com/@luxe.looks.beautyke26',
      color: 'from-pink-500 to-black',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: whatsapp || 'https://chat.whatsapp.com/Gb8xGhuAacOJzY7cuMO5tK',
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <section id="contact" className="section bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-secondary mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with us on social media or join our WhatsApp community for the latest updates and exclusive offers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info & Social */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-bold text-secondary mb-6">
                Follow Us
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-r ${social.color} text-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <social.icon size={32} />
                    <span className="font-semibold">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-serif font-bold text-secondary mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                    <Phone className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">Phone</p>
                    <a
                      href={`tel:${phone_number.replace(/\D/g, '')}`}
                      className="text-gray-600 hover:text-primary transition-colors font-medium text-lg"
                    >
                      {phone_number || '0701974458'}
                    </a>
                    <p className="text-sm text-gray-500">Mon-Sat, 8am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">Email</p>
                    <a
                      href={`mailto:${contact_email}`}
                      className="text-gray-600 hover:text-primary transition-colors font-medium"
                    >
                      {contact_email || 'luxe.looksbeautyandcosmeticske@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">Location</p>
                    <p className="text-gray-600">{address || 'Nairobi, Kenya'}</p>
                    <p className="text-sm text-gray-500">Online store with delivery countrywide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-serif font-bold text-secondary mb-6 flex items-center gap-3">
                <Clock className="text-primary" size={28} />
                Business Hours
              </h3>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {[
                      { day: 'Sunday', hours: 'Closed', closed: true },
                      { day: 'Monday', hours: '08:00 - 18:00', closed: false },
                      { day: 'Tuesday', hours: '08:00 - 18:00', closed: false },
                      { day: 'Wednesday', hours: '08:00 - 18:00', closed: false },
                      { day: 'Thursday', hours: '08:00 - 18:00', closed: false },
                      { day: 'Friday', hours: '08:00 - 18:00', closed: false },
                    ].map((schedule, index) => (
                      <tr
                        key={schedule.day}
                        className={`${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        } ${schedule.closed ? 'text-red-600' : ''}`}
                      >
                        <td className="px-6 py-4 font-semibold text-secondary">
                          {schedule.day}
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-right">
                          {schedule.closed ? (
                            <span className="text-red-600 font-medium">
                              {schedule.hours}
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium">
                              {schedule.hours}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                All times are in EAT (East Africa Time).
              </p>
            </div>

            {/* Trust Signals */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-serif font-bold text-secondary mb-6">
                Why Choose Us?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '✓', text: '100% Authentic', color: 'bg-green-100 text-green-700' },
                  { icon: '🚚', text: 'Fast Delivery', color: 'bg-blue-100 text-blue-700' },
                  { icon: '💬', text: '24/7 WhatsApp Support', color: 'bg-green-100 text-green-700' },
                  { icon: '💰', text: 'Cash on Delivery', color: 'bg-yellow-100 text-yellow-700' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`${item.color} rounded-xl p-4 text-center font-semibold shadow-md`}
                  >
                    <span className="text-2xl mb-2 block">{item.icon}</span>
                    {item.text}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-serif font-bold text-secondary mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {[
                  {
                    q: 'How long does delivery take?',
                    a: 'We deliver within 24-48 hours within Nairobi and 2-5 days to other towns across Kenya.',
                  },
                  {
                    q: 'Do you deliver to my area?',
                    a: 'Yes! We deliver nationwide. Send us your location on WhatsApp to confirm delivery availability and cost.',
                  },
                  {
                    q: 'Are your products 100% authentic?',
                    a: 'Absolutely! We source only genuine products from authorized suppliers. Authenticity guaranteed.',
                  },
                  {
                    q: 'What payment methods do you accept?',
                    a: 'We accept M-Pesa, cash on delivery, and bank transfers. All payment details provided at checkout via WhatsApp.',
                  },
                  {
                    q: 'What is your return policy?',
                    a: 'We accept returns within 24 hours of delivery if the product is unopened and in original packaging. Contact us on WhatsApp for assistance.',
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <details className="bg-white rounded-xl shadow-md overflow-hidden">
                      <summary className="flex justify-between items-center p-5 cursor-pointer font-semibold text-secondary hover:bg-gray-50 transition-colors list-none">
                        {faq.q}
                        <span className="text-primary text-2xl">+</span>
                      </summary>
                      <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                        {faq.a}
                      </div>
                    </details>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-serif font-bold text-secondary mb-4">
                Get 10% Off Your First Order!
              </h3>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter for exclusive deals, beauty tips, and early access to new arrivals.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = e.target.elements.email.value;
                  if (email) {
                    alert('Thank you for subscribing! Check your WhatsApp for your discount code.');
                    e.target.reset();
                  }
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-3">
                No spam, unsubscribe anytime.
              </p>
            </div>

            {/* WhatsApp CTA */}
            <div className="pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-primary to-yellow-600 rounded-2xl p-8 text-white text-center shadow-xl">
                <MessageCircle className="mx-auto mb-4" size={48} />
              <h4 className="text-2xl font-bold mb-3">Want Personalized Service?</h4>
              <p className="mb-6 opacity-90">
                Join our WhatsApp community for exclusive deals, beauty tips, and direct access to our team.
              </p>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary font-bold py-4 px-8 rounded-full inline-block shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Join WhatsApp Community
              </a>
            </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-serif font-bold text-secondary">
              Find Us
            </h3>
            <p className="text-gray-600">
              Based in Nairobi, we deliver across Kenya. Visit us virtually or come by for a pop-up event!
            </p>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5174.214801657642!2d37.6571884749646!3d-0.3202621996765874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1827b9216a3cab59%3A0x3c80e80a69b272d1!2sLuxe%20Looks%20Beauty%20and%20Cosmetics%2C%20Kenya!5e1!3m2!1sen!2ske!4v1775304808462!5m2!1sen!2ske"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Luxe Looks Beauty and Cosmetics Kenya Location"
                className="block"
              />
            </div>

            <p className="text-sm text-gray-500 italic">
              Note: We're an online-first store. This map shows our delivery coverage area in Nairobi and across Kenya. Visit our WhatsApp community for real-time updates on pop-up locations.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
