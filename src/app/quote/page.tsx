'use client'
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import MaterialShowcase from '@/components/quote/MaterialShowcase';
import ServiceCategories from '@/components/quote/ServiceCategories';
import WhatsAppContact from '@/components/quote/WhatsAppContact';
import QuoteForm from '@/components/quote/QuoteForm';
import GoogleReviews from '@/components/quote/GoogleReviews';
import { Button } from '@/ui/button';
import { ArrowDown, FileText, MessageCircle } from 'lucide-react';

export default function QuotePage() {
  const scrollToForm = () => {
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWhatsApp = () => {
    document.getElementById('whatsapp-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900"
    >
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-gray-900 dark:to-black" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-primary rounded-full opacity-20"
              animate={{
                y: [0, -100, 0],
                x: [0, 50, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Get Your{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                3D Printing
              </span>{' '}
              Quote
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Professional 3D printing services for e-commerce, rapid prototyping, and custom manufacturing. 
              Get instant quotes and expert consultation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg"
                onClick={scrollToWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Quote
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={scrollToForm}
                className="text-lg px-8 py-6 glass-card hover:bg-white/80 dark:hover:bg-white/10"
              >
                <FileText className="mr-2 h-5 w-5" />
                Request Quote
              </Button>
            </div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollToForm}
                className="rounded-full"
              >
                <ArrowDown className="h-6 w-6" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Service Categories */}
      <ServiceCategories />

      {/* Material Showcase */}
      <MaterialShowcase />

      {/* WhatsApp Contact Section */}
      <div id="whatsapp-section">
        <WhatsAppContact />
      </div>

      {/* Google Reviews */}
      <GoogleReviews />

      {/* Quote Form */}
      <div id="quote-form">
        <QuoteForm />
      </div>

      <Footer />
    </motion.div>
  );
}