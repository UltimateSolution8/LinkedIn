
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            We'd love to hear from you. Reach out to us anytime.
          </p>
        </div>

        {/* Contact Information Card */}
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-8 space-y-8">
            {/* Merchant Legal Entity */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Merchant Legal entity name:
              </p>
              <p className="text-gray-900">
                BEYONDERS GENZ VENTURES PRIVATE LIMITED
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Email
                </h3>
                <a
                  href="mailto:admin@userixly.com"
                  className="text-gray-600 hover:text-purple-600 transition"
                >
                  admin@userixly.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Telephone
                </h3>
                <a
                  href="tel:8249467209"
                  className="text-gray-600 hover:text-purple-600 transition"
                >
                  8249467209
                </a>
              </div>
            </div>

            {/* Registered Address */}
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Registered Address
                </h3>
                <p className="text-gray-600">
                  Plot NO- 321/2487, BJB College Cooperative Society
                  <br />
                  Azad Nagar, Bhubaneswar
                  <br />
                  Khorda, Odisha 751002
                </p>
              </div>
            </div>

            {/* Operational Address */}
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Operational Address
                </h3>
                <p className="text-gray-600">
                  Plot NO- 321/2487, BJB College Cooperative Society
                  <br />
                  Azad Nagar, Bhubaneswar
                  <br />
                  Khorda, Odisha 751002
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Our team typically responds within 24 hours during business days.
          </p>
        </div>
      </div>
    </div>
  );
}
