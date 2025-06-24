'use client'
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';

const materials = [
  {
    name: "PLA",
    description: "Perfect for beginners and general use. Biodegradable, easy to print, and available in many colors.",
    features: ["Easy to print", "Biodegradable", "Low warping", "Great for prototypes"],
    applications: ["Prototypes", "Decorative items", "Educational models", "General use"],
    color: "bg-green-500"
  },
  {
    name: "ABS",
    description: "Strong and durable plastic ideal for functional parts that need to withstand stress and heat.",
    features: ["High strength", "Heat resistant", "Chemical resistant", "Post-processable"],
    applications: ["Automotive parts", "Electronic housings", "Tools", "Functional prototypes"],
    color: "bg-blue-500"
  },
  {
    name: "PETG",
    description: "Combines the ease of PLA with the strength of ABS. Crystal clear and food-safe options available.",
    features: ["Chemical resistant", "Crystal clear", "Food safe", "Strong and flexible"],
    applications: ["Food containers", "Medical devices", "Transparent parts", "Chemical storage"],
    color: "bg-purple-500"
  },
  {
    name: "TPU",
    description: "Flexible rubber-like material perfect for gaskets, phone cases, and wearable items.",
    features: ["Flexible", "Durable", "Wear resistant", "Shock absorbing"],
    applications: ["Phone cases", "Gaskets", "Wearables", "Flexible hinges"],
    color: "bg-orange-500"
  },
  {
    name: "Carbon Fiber",
    description: "High-strength composite material with excellent stiffness-to-weight ratio for aerospace applications.",
    features: ["Ultra lightweight", "High strength", "Low thermal expansion", "Conductive"],
    applications: ["Aerospace parts", "Racing components", "Drones", "High-performance tools"],
    color: "bg-gray-800"
  },
  {
    name: "Nylon",
    description: "Industrial-grade material with excellent mechanical properties for demanding applications.",
    features: ["High durability", "Chemical resistant", "Low friction", "High temperature"],
    applications: ["Gears", "Bearings", "Industrial parts", "Automotive components"],
    color: "bg-indigo-500"
  }
];

export default function MaterialShowcase() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Premium 3D Printing Materials
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We offer a comprehensive range of high-quality materials for all your 3D printing needs. 
            From prototyping to production, we have the right material for your project.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material, index) => (
            <motion.div
              key={material.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded-full ${material.color}`} />
                    <CardTitle className="text-xl">{material.name}</CardTitle>
                  </div>
                  <p className="text-muted-foreground">{material.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {material.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Applications:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {material.applications.map((app) => (
                        <li key={app} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {app}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}