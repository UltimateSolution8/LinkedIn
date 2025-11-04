import Link from 'next/link'
import { Button } from './ui/button'
import { Sparkles } from 'lucide-react'

const Navbar = () => {
  return (
     <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RIXLY</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
              {/* <a href="#dashboard" className="text-gray-600 hover:text-gray-900 transition">Dashboard</a> */}
              <Link href={`/demoSubmit`}>
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                Request Demo
              </Button></Link>
            
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
  )
}

export default Navbar