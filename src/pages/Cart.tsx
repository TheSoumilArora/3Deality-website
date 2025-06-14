
import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart } from 'lucide-react';

export default function Cart() {
  const { items, removeFromCart, clearCart } = useCart();

  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

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
            Shopping Cart
          </h1>
          <p className="text-xl text-muted-foreground">
            Review your 3D printing orders before checkout
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some items to get started</p>
            <Button 
              onClick={() => window.location.href = '/store'}
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
            >
              Browse Products
            </Button>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4 mb-8">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{item.filename}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Material: {item.material}</p>
                        <p>Infill: {item.infill}%</p>
                        <p>Layer Height: {item.layerHeight}mm</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹{item.price * item.quantity}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-3xl font-bold text-primary">₹{totalPrice}</span>
              </div>
              
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1"
                >
                  Clear Cart
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
                  onClick={() => window.location.href = '/checkout'}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
