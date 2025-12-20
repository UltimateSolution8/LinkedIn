import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center items-center p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
