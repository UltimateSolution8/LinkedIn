
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import Logo from './common/Logo'
import UserProfileDropdown from './shared/UserProfileDropdown'
import { getCurrentUser } from '@/lib/api/auth'
import type { User } from '@/lib/api/auth'
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "accessToken" || e.key === null) {
        setUser(getCurrentUser());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      setUser(getCurrentUser());
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []); // Empty dependency array - only run once on mount

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</Link>
            <Link to="/contactus" className="text-gray-600 hover:text-gray-900 transition">Contact Us</Link>
            {/* <a href="#dashboard" className="text-gray-600 hover:text-gray-900 transition">Dashboard</a> */}
            <Link to={`/request-demo`}>
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                Request Demo
              </Button>
            </Link>
            {user ? (
              <UserProfileDropdown />
            ) : (
              <Link to={`/request-demo`}>
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Features</a>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Pricing</Link>
            <Link to="/contactus" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Contact Us</Link>
            <Link to={`/request-demo`}>
              <Button variant="outline" className="w-full mt-2 border-purple-600 text-purple-600 hover:bg-purple-50">
                Request Demo
              </Button>
            </Link>
            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <UserProfileDropdown />
              </div>
            ) : (
              <Link to={`/request-demo`}>
                <Button className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar