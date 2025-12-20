
interface AuthToggleProps {
  activeTab: "login" | "signup";
  onTabChange: (tab: "login" | "signup") => void;
}

export default function AuthToggle({ activeTab, onTabChange }: AuthToggleProps) {
  return (
    <div className="flex py-3">
      <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10 p-1">
        <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-white has-[:checked]:dark:bg-purple-600/50 has-[:checked]:shadow-[0_1px_3px_rgba(0,0,0,0.1)] has-[:checked]:text-neutral-950 has-[:checked]:dark:text-white text-neutral-500 dark:text-white/60 text-sm font-medium leading-normal transition-colors">
          <span className="truncate">Login</span>
          <input
            checked={activeTab === "login"}
            className="invisible w-0"
            name="auth-toggle"
            type="radio"
            value="login"
            onChange={() => onTabChange("login")}
          />
        </label>
        <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-white has-[:checked]:dark:bg-purple-600/50 has-[:checked]:shadow-[0_1px_3px_rgba(0,0,0,0.1)] has-[:checked]:text-neutral-950 has-[:checked]:dark:text-white text-neutral-500 dark:text-white/60 text-sm font-medium leading-normal transition-colors">
          <span className="truncate">Sign Up</span>
          <input
            checked={activeTab === "signup"}
            className="invisible w-0"
            name="auth-toggle"
            type="radio"
            value="signup"
            onChange={() => onTabChange("signup")}
          />
        </label>
      </div>
    </div>
  );
}
