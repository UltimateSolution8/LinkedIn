"use client";

import React, { ReactNode } from "react";
import type { FC } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-white to-purple-50">
      {/* Header */}
      <Navbar/>

      {/* Main Content */}
      <main className="flex-1 py-28 w-full mx-auto">
        {children}
      </main>

      {/* Footer */}
    <Footer/>
    </div>
  );
};

export default Layout;
