
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Clock, FileText, Zap } from 'lucide-react';

const whatsappFeatures = [
  {
    icon: MessageCircle,
    title: "Instant Communication",
    description: "Get immediate responses to your queries"
  },
  {
    icon: FileText,
    title: "File Sharing",
    description: "Share your 3D files directly for quick quotes"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Available round the clock for your convenience"
  },
  {
    icon: Zap,
    title: "Quick Quotes",
    description: "Get pricing estimates within minutes"
  }
];

export default function WhatsAppContact() {
  const handleWhatsAppClick = () => {
    const message = "Hi! I'm interested in getting a quote for 3D printing services. Can you help me?";
    const phoneNumber = "918847559327";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Your Quote on WhatsApp
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Share your 3D files and requirements directly on WhatsApp for the fastest quote response. 
              No forms to fill, no waiting around - just instant communication.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <span>Click the WhatsApp button below</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <span>Share your 3D files (STL, OBJ, 3MF)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <span>Tell us your requirements and quantity</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                <span>Get your instant quote and timeline</span>
              </div>
            </div>

            <Button 
              onClick={handleWhatsAppClick}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6"
            >
              <MessageCircle className="mr-2 h-6 w-6" />
              Chat on WhatsApp
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {whatsappFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <feature.icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
