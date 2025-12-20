
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"

export default function CancelAndRefundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4">
      <Card className="max-w-4xl w-full shadow-lg border border-gray-200">
        <CardContent className="p-6 md:p-10 space-y-10">
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Cancellation &amp; Refund Policy</h1>
            <p className="text-sm text-gray-500">Last updated: 10th December 2025</p>
          </header>


          <section className="space-y-4 text-gray-700">
            <p>
              <strong>BEYONDERS GENZ VENTURES PRIVATE LIMITED</strong> believes in helping its customers as much as possible and therefore follows a liberal cancellation policy. Under this policy:
            </p>
          </section>


          <Separator />


          <section>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>
               Cancellations will be considered only if the request is made within same day of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them. 
              </li>
              <li>
               <strong>BEYONDERS GENZ VENTURES PRIVATE LIMITED</strong> does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
              </li>
              <li>
                In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within same day of receipt of the products. 
              </li>
              <li>
                In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within same day of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision. 
              </li>
              <li>
                In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
              </li>
              <li>
               In case of any Refunds approved by the BEYONDERS GENZ VENTURES PRIVATE LIMITED, it'll take same day for the refund to be processed to the end customer.
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
