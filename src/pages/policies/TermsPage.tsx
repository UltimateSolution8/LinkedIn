
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4">
      <Card className="max-w-4xl w-full shadow-lg border border-gray-200">
        <CardContent className="p-6 md:p-10 space-y-10">
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Terms &amp; Conditions</h1>
            <p className="text-sm text-gray-500">Last updated: 10th December 2025</p>
          </header>


          <section className="space-y-4 text-gray-700">
            <p>
              For the purpose of these Terms and Conditions, the terms "we", "us", and "our" refer to <strong>BEYONDERS GENZ VENTURES PRIVATE LIMITED</strong>, whose registered/operational office is Plot NO-321/2487, BJB College Cooperative Society, Azad Nagar, Bhubaneswar, Khorda, ODISHA 751002. The terms "you", "your", "user", or "visitor" refer to any natural or legal person who visits our website and/or agrees to purchase from us.
            </p>
            <p>
              Your use of the website and/or purchase from us is governed by the following Terms and Conditions:
            </p>
          </section>


          <Separator />


          <section>
            <h2 className="text-xl font-semibold mb-3">General</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>The content of the pages of this website is subject to change without notice.</li>
              <li>
                Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
              </li>
              <li>
                Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It is your responsibility to ensure that any products, services or information available through our website meet your specific requirements.
              </li>
              <li>
                Our website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
              </li>
              <li>All trademarks reproduced on our website which are not the property of, or licensed to, the operator are acknowledged on the website.</li>
              <li>Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offence.</li>
              <li className="text-gray-700">
                From time to time our website may include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).
              </li>
              <li className="text-gray-700">
                You may not create a link to our website from another website or document without BEYONDERS GENZ VENTURES PRIVATE LIMITED's prior written consent.
              </li>
              <li className="text-gray-700">
                Any dispute arising out of or in connection with your use of our website and/or purchase from us shall be governed by and construed in accordance with the laws of India.
              </li>
              <li className="text-gray-700">
                We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any transaction, on account of the cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
              </li>
            </ul>
          </section>

          <footer className="text-center text-sm text-gray-500">
            <p>&copy; 2025 BEYONDERS GENZ VENTURES PRIVATE LIMITED. All rights reserved.</p>
          </footer>
        </CardContent>
      </Card>
    </div>
  )
}
