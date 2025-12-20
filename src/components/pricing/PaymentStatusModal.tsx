
import { useEffect } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "error" | "loading";
  title?: string;
  message?: string;
  onContinue?: () => void;
}

export default function PaymentStatusModal({
  isOpen,
  onClose,
  status,
  title,
  message,
  onContinue,
}: PaymentStatusModalProps) {
  // Auto-close success modal after 3 seconds
  useEffect(() => {
    if (isOpen && status === "success" && !onContinue) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, status, onClose, onContinue]);

  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: (
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          ),
          iconBg: "bg-green-100",
          defaultTitle: "Payment Successful!",
          defaultMessage: "Your subscription is now active. Welcome to Rixly!",
          titleColor: "text-green-700",
        };
      case "error":
        return {
          icon: <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />,
          iconBg: "bg-red-100",
          defaultTitle: "Payment Failed",
          defaultMessage:
            "We couldn't process your payment. Please try again or contact support if the issue persists.",
          titleColor: "text-red-700",
        };
      case "loading":
        return {
          icon: (
            <Loader2 className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
          ),
          iconBg: "bg-purple-100",
          defaultTitle: "Processing Payment",
          defaultMessage: "Please wait while we verify your payment...",
          titleColor: "text-purple-700",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-2xl p-8">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div
              className={`${config.iconBg} rounded-full p-4 w-24 h-24 flex items-center justify-center`}
            >
              {config.icon}
            </div>
          </div>
          <DialogTitle
            className={`text-2xl font-bold ${config.titleColor} mb-2`}
          >
            {title || config.defaultTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base mt-2">
            {message || config.defaultMessage}
          </DialogDescription>
        </DialogHeader>

        {status === "loading" ? (
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 text-purple-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-6">
            {status === "success" && onContinue ? (
              <Button
                onClick={onContinue}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-6 rounded-xl text-base font-semibold"
              >
                Go to Dashboard
              </Button>
            ) : status === "success" ? (
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-6 rounded-xl text-base font-semibold"
              >
                Continue
              </Button>
            ) : (
              <>
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-6 rounded-xl text-base font-semibold"
                >
                  Try Again
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-6 rounded-xl text-base font-medium"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
