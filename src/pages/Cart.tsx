/* src/pages/Cart.tsx */
import React from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useCart } from "@/hooks/useCart"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart } from "lucide-react"

export default function Cart() {
  const { items, cart, removeLine, clearCart } = useCart()

  const cartTotal =
    cart?.total ??
    items.reduce((sum, li) => sum + (li.total || li.unit_price * li.quantity), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        {/* Header */}
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
            Review your 3D printing items before checkout
          </p>
        </motion.div>

        {/* Empty cart */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Add some items to get started
            </p>
            <Button
              onClick={() => (window.location.href = "/store")}
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
            >
              Browse Products
            </Button>
          </motion.div>
        ) : (
          /* ---------------- Items + summary ---------------- */
          <div className="max-w-4xl mx-auto">
            {/* Line-items */}
            <div className="space-y-4 mb-8">
              {items.map((li, idx) => (
                <motion.div
                  key={li.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <div className="flex justify-between items-start">
                    {/* Left - info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {li.title}
                      </h3>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Quantity: {li.quantity}</p>
                      </div>
                    </div>

                    {/* Right - price & delete */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ₹
                        {(li.total).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLine(li.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary / actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-3xl font-bold text-primary">
                  ₹
                  {cartTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="h-12"
                >
                  Clear Cart
                </Button>

                <Button
                  className="h-12 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
                  onClick={() => (window.location.href = "/checkout")}
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
  )
}