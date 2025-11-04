"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen  flex flex-col items-center px-4 py-10 md:py-16">
      <Card className="max-w-4xl w-full shadow-lg border border-gray-200">
        <CardContent className="p-6 md:p-10 space-y-10">
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
            <p className="text-sm text-gray-500">Last updated: 5th October 2025</p>
          </header>

          <section className="space-y-4 text-gray-700">
            <p>
              Welcome to <strong>RIXLY.com</strong>, a service operated by <strong>PayShri</strong> (“Company,” “we,” “our,” or “us”).
              These Terms and Conditions (“Terms”) govern your access to and use of our website and queue management services.
              By using the Platform, you (“User,” “you,” “your”) agree to these Terms. If you do not agree, please do not use the Service.
            </p>
          </section>

          <Separator />

          {/* 1. Use of the Service */}
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Use of the Service</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>You agree to provide accurate and complete information when creating or using an account.</li>
              <li>You may not misuse the Platform or attempt unauthorized access.</li>
              <li>We reserve the right to suspend or terminate your access for violations.</li>
            </ol>
          </section>

          <Separator />

          {/* 2. Payments & Subscriptions */}
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Payments & Subscriptions</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Businesses must maintain an active subscription to access queue and appointment features.</li>
              <li>All fees are billed per plan and are <strong>non-refundable</strong> except as required by law.</li>
              <li>Plans renew automatically unless canceled before renewal.</li>
              <li>Some features may be free unless specified otherwise.</li>
            </ol>
          </section>

          <Separator />

          {/* 3. Platform Services */}
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Platform Services</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>RIXLY enables businesses (“Subscribers”) to manage queues and communicate with customers.</li>
              <li>Customers can use the Platform to join queues or receive notifications.</li>
              <li>RIXLY acts solely as a software provider and is not liable for business operations.</li>
              <li>Queue times and estimates may vary based on real-time factors.</li>
            </ol>
          </section>

          <Separator />

          {/* 4. Business Responsibilities */}
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Business Responsibilities</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Businesses are responsible for managing their queues and communication.</li>
              <li>They must comply with applicable laws and data protection regulations.</li>
              <li>RIXLY is not liable for disputes or delays caused by businesses.</li>
            </ol>
          </section>

          <Separator />

          {/* 5. Customer Responsibilities */}
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Customer Responsibilities</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Customers must provide accurate booking information.</li>
              <li>They should arrive on time or cancel if unable to attend.</li>
              <li>Repeated misuse may result in account suspension.</li>
            </ol>
          </section>

          <Separator />

          {/* 6. Data & Privacy */}
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data & Privacy</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>RIXLY collects limited personal data to operate its services.</li>
              <li>Data is processed according to our <Link href="/policy/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</li>
              <li>We use standard security but cannot guarantee absolute protection.</li>
            </ol>
          </section>

          <Separator />

          {/* 7. Notifications & Communication */}
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Notifications & Communication</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>By using RIXLY, you consent to receive essential notifications via SMS or email.</li>
              <li>You can opt out of promotional messages but not important service alerts.</li>
            </ol>
          </section>

          <Separator />

          {/* 8. Platform Availability */}
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Platform Availability</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>We strive for high uptime but do not guarantee uninterrupted service.</li>
              <li>Planned maintenance or outages will be communicated where possible.</li>
              <li>We are not responsible for downtime due to external events.</li>
            </ul>
          </section>

          <Separator />

          {/* 9. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>RIXLY is not liable for loss or damages arising from platform use.</li>
              <li>Our total liability will not exceed the amount paid in the last <strong>one (1) month</strong>.</li>
            </ul>
          </section>

          <Separator />

          {/* 10. Termination */}
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Termination</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>We may suspend or terminate accounts that violate these Terms.</li>
              <li>Users may stop using the Platform at any time.</li>
              <li>Inactive accounts may be deleted after long inactivity.</li>
            </ul>
          </section>

          <Separator />

          {/* 11. Governing Law */}
          <section>
            <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of <strong>India</strong>.  
              Disputes will be subject to the jurisdiction of the courts in <strong>Jaipur, Rajasthan</strong>.
            </p>
          </section>

          <Separator />

          {/* 12. Changes to Terms */}
          <section>
            <h2 className="text-xl font-semibold mb-3">12. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use after updates means acceptance of revised Terms.
            </p>
          </section>

          <Separator />

          {/* 13. Contact Us */}
          <section>
            <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
            <p>If you have any questions, please contact us at:</p>
            <Link href="mailto:support@rixly.com" className="text-primary hover:underline">
              support@RIXLY.com
            </Link>
          </section>

          <Separator />

          <footer className="text-center text-sm text-gray-500">
            By using our service, you agree to these Terms and Conditions.
            <div className="mt-3">
              <Link href="/terms" className="hover:underline">Terms</Link> ·{" "}
              <Link href="/policy/privacy" className="hover:underline">Privacy Policy</Link>
            </div>
            <p className="mt-2">&copy; 2025 RIXLY. All rights reserved.</p>
          </footer>
        </CardContent>
      </Card>
    </div>
  )
}
