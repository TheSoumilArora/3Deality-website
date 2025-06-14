
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, MapPin, User, Mail, Phone, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface PaymentInfo {
  method: 'razorpay' | 'cod';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardHolderName?: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'razorpay'
  });

  const [orderNotes, setOrderNotes] = useState('');

  // Calculate totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 1000 ? 0 : 100; // Free shipping above ₹1000
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shippingCost + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Validate shipping information
    // TODO: Calculate shipping rates using Shiprocket API
    console.log('Shipping Info:', shippingInfo);
    
    setCurrentStep(2);
    toast.success('Shipping information saved!');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentInfo.method === 'razorpay') {
        // TODO: Initialize Razorpay payment
        console.log('Initializing Razorpay payment for amount:', total);
        
        // Example Razorpay integration placeholder:
        /*
        const options = {
          key: 'YOUR_RAZORPAY_KEY',
          amount: total * 100, // Amount in paise
          currency: 'INR',
          name: '3Deality',
          description: '3D Printing Order',
          handler: function(response) {
            handlePaymentSuccess(response);
          },
          prefill: {
            name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            email: shippingInfo.email,
            contact: shippingInfo.phone
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        */
        
        // For now, simulate successful payment
        setTimeout(() => {
          handleOrderSuccess();
        }, 2000);
        
      } else {
        // Cash on Delivery
        handleOrderSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSuccess = () => {
    // TODO: Create order in your backend
    // TODO: Send order confirmation email
    // TODO: Clear cart
    console.log('Order created successfully:', {
      items,
      shippingInfo,
      paymentInfo,
      total,
      orderNotes
    });
    
    clearCart();
    toast.success('Order placed successfully!');
    navigate('/order-confirmation'); // You'll need to create this page
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some items to proceed with checkout</p>
          <Button onClick={() => navigate('/store')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Button>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            <div className={`h-px w-16 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted-foreground'}`} />
            <div className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={shippingInfo.firstName}
                            onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={shippingInfo.lastName}
                            onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Textarea
                          id="address"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={shippingInfo.city}
                            onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            value={shippingInfo.state}
                            onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pincode">Pincode *</Label>
                          <Input
                            id="pincode"
                            value={shippingInfo.pincode}
                            onChange={(e) => setShippingInfo({...shippingInfo, pincode: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={shippingInfo.country}
                            onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        Continue to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Payment Information */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      {/* Payment Method Selection */}
                      <div className="space-y-3">
                        <Label>Select Payment Method</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setPaymentInfo({...paymentInfo, method: 'razorpay'})}
                            className={`p-4 border rounded-lg text-left transition-all ${
                              paymentInfo.method === 'razorpay'
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5" />
                              <div>
                                <div className="font-medium">Card Payment</div>
                                <div className="text-sm text-muted-foreground">Pay securely with Razorpay</div>
                              </div>
                            </div>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setPaymentInfo({...paymentInfo, method: 'cod'})}
                            className={`p-4 border rounded-lg text-left transition-all ${
                              paymentInfo.method === 'cod'
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5" />
                              <div>
                                <div className="font-medium">Cash on Delivery</div>
                                <div className="text-sm text-muted-foreground">Pay when you receive</div>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Card Details (only show for Razorpay) */}
                      {paymentInfo.method === 'razorpay' && (
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                          <h4 className="font-medium">Card Details</h4>
                          <div>
                            <Label htmlFor="cardHolderName">Cardholder Name</Label>
                            <Input
                              id="cardHolderName"
                              value={paymentInfo.cardHolderName || ''}
                              onChange={(e) => setPaymentInfo({...paymentInfo, cardHolderName: e.target.value})}
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              value={paymentInfo.cardNumber || ''}
                              onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input
                                id="expiryDate"
                                value={paymentInfo.expiryDate || ''}
                                onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                                placeholder="MM/YY"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                value={paymentInfo.cvv || ''}
                                onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                                placeholder="123"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Order Notes */}
                      <div>
                        <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                        <Textarea
                          id="orderNotes"
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Any special instructions for your order..."
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1"
                        >
                          Back to Shipping
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                        >
                          {loading ? 'Processing...' : `Place Order - ₹${total}`}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.filename}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.material} • Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (GST 18%)</span>
                      <span>₹{tax}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>

                  {shippingCost === 0 && (
                    <Badge variant="secondary" className="w-full justify-center">
                      Free shipping applied!
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
