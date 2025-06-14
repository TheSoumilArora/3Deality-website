
import { motion } from 'framer-motion';
import { CheckCircle, Package, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OrderConfirmation() {
  const navigate = useNavigate();

  // Mock order data - this would come from your order context or API
  const orderData = {
    orderNumber: '43801',
    status: 'Processing',
    date: 'June 13, 2025',
    email: 'customer@example.com',
    total: 348.00,
    paymentMethod: 'Credit Card/Debit Card/NetBanking',
    items: [
      { filename: 'Custom Model 1.stl', material: 'PLA', quantity: 2, price: 150 },
      { filename: 'Prototype Part.stl', material: 'ABS', quantity: 1, price: 198 }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center text-muted-foreground">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-muted-foreground">
                1
              </div>
              <span className="ml-2 font-medium">Shopping Cart</span>
            </div>
            <div className="h-px w-16 bg-muted-foreground" />
            <div className="flex items-center text-muted-foreground">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-muted-foreground">
                2
              </div>
              <span className="ml-2 font-medium">Checkout</span>
            </div>
            <div className="h-px w-16 bg-primary" />
            <div className="flex items-center text-primary">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-primary bg-primary text-primary-foreground">
                3
              </div>
              <span className="ml-2 font-medium">Order Complete</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">THANK YOU!</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thank you for shopping with us. Your account has been charged and your transaction is successful. 
              We will be processing your order soon.
            </p>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Order Number:</div>
                    <div className="font-bold text-lg">{orderData.orderNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status:</div>
                    <Badge variant="secondary">{orderData.status}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Date:</div>
                    <div className="font-medium">{orderData.date}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total:</div>
                    <div className="font-bold text-lg text-primary">₹{orderData.total}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Email:</div>
                  <div className="font-medium">{orderData.email}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Payment Method:</div>
                  <div className="font-medium">{orderData.paymentMethod}</div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Order Confirmation</div>
                    <div className="text-sm text-muted-foreground">
                      You'll receive an email confirmation shortly
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Processing</div>
                    <div className="text-sm text-muted-foreground">
                      We'll start printing your items within 24 hours
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Updates</div>
                    <div className="text-sm text-muted-foreground">
                      We'll keep you updated via email and SMS
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      Expected delivery in 3-5 business days
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.filename}</div>
                        <div className="text-sm text-muted-foreground">
                          Material: {item.material} • Quantity: {item.quantity}
                        </div>
                      </div>
                      <div className="font-bold">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <Button
              onClick={() => navigate('/my-orders')}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              Track Your Orders
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/store')}
            >
              Continue Shopping
            </Button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
