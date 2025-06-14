
import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, MapPin } from 'lucide-react';

export default function MyOrders() {
  // Mock orders data - replace with actual orders from API
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 2450,
      items: [
        { name: "Custom Miniature.stl", material: "PLA", quantity: 1 },
        { name: "Prototype Part.stl", material: "PETG", quantity: 2 }
      ]
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "Processing",
      total: 1800,
      items: [
        { name: "Design Model.stl", material: "ABS", quantity: 1 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500';
      case 'Processing':
        return 'bg-blue-500';
      case 'Shipped':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            My Orders
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your 3D printing orders
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Order {order.id}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {order.status}
                  </Badge>
                  <p className="text-2xl font-bold text-primary mt-2">₹{order.total}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Items:</h4>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{item.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.material} × {item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
              <p className="text-muted-foreground mb-8">Start by getting a quote for your 3D print</p>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
