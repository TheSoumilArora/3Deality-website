
import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Edit } from 'lucide-react';

export default function MyAccount() {
  // Mock user data - replace with actual user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345"
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
            My Account
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Profile Information</h2>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{userData.name}</p>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{userData.email}</p>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{userData.phone}</p>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{userData.address}</p>
                  <p className="text-sm text-muted-foreground">Address</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 rounded-xl"
          >
            <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/my-orders'}
              >
                View My Orders
              </Button>
              
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/wishlist'}
              >
                View Wishlist
              </Button>
              
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/quote'}
              >
                Get New Quote
              </Button>
              
              <Button 
                className="w-full justify-start" 
                variant="outline"
              >
                Change Password
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
