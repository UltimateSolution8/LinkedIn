import Link from 'next/link'
import { Button } from './ui/button'
import Logo from './common/Logo'

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
            {/* <a href="#dashboard" className="text-gray-600 hover:text-gray-900 transition">Dashboard</a> */}
            <Link href={`/request-demo`}>
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                Request Demo
              </Button></Link>
            <Link href={`/request-demo`}>
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar