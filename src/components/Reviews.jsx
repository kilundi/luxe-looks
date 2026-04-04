import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: 'Jane Wairimu',
      location: 'Nairobi',
      rating: 5,
      text: "Absolutely love Luxe Looks! The perfumes are long-lasting and the quality is unmatched. Fast delivery and excellent customer service. My go-to for luxury beauty products in Kenya.",
      verified: true,
      avatar: 'JW',
    },
    {
      id: 2,
      name: 'Titus Muthiani',
      location: 'Mombasa',
      rating: 5,
      text: "Premium quality human hair at an amazing price. The team is very helpful on WhatsApp and answered all my questions. Delivery was super fast. Highly recommend!",
      verified: true,
      avatar: 'TM',
    },
    {
      id: 3,
      name: 'Sarah K.',
      location: 'Kisumu',
      rating: 5,
      text: "Finally found authentic designer perfumes in Kenya! The oil-based fragrances last all day. Luxe Looks has exceeded my expectations. Will definitely be ordering again.",
      verified: true,
      avatar: 'SK',
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        className={i < rating ? 'text-primary fill-primary' : 'text-gray-400'}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <section id="reviews" className="section bg-gradient-to-b from-secondary to-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-accent mb-6">
            Customer Reviews
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See what our valued customers are saying about their Luxe Looks experience
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-secondary/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 relative group"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 bg-primary rounded-full p-3 shadow-lg">
                <Quote className="text-secondary" size={20} />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {renderStars(review.rating)}
              </div>

              {/* Review Text */}
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                "{review.text}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-800">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-yellow-700 rounded-full flex items-center justify-center text-secondary font-bold text-lg">
                  {review.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-accent text-lg">
                      {review.name}
                    </h4>
                    {review.verified && (
                      <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full inline-block" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 glass-dark rounded-full px-8 py-4">
            <div className="flex -space-x-2">
              {['🛍️', '✨', '💎', '🌹', '💄'].map((emoji, i) => (
                <span key={i} className="text-2xl">{emoji}</span>
              ))}
            </div>
            <p className="text-accent font-semibold">
              100+ Happy Customers & Counting
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
