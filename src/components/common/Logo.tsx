
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/api/auth";

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
      <img src="/logo.png" alt="Rixly Logo" className="w-8 logo-theme-tint" />
      <span className="text-xl font-bold text-gray-900 dark:text-white">RIXLY</span>
    </div>
  );
}
