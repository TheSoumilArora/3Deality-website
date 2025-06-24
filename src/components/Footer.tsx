'use client'
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">3Deality</h2>
              <p className="text-gray-400 leading-relaxed">
                Bringing 3D imagination to reality with cutting-edge printing technology and exceptional quality.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="w-4 h-4 mr-3 text-orange-500" />
                New Chandigarh, India
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Phone className="w-4 h-4 mr-3 text-orange-500" />
                +91-8847559327
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Mail className="w-4 h-4 mr-3 text-orange-500" />
                soumil789@gmail.com
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/quote', label: 'Get Quote' },
                { href: '/store', label: 'Store' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/contact', label: 'Contact' }
              ].map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-6">Legal</h3>
            <ul className="space-y-3">
              {[
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms-and-conditions', label: 'Terms & Conditions' },
                { href: '/shipping-and-delivery', label: 'Shipping & Delivery' },
                { href: '/cancellations-and-refund', label: 'Cancellations & Refund' }
              ].map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-6">Stay Connected</h3>
            
            {/* Social Links */}
            <div className="flex space-x-4 mb-6">
              {[
                { icon: Instagram, href: 'https://www.instagram.com/3deality.in/', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Twitter, href: '#', label: 'Twitter' }
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-gray-400 text-sm mb-3">
                Subscribe for updates and special offers
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:outline-none focus:border-orange-500"
                />
                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-r-lg text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border-t border-gray-800 pt-8 mt-12 text-center text-gray-400 text-sm"
        >
          <p>© {currentYear} 3Deality. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}