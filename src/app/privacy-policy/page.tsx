'use client'
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, such as when you create an account,
                place an order, or contact us. This may include your name, email, phone number, shipping
                address, and payment information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use this information to process orders, provide customer service, and improve
                our website and services. We may also contact you about offers or updates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
              <p className="text-muted-foreground">
                We do not sell your data. We may share your information with third parties like payment
                processors, delivery services, and analytics tools solely to complete your order or improve
                services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
              <p className="text-muted-foreground">
                We use cookies to personalize your experience, analyze traffic, and serve relevant content.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <p className="text-muted-foreground">
                We retain data only as long as necessary to fulfill orders or legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                Questions? Contact us at soumil789@gmail.com or call +91-8847559327 (Mon–Sat, 10AM–6PM IST).
              </p>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}