
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/api/auth";
import { Sparkles } from "lucide-react";

export default function Logo() {
  const navigate = useNavigate();

  const handleClick = () => {
    const user = getCurrentUser();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center group-hover:opacity-90 transition-opacity">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white">RIXLY</span>
    </div>
  );
}
