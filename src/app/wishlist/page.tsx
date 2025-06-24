import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/ui/button';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

export default function Wishlist() {
  // Mock wishlist data - replace with actual wishlist from API
  const wishlistItems = [
    {
      id: "1",
      name: "Custom Phone Case.stl",
      material: "TPU",
      estimatedPrice: 450,
      dateAdded: "2024-01-10"
    },
    {
      id: "2", 
      name: "Desk Organizer.stl",
      material: "PLA",
      estimatedPrice: 850,
      dateAdded: "2024-01-08"
    }
  ];

  const removeFromWishlist = (id: string) => {
    // Placeholder for remove from wishlist functionality
    console.log('Remove from wishlist:', id);
  };

  const addToCart = (item: any) => {
    // Placeholder for add to cart functionality
    console.log('Add to cart:', item);
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
            My Wishlist
          </h1>
          <p className="text-xl text-muted-foreground">
            Save your favorite 3D prints for later
          </p>
        </motion.div>

        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Add items to your wishlist to save them for later</p>
            <Button 
              onClick={() => window.location.href = '/quote'}
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
            >
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Preferred Material: {item.material}</p>
                      <p>Added: {new Date(item.dateAdded).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary mb-4">₹{item.estimatedPrice}</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        className="bg-gradient-to-r from-primary to-primary/80"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}