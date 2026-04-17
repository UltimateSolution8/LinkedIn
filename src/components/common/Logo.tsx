
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Logo() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
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
      <img src="/logo.png" alt="Rixly Logo" className="w-8 logo-shaded" />
      <span className="text-xl font-bold text-gray-900 dark:text-white">RIXLY</span>
    </div>
  );
}
