import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DashboardTourPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTakeTour: () => void;
  onNotNow: () => void;
  onDontShowAgain: () => void;
}

export default function DashboardTourPromptDialog({
  open,
  onOpenChange,
  onTakeTour,
  onNotNow,
  onDontShowAgain,
}: DashboardTourPromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick dashboard tour</DialogTitle>
          <DialogDescription>
            See a short walkthrough of Dashboard, Leads, Opportunities, and Settings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onDontShowAgain}>
            Don&apos;t show again
          </Button>
          <Button variant="ghost" onClick={onNotNow}>
            Not now
          </Button>
          <Button onClick={onTakeTour} className="bg-primary hover:bg-primary/90 text-white">
            Take a site tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
