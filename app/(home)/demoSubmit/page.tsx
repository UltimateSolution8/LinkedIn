"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { isValidPhoneNumber } from "libphonenumber-js";

const demoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  countryCode: z.string().min(1, "Country code is required"),
  phone: z
    .string()
    .min(1, "Phone number is required"),
  industry: z.string().optional(),
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

const DemoSubmitPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DemoFormValues>({
    resolver: zodResolver(demoSchema),
  });
  
  const onSubmit = (data : DemoFormValues) => {
    const subject = encodeURIComponent("New Demo Request from RIXLY");
    const body = encodeURIComponent(
      `Full Name: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.countryCode} ${data.phone}\nIndustry: ${data.industry || "N/A"}\nAdditional Insights: ${data.insights || "N/A"}`
    )
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = `mailto:rixlyleads@gmail.com?subject=${subject}&body=${body}`;

  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Request a Demo
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Fill out the form below and we&apos;ll get back to you within 24 hours.
        </p>

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
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="flex gap-2">
              <select
                {...register("countryCode")}
                className="w-32 border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Code</option>
                <option value="+1">+1 (US/CA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+91">+91 (IN)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+81">+81 (JP)</option>
                <option value="+86">+86 (CN)</option>
                <option value="+49">+49 (DE)</option>
                <option value="+33">+33 (FR)</option>
                <option value="+39">+39 (IT)</option>
                <option value="+34">+34 (ES)</option>
                <option value="+7">+7 (RU)</option>
                <option value="+55">+55 (BR)</option>
                <option value="+27">+27 (ZA)</option>
                <option value="+52">+52 (MX)</option>
                <option value="+82">+82 (KR)</option>
                <option value="+65">+65 (SG)</option>
                <option value="+971">+971 (AE)</option>
              </select>
              <input
                type="tel"
                {...register("phone")}
                placeholder="Enter your phone number"
                className="flex-1 border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your industry</option>
              <option value="retail">Retail</option>
              <option value="hospitality">Hospitality</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Additional Insights */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Insights (Optional)
            </label>
            <textarea
              {...register("insights")}
              placeholder="Tell us about your current challenges, requirements, or any questions..."
              rows={4}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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

export default DemoSubmitPage;
