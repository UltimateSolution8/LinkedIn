
const Footer = () => {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <p className="text-sm text-gray-500">
          © 2025 RIXLY. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-end">
          <a
            href="/contactus"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            Contact Us
          </a>
          <a
            href="/policies/terms"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            Terms and Conditions
          </a>
           <a
            href="/policies/cancelandrefund"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            Cancellation and Refund Policy
          </a>
          <a
            href="/policies/privacy"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
