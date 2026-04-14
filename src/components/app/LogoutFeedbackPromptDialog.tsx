import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LogoutFeedbackPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShareFeedback: () => void;
  onLogoutDirectly: () => void;
  isProcessing?: boolean;
}

export default function LogoutFeedbackPromptDialog({
  open,
  onOpenChange,
  onShareFeedback,
  onLogoutDirectly,
  isProcessing = false,
}: LogoutFeedbackPromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Before you go</DialogTitle>
          <DialogDescription>
            Would you like to share quick feedback to help us improve Rixly?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onLogoutDirectly}
            disabled={isProcessing}
          >
            No, log out
          </Button>
          <Button
            type="button"
            onClick={onShareFeedback}
            disabled={isProcessing}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Yes, share feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
