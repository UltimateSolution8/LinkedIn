import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
    >
      <Bell className="w-5 h-5" />
    </Button>
  );
}
