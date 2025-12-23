import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import RequestDemoForm from "./RequestDemoForm";

interface RequestDemoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestDemoDialog({ isOpen, onClose }: RequestDemoDialogProps) {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSuccess = () => {
    setSubmitSuccess(true);
  };

  const handleClose = () => {
    setSubmitSuccess(false);
    onClose();
  };

  // Success state
  if (submitSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Thank You!</DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <p className="text-gray-600 mb-6">
              Your demo request has been submitted successfully. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
            >
              Close
            </button>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Demo</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <RequestDemoForm
          onSuccess={handleSuccess}
          onCancel={handleClose}
          showCancelButton={true}
        />
      </DialogContent>
    </Dialog>
  );
}