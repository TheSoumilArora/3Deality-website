'use client'
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { ShoppingCart, Wrench, Lightbulb } from 'lucide-react';

const services = [
  {
    icon: ShoppingCart,
    title: "E-commerce Products",
    description: "Ready-to-ship 3D printed products for online stores and retail businesses.",
    features: [
      "Bulk order discounts",
      "Quality assurance",
      "Fast turnaround",
      "Custom packaging"
    ],
    color: "text-blue-500"
  },
  {
    icon: Wrench,
    title: "Rapid Prototyping",
    description: "Quick iterations and testing for product development and design validation.",
    features: [
      "24-48 hour delivery",
      "Multiple material options",
      "Design consultation",
      "Iterative improvements"
    ],
    color: "text-green-500"
  },
  {
    icon: Lightbulb,
    title: "Custom Orders",
    description: "Bespoke 3D printing solutions tailored to your specific requirements.",
    features: [
      "Design from scratch",
      "Technical specifications",
      "Material selection",
      "Post-processing options"
    ],
    color: "text-purple-500"
  }
];

export default function ServiceCategories() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We specialize in three core areas to meet all your 3D printing needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    <service.icon className={`w-12 h-12 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}