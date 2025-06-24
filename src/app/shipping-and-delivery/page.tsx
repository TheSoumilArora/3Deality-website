'use client'
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ShippingAndDelivery() {
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
          <h1 className="text-4xl font-bold mb-8">Shipping and Delivery</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
              <p className="text-muted-foreground">
                All orders are processed within 24-48 hours. Processing time may be extended 
                during peak seasons or for custom orders requiring special attention. (ETA will
                be communicated via phone / email after order confirmation.)
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Shipping Methods</h2>
              <p className="text-muted-foreground">
                We offer multiple shipping options including standard delivery (5-7 business days) 
                and express delivery (2-3 business days). Shipping costs are calculated based on 
                the weight and dimensions of your order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Delivery Areas</h2>
              <p className="text-muted-foreground">
                We currently deliver across India. For international orders, please contact us 
                directly for shipping quotes and delivery times. Duties or customs fees are borne
                by the recipient.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
              <p className="text-muted-foreground">
                Once your order is shipped, you will receive a tracking number via phone / email. 
                You can use this number to track your package's progress.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Delivery Issues</h2>
              <p className="text-muted-foreground">
                If you experience any issues with delivery, please contact us immediately at 
                soumil789@gmail.com or +91-8847559327. We will work to resolve any problems quickly.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}