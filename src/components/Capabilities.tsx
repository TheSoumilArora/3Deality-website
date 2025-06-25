
import { motion } from 'framer-motion';
import { Layers, Droplets, Cpu, Package, Sparkles, Factory } from 'lucide-react';

const capabilities = [
  {
    icon: Layers,
    title: 'FDM Printing',
    description: 'High-quality thermoplastic printing for prototypes and functional parts',
    features: ['PLA, ABS, PETG', '0.1-0.3mm layers', 'Large build volume']
  },
  {
    icon: Droplets,
    title: 'SLA Resin',
    description: 'Ultra-precise resin printing for detailed miniatures and jewelry',
    features: ['0.01mm precision', 'Smooth finish', 'Fine details']
  },
  {
    icon: Cpu,
    title: 'TPU Flexible',
    description: 'Flexible and durable prints for gaskets, phone cases, and wearables',
    features: ['Shore A hardness', 'Bendable parts', 'Impact resistant']
  },
  {
    icon: Package,
    title: 'Batch Production',
    description: 'Efficient production runs for multiple identical parts',
    features: ['Volume discounts', 'Consistent quality', 'Fast turnaround']
  },
  {
    icon: Sparkles,
    title: 'Post-Processing',
    description: 'Professional finishing services for production-ready parts',
    features: ['Sanding & polishing', 'Painting & coating', 'Assembly service']
  },
  {
    icon: Factory,
    title: 'Mass Production',
    description: 'Large-scale manufacturing solutions for commercial projects',
    features: ['Industrial capacity', 'Quality assurance', 'Custom materials']
  }
];

export function Capabilities() {
  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Our Capabilities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            State-of-the-art 3D printing technologies and materials to bring any project to life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="glass-card p-8 rounded-2xl h-full relative overflow-hidden transition-all duration-300 group-hover:shadow-2xl">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <capability.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4">{capability.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {capability.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {capability.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-gradient-primary rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
