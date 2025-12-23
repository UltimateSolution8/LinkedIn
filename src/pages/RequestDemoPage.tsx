
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { isValidPhoneNumber } from "libphonenumber-js";
import { getCountriesWithDialCodes, type CountryOption } from "@/lib/countries";
import { CheckCircle } from "lucide-react";
import { SearchableCountrySelect } from "@/components/ui/searchable-country-select";

const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

const demoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  countryCode: z.string().min(1, "Country code is required"),
  phone: z
    .string()
    .min(1, "Phone number is required"),
  industry: z.string().optional(),
  otherIndustry: z.string().optional(),
  insights: z.string().optional(),
}).refine(
  (data) => {
    // Combine country code and phone number for validation
    const fullPhoneNumber = `${data.countryCode}${data.phone}`;
    return isValidPhoneNumber(fullPhoneNumber);
  },
  {
    message: "Invalid phone number for the selected country",
    path: ["phone"], // This will show the error on the phone field
  }
);

type DemoFormValues = z.infer<typeof demoSchema>;

const RequestDemoPage = () => {
  const [countries] = useState<CountryOption[]>(() => getCountriesWithDialCodes());
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DemoFormValues>({
    resolver: zodResolver(demoSchema),
  });

  const onSubmit = async (data: DemoFormValues) => {
    try {
      setSubmitError(false);

      // Determine the industry value - use otherIndustry if "other" was selected
      const industryValue = data.industry === "other" && data.otherIndustry
        ? data.otherIndustry
        : data.industry || "";

      // Call the Rixly backend API endpoint
      const response = await fetch(`${RIXLY_API_BASE_URL}/api/demo/request-sheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: `${data.countryCode} ${data.phone}`,
          industry: industryValue,
          additionalInsight: data.insights || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit demo request");
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error submitting demo request:", error);
      setSubmitError(true);
    }
  };

  const handleNewRequest = () => {
    reset();
    setSelectedCountryCode("");
    setSelectedIndustry("");
    setSubmitSuccess(false);
    setSubmitError(false);
  };

  // Success state
  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Thank You!
            </h2>
            <p className="text-gray-600 mb-6">
              Your demo request has been submitted successfully. We&apos;ll get back to you within 24 hours.
            </p>
            <button
              onClick={handleNewRequest}
              className="w-full py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
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
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Request a Demo
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Fill out the form below and we&apos;ll get back to you within 24 hours.
        </p>

        {/* Error Message */}
        {submitError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            There was an error submitting your request. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register("fullName")}
              placeholder="Enter your full name"
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email address"
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <SearchableCountrySelect
                countries={countries}
                value={selectedCountryCode}
                onValueChange={(value) => {
                  const dialCode = value.split('_')[0];
                  setSelectedCountryCode(value);
                  setValue("countryCode", dialCode, { shouldValidate: true });
                }}
                placeholder="Country code"
              />
              <input
                type="tel"
                {...register("phone")}
                placeholder="Enter your phone number"
                className="flex-1 border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {errors.countryCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.countryCode.message}
              </p>
            )}
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry (Optional)
            </label>
            <select
              {...register("industry")}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select your industry</option>
              <option value="technology">Technology & Software</option>
              <option value="retail">Retail & E-commerce</option>
              <option value="hospitality">Hospitality & Tourism</option>
              <option value="healthcare">Healthcare & Medical</option>
              <option value="education">Education & Training</option>
              <option value="finance">Finance & Banking</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="real-estate">Real Estate</option>
              <option value="marketing">Marketing & Advertising</option>
              <option value="consulting">Consulting & Professional Services</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Other Industry - Conditional */}
          {selectedIndustry === "other" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Please specify your industry (Optional)
              </label>
              <input
                type="text"
                {...register("otherIndustry")}
                placeholder="Enter your industry"
                className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Additional Insights */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Insights (Optional)
            </label>
            <textarea
              {...register("insights")}
              placeholder="Tell us about your current challenges, requirements, or any questions..."
              rows={4}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-1/2 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RequestDemoPage;
