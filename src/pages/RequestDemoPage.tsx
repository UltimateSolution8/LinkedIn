import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import RequestDemoForm from "@/components/shared/RequestDemoForm";

const RequestDemoPage = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSuccess = () => {
    setSubmitSuccess(true);
  };

  const handleNewRequest = () => {
    setSubmitSuccess(false);
  };

  // Success state
  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-card shadow-xl rounded-2xl p-8 border border-border"
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Thank You!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your demo request has been submitted successfully. We&apos;ll get back to you within 24 hours.
            </p>
            <button
              onClick={handleNewRequest}
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90"
            >
              Submit Another Request
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card shadow-xl rounded-2xl p-6 sm:p-8 border border-border"
      >
        <h2 className="text-2xl font-semibold text-foreground mb-1">
          Request a Demo
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Fill out the form below and we&apos;ll get back to you within 24 hours.
        </p>

        <RequestDemoForm
          onSuccess={handleSuccess}
          showCancelButton={false}
        />
      </motion.div>
    </div>
  );
};

export default RequestDemoPage;
