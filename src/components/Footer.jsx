import { Heart, Camera, Video, MessageCircle } from 'lucide-react';
import logo from '../assets/logo.png';
import PaymentMethods from './PaymentMethods';

const Footer = ({ siteSettings }) => {
  const currentYear = new Date().getFullYear();
  const { phone_number = '', contact_email = '', whatsapp = 'https://chat.whatsapp.com/Gb8xGhuAacOJzY7cuMO5tK', site_name = 'Luxe Looks' } = siteSettings || {};

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Collections', href: '#collections' },
    { name: 'About', href: '#about' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  const categories = [
    { name: 'Fragrances', href: '#collections' },
    { name: 'Beauty', href: '#collections' },
    { name: 'Hair', href: '#collections' },
    { name: 'Bags', href: '#collections' },
    { name: 'Watches', href: '#collections' },
    { name: 'Jewelry', href: '#collections' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Camera,
      url: 'https://www.instagram.com/luxe_looks15',
    },
    {
      name: 'TikTok',
      icon: Video,
      url: 'https://www.tiktok.com/@luxe.looks.beautyke26',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: whatsapp || 'https://chat.whatsapp.com/Gb8xGhuAacOJzY7cuMO5tK',
    },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-secondary text-accent">
      <div className="container-custom section pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <img
              src={logo}
              alt="Luxe Looks Beauty & Cosmetics KE"
              className="h-16 w-auto"
            />
            <p className="text-gray-400 leading-relaxed">
              Timeless beauty, modern elegance. Your destination for premium beauty and luxury products in Kenya.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-primary p-3 rounded-full transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-accent mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold text-accent mb-6">Categories</h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <a
                    href={category.href}
                    onClick={(e) => scrollToSection(e, category.href)}
                    className="text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div>
            <h4 className="text-lg font-bold text-accent mb-6">Stay Connected</h4>
            <p className="text-gray-400 mb-4">
              Join our WhatsApp community for exclusive deals and updates.
            </p>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full flex items-center justify-center gap-3"
            >
              <MessageCircle size={20} />
              Join Community
            </a>
          </div>
        </div>

        <PaymentMethods />

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Luxe Looks Beauty & Cosmetics KE. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              Made with <Heart className="text-red-500" size={16} fill="currentColor" /> in Kenya
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
