
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCurrentUser, type User } from "@/lib/api/auth";
import { SubscriptionStatus, cancelSubscription } from "@/lib/api/subscription";
import { getSubscriptionStatusCached } from "@/lib/utils/subscription";
import ChangePasswordDialog from "@/components/profile/ChangePasswordDialog";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [initialFirstName, setInitialFirstName] = useState("");
  const [initialLastName, setInitialLastName] = useState("");
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionStatus | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

  // Load user data and subscription details
  useEffect(() => {
    const loadUserData = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setFirstName(currentUser.firstName || "");
        setLastName(currentUser.lastName || "");
        setEmail(currentUser.email || "");
        setInitialFirstName(currentUser.firstName || "");
        setInitialLastName(currentUser.lastName || "");
      }
    };

    const loadSubscriptionDetails = async () => {
      setIsLoadingSubscription(true);
      setSubscriptionDetails(null);

      try {
        const details = await getSubscriptionStatusCached();
        setSubscriptionDetails(details);
      } catch (error) {
        console.error("Error loading subscription details:", error);
        setSubscriptionDetails(null);
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    // Initial load
    loadUserData();
    loadSubscriptionDetails();

    // Listen for storage changes (cross-tab and same-tab login/logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "accessToken" || e.key === null) {
        // User changed - reload everything
        loadUserData();
        loadSubscriptionDetails();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Only run once on mount, storage listener handles updates

  // Check if form has been modified and is valid
  const isFormModified = () => {
    return (
      (firstName !== initialFirstName || lastName !== initialLastName) &&
      firstName.trim() !== "" &&
      lastName.trim() !== ""
    );
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving profile:", { firstName, lastName });
  };

  const handleResetPassword = () => {
    setShowChangePasswordDialog(true);
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    setShowCancelDialog(false);

    try {
      await cancelSubscription(subscriptionDetails?.subscription?.id || "");
      // Reload subscription details
      const details = await getSubscriptionStatusCached(true);
      setSubscriptionDetails(details);
      alert("Subscription cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert(error instanceof Error ? error.message : "Failed to cancel subscription");
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDateRegistered = () => {
    if (!user?.createdAt) return "N/A";
    return formatDate(user.createdAt);
  };

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6 md:p-8">
      <div className="flex flex-col max-w-4xl mx-auto flex-1 w-full">
        {/* Page Header */}
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-neutral-950 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Profile Settings
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-base font-normal leading-normal">
              Manage your profile information and security settings.
            </p>
          </div>
        </div>

        {/* Profile Form Card */}
        <div className="bg-white dark:bg-neutral-950 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 mt-8">
          <div className="p-6 sm:p-8">
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              {/* Profile Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                <div className="relative shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-teal-600 text-white text-3xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col justify-center text-center sm:text-left">
                  <p className="text-neutral-950 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
                    Your Profile
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-base font-normal leading-normal mt-1">
                    Update your photo and personal details.
                  </p>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName" className="text-neutral-950 dark:text-white">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus-visible:ring-teal-600/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName" className="text-neutral-950 dark:text-white">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus-visible:ring-teal-600/50"
                  />
                </div>
              </div>

              {/* Email Field (Read-only) */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-neutral-950 dark:text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  readOnly
                  className="border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                />
              </div>

              {/* Date Registered */}
              <div className="flex flex-col gap-2">
                <Label className="text-neutral-950 dark:text-white">
                  Date Registered
                </Label>
                <Input
                  type="text"
                  value={getDateRegistered()}
                  disabled
                  readOnly
                  className="border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                />
              </div>

              {/* Subscription Section */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 mt-2">
                <h3 className="text-neutral-950 dark:text-white text-lg font-bold mb-4">Subscription</h3>
                {isLoadingSubscription ? (
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">Loading subscription details...</p>
                ) : subscriptionDetails ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-neutral-950 dark:text-white">Current Subscription Status</Label>
                      <div className="flex items-center gap-2">
                        {subscriptionDetails.canBypass ? (
                          <Badge className="bg-green-600 text-white">Whitelisted</Badge>
                        ) : subscriptionDetails.subscription?.status === "created" ? (
                          <Badge className="bg-yellow-600 text-white">Pending Verification</Badge>
                        ) : subscriptionDetails.subscription ? (
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        ) : (
                          <Badge className="bg-red-600 text-white">Inactive</Badge>
                        )}
                      </div>
                    </div>

                    {subscriptionDetails.subscription?.status === "created" ? (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-6">
                        <div className="flex items-start gap-3">
                          <svg
                            className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div className="flex-1">
                            <h4 className="text-blue-900 dark:text-blue-100 font-semibold mb-2">
                              Payment Verification in Progress
                            </h4>
                            <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                              Your payment is currently being verified by our payment processor. This typically takes a few minutes but may take up to 24 hours in some cases.
                            </p>
                            <p className="text-blue-700 dark:text-blue-300 text-sm">
                              Please check back shortly. If the verification takes longer than expected, feel free to contact our support team.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : subscriptionDetails.subscription ? (
                      <>
                        <div className="flex flex-col gap-2">
                          <Label className="text-neutral-950 dark:text-white">Plan Name</Label>
                          <Input
                            type="text"
                            value={subscriptionDetails.subscription.planDetails.name}
                            disabled
                            readOnly
                            className="border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label className="text-neutral-950 dark:text-white">Billing Cycle / Expiration Date</Label>
                          <Input
                            type="text"
                            value={
                              subscriptionDetails.subscription.currentPeriodEnd
                                ? `Next Billing on ${formatDate(subscriptionDetails.subscription.currentPeriodEnd)}`
                                : "No expiration date"
                            }
                            disabled
                            readOnly
                            className="border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label className="text-neutral-950 dark:text-white">Amount</Label>
                          <Input
                            type="text"
                            value={`${subscriptionDetails.subscription.planDetails.currency === "USD" ? "$" : "₹"}${subscriptionDetails.subscription.planDetails.amount}`}
                            disabled
                            readOnly
                            className="border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                          />
                        </div>

                        {subscriptionDetails.subscription.cancelAtPeriodEnd ? <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCancelDialog(true)}
                          disabled={isCancelling}
                          className="mt-2 border-blue-600/30 text-black dark:text-red-400 hover:bg-blue-600/10 disabled:opacity-50"
                        >
                          {isCancelling ? "Cancelling..." : "Reactivate Subscription"}
                        </Button> : <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCancelDialog(true)}
                          disabled={isCancelling}
                          className="mt-2 border-red-600/30 text-red-600 dark:text-red-400 hover:bg-red-600/10 disabled:opacity-50"
                        >
                          {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                        </Button>}
                      </>
                    ) : null}

                    {!subscriptionDetails.subscription && !subscriptionDetails.canBypass && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                          You don't have an active subscription.{" "}
                          <a href="/pricing" className="underline font-semibold">
                            Subscribe now
                          </a>{" "}
                          to access premium features.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">Unable to load subscription details.</p>
                )}
              </div>

              {/* Security Section */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 mt-2">
                <h3 className="text-neutral-950 dark:text-white text-lg font-bold">Security</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                  Manage your password to keep your account secure.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetPassword}
                  className="mt-4 border-teal-600/30 text-teal-600 dark:text-teal-400 hover:bg-teal-600/10"
                >
                  Reset Password
                </Button>
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-b-xl">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="min-w-[84px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormModified()}
              className="min-w-[84px] bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
      />

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-neutral-700 dark:text-neutral-300 text-sm">
              Your subscription will be cancelled, but you will retain access to all premium features until the end of your current billing cycle
              {subscriptionDetails?.subscription?.expiresAt && (
                <span className="font-semibold">
                  {" "}({formatDate(subscriptionDetails.subscription.expiresAt)})
                </span>
              )}.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isCancelling}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isCancelling ? "Cancelling..." : "Cancel Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
