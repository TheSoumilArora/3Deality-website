
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function CancellationsAndRefund() {
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
          <h1 className="text-4xl font-bold mb-8">Cancellations and Refund</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Order Cancellation</h2>
              <p className="text-muted-foreground">
                Orders can be cancelled within 24 hours of placement, provided they have not 
                entered the printing phase. Once printing has begun, orders cannot be cancelled 
                due to the custom nature of 3D printing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Refund Policy</h2>
              <p className="text-muted-foreground">
                We offer refunds for defective products or printing errors on our part. 
                Refunds will be processed within 5-7 business days to the original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Return Process</h2>
              <p className="text-muted-foreground">
                To initiate a return, please contact us within 7 days of receiving your order. 
                Items must be returned in their original condition. Return shipping costs may 
                apply unless the return is due to our error.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
              <p className="text-muted-foreground">
                Custom-designed items, personalized products, and items printed with customer-provided 
                files are generally non-returnable unless there is a printing defect or error.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact for Refunds</h2>
              <p className="text-muted-foreground">
                For all refund and cancellation requests, please contact us at soumil789@gmail.com 
                or call +91-8847559327. Our customer service team will assist you promptly.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
