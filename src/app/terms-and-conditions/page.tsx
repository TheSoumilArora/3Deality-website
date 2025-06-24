'use client'
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsAndConditions() {
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
          <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
              By using our website and services, you agree to be bound by these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
              <p className="text-muted-foreground">
                You agree not to misuse the website or interfere with its normal operation. Illegal or unauthorized use is prohibited.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Use License</h2>
              <p className="text-muted-foreground">
                Permission is granted to temporarily use 3Deality's services for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a 
                transfer of title.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
              <p className="text-muted-foreground">
                We strive to ensure our services are available 24/7, but we do not guarantee 
                uninterrupted access. We reserve the right to modify or discontinue services 
                at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                In no event shall 3Deality be liable for any damages arising out of the use or 
                inability to use our services, even if we have been notified of the possibility 
                of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Modifications to Terms</h2>
              <p className="text-muted-foreground">
                These terms may change at any time. Continued use after updates implies agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="text-muted-foreground">
                These terms and conditions are governed by and construed in accordance with the 
                laws of India and you irrevocably submit to the exclusive jurisdiction of the 
                courts in the state of Punjab.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}