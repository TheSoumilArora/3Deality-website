'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/hooks/useCart';

export function CartIcon() {
  const { theme } = useTheme();
  const { cartCount } = useCart();

  const handleCartClick = () => {
    window.location.href = '/cart';
  };

  return (
    <button 
      onClick={handleCartClick}
      className="relative p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
    >
      <ShoppingCart 
        className={`w-5 h-5 ${
          theme === 'dark' ? 'stroke-white' : 'stroke-[#111827]'
        }`}
        strokeWidth={2}
      />
      
      {cartCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-medium text-white flex items-center justify-center ${
            theme === 'dark' ? 'bg-[#FF6B00]' : 'bg-[#4A6CF7]'
          }`}
        >
          {cartCount}
        </motion.div>
      )}
    </button>
  );
}