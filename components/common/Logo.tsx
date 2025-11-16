"use client";

import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api/auth";
import { Sparkles } from "lucide-react";

export default function Logo() {
  const router = useRouter();

  const handleClick = () => {
    const user = getCurrentUser();
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
            <div
              className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => router.push("/dashboard")}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RIXLY</span>
          </div>
  );
}
