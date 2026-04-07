import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import SkipToContent from './components/SkipToContent';
import PageLoader from './components/PageLoader';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ProductCategories from './components/ProductCategories';
import ProductShowcase from './components/ProductShowcase';
import About from './components/About';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BackToTop from './components/BackToTop';
import ScrollProgress from './components/ScrollProgress';
import './index.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [siteSettings, setSiteSettings] = useState({
    site_name: 'Luxe Looks',
    phone_number: '',
    contact_email: '',
    address: '',
    whatsapp: '',
    facebook: '',
    instagram: '',
    twitter: '',
  });

  useEffect(() => {
    fetch(`${API_URL}/site`)
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSiteSettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <HelmetProvider>
      <div className="min-h-screen">
        <PageLoader />
        <Helmet>
          <title>Luxe Looks Beauty & Cosmetics KE | Premium Beauty in Kenya</title>
          <meta
            name="description"
            content="Luxe Looks Beauty & Cosmetics KE - Your destination for authentic designer perfumes, human hair, and luxury accessories in Nairobi. Premium beauty products delivered across Kenya."
          />
          <meta
            name="keywords"
            content="Luxury Cosmetics Kenya, Oil based perfumes Nairobi, Premium Human Hair KE, Designer fragrances Kenya, Luxury beauty Nairobi, Kenyan cosmetics store, Luxe Looks"
          />
          <meta property="og:title" content="Luxe Looks Beauty & Cosmetics KE" />
          <meta
            property="og:description"
            content="Your destination for premium beauty and luxury products in Kenya. Authentic designer perfumes, human hair, cosmetics, bags, watches, and jewelry."
          />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="en_KE" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Luxe Looks Beauty & Cosmetics KE" />
          <meta
            name="twitter:description"
            content="Premium beauty products delivered across Kenya. Join our WhatsApp community for exclusive deals!"
          />
          <link rel="canonical" href="https://luxelooks.co.ke" />
        </Helmet>

        <SkipToContent />
        <ScrollProgress />
        <Navigation siteSettings={siteSettings} />
        <main id="main-content">
          <Hero siteSettings={siteSettings} />
          <ProductCategories siteSettings={siteSettings} />
          <ProductShowcase siteSettings={siteSettings} />
          <About siteSettings={siteSettings} />
          <Reviews />
          <Contact siteSettings={siteSettings} />
        </main>
        <Footer siteSettings={siteSettings} />
        <FloatingWhatsApp siteSettings={siteSettings} />
        <BackToTop />
      </div>
    </HelmetProvider>
  );
}

export default App;
