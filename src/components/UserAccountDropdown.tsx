
import React from 'react';
import { motion } from 'framer-motion';
import { User, LogIn, UserPlus, Heart, Package, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function UserAccountDropdown() {
  const navigate = useNavigate();
  
  // Check if user is on sign-in or create-account pages to simulate logged-in state
  const currentPath = window.location.pathname;
  const isLoggedIn = currentPath === '/my-account' || currentPath === '/my-orders' || currentPath === '/wishlist' || 
                     localStorage.getItem('demo-user-logged-in') === 'true';
  
  const userName = "John Doe";

  const handleLogin = () => {
    navigate('/sign-in');
  };

  const handleRegister = () => {
    navigate('/create-account');
  };

  const handleLogout = () => {
    localStorage.removeItem('demo-user-logged-in');
    navigate('/');
    console.log('User logged out');
  };

  const handleMyAccount = () => {
    localStorage.setItem('demo-user-logged-in', 'true');
    navigate('/my-account');
  };

  const handleWishlist = () => {
    localStorage.setItem('demo-user-logged-in', 'true');
    navigate('/wishlist');
  };

  const handleMyOrders = () => {
    localStorage.setItem('demo-user-logged-in', 'true');
    navigate('/my-orders');
  };

  // Set logged in state when visiting account pages
  React.useEffect(() => {
    if (currentPath === '/my-account' || currentPath === '/my-orders' || currentPath === '/wishlist') {
      localStorage.setItem('demo-user-logged-in', 'true');
    }
  }, [currentPath]);

  if (!isLoggedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogin} className="cursor-pointer">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRegister} className="cursor-pointer">
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9">
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Welcome, {userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleMyAccount} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          My Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleMyOrders} className="cursor-pointer">
          <Package className="mr-2 h-4 w-4" />
          My Orders
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWishlist} className="cursor-pointer">
          <Heart className="mr-2 h-4 w-4" />
          Wishlist
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
