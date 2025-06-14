
import { motion } from 'framer-motion';
import { Upload, Settings, Zap, Package } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Design',
    description: 'Upload your STL file or choose from our product catalog',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Settings,
    title: 'Configure Settings',
    description: 'Select material, quality, and finishing options',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Zap,
    title: 'Instant Quote',
    description: 'Get real-time pricing and delivery estimates',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Package,
    title: 'Fast Delivery',
    description: 'Receive your printed parts within 24-48 hours',
    color: 'from-green-500 to-green-600'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From concept to creation in just four simple steps. 
            Our streamlined process makes 3D printing accessible to everyone.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="glass-card p-8 rounded-2xl h-full text-center relative overflow-hidden">
                {/* Background gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Step number */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Connection line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600" />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button 
            onClick={() => window.location.href = '/quote'}
            className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            Start Your Project Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}
