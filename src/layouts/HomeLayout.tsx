import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function HomeLayout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-white to-purple-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 py-28 w-full mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
