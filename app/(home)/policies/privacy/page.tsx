"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50">
    //   {/* Navigation */}
    //   <Navbar />

      <div className="min-h-screen  flex flex-col items-center px-4  ">
        <Card className="max-w-4xl w-full shadow-lg border border-gray-200">
          <CardContent className="p-6 md:p-10 space-y-10">
            <header className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-500">
                Last updated: 5th October 2025
              </p>
            </header>

            <section className="space-y-4 text-gray-700">
              <p>
                Welcome to <strong>RIXLY.com</strong>, a service operated by{" "}
                <strong>PayShri</strong> (“Company,” “we,” “our,” or “us”). We
                value your privacy and are committed to protecting your personal
                information. This Privacy Policy explains how we collect, use,
                and safeguard your data when you use our website and queue
                management services.
              </p>
            </section>

            <Separator />

            {/* 1. Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold mb-3">
                1. Information We Collect
              </h2>
              <p className="mb-2">
                When you use our Platform, we may collect certain information as
                required to operate, maintain, and improve our services.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>
                  Information you provide during registration or service usage.
                </li>
                <li>
                  Information collected automatically when accessing or
                  interacting with the Platform.
                </li>
                <li>
                  Data shared or generated while using queue, appointment, or
                  communication features.
                </li>
                <li>Information required for payments or legal compliance.</li>
                <li>
                  Other information necessary to enable the Platform’s features
                  and services.
                </li>
              </ul>
            </section>

            <Separator />

            {/* 2. How We Use Your Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3">
                2. How We Use Your Information
              </h2>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>Provide and operate queue and appointment services.</li>
                <li>Manage business and customer accounts.</li>
                <li>Send queue updates and notifications.</li>
                <li>Process payments and issue invoices.</li>
                <li>Improve platform performance and experience.</li>
                <li>Prevent misuse or technical issues.</li>
                <li>Comply with legal and regulatory requirements.</li>
              </ol>
            </section>

            <Separator />

            {/* 3. Data Sharing */}
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Sharing</h2>
              <p className="mb-2">
                We do <strong>not sell or rent</strong> your data. We may share
                information only with:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>
                  <strong>Payment Partners</strong> – to process transactions.
                </li>
                <li>
                  <strong>Communication Providers</strong> – to send
                  notifications.
                </li>
                <li>
                  <strong>Legal Authorities</strong> – when required by law.
                </li>
                <li>
                  <strong>Service Providers</strong> – under confidentiality
                  agreements.
                </li>
              </ul>
            </section>

            <Separator />

            {/* 4. Data Retention */}
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Retention</h2>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>
                  Account data is retained while your account remains active.
                </li>
                <li>
                  Appointment and queue data may be retained for analytics.
                </li>
                <li>You can request deletion by contacting us.</li>
              </ul>
            </section>

            <Separator />

            {/* 5. Cookies & Tracking */}
            <section>
              <h2 className="text-xl font-semibold mb-3">
                5. Cookies & Tracking
              </h2>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Maintain your login session.</li>
                <li>Analyze traffic and improve features.</li>
                <li>Personalize your experience and store preferences.</li>
              </ul>
              <p className="mt-2 text-gray-600">
                You can manage or disable cookies through your browser settings,
                but some features may not function properly.
              </p>
            </section>

            <Separator />

            {/* 6. Data Security */}
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
              <p>
                We use industry-standard encryption and secure access controls
                to protect your data. However, no online system is completely
                secure, and you share data at your own risk.
              </p>
            </section>

            <Separator />

            {/* 8. Children’s Privacy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">
                8. Children’s Privacy
              </h2>
              <p>
                RIXLY is intended for users aged 18 and above. We do not
                knowingly collect data from minors. If a minor’s data has been
                provided, please contact us to remove it.
              </p>
            </section>

            <Separator />

            {/* 9. Changes to This Policy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">
                9. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy periodically. Any updates will
                appear on this page with a new “Last updated” date.
              </p>
            </section>

            <Separator />

            {/* 10. Contact Us */}
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
              <p>
                For privacy concerns or data-related requests, please contact us
                at:
              </p>
              <Link
                href="mailto:support@rixly.com"
                className="text-primary hover:underline"
              >
                support@RIXLY.com
              </Link>
            </section>

            <Separator />

            <footer className="text-center text-sm text-gray-500">
              By using RIXLY, you agree to the terms outlined in this Privacy
              Policy.
              <div className="mt-3">
                <Link href="/terms" className="hover:underline">
                  Terms
                </Link>{" "}
                ·{" "}
                <Link href="/policy/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </div>
              <p className="mt-2">&copy; 2025 RIXLY. All rights reserved.</p>
            </footer>
          </CardContent>
        </Card>
      </div>
  );
}
