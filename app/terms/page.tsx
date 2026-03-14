import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | EnergyDirectory.ca',
  description: 'Terms of Service for EnergyDirectory.ca.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <span className="text-gray-800">Terms of Service</span>
      </nav>

      <h1 className="text-3xl font-bold text-[#0a1628] mb-2">Terms of Service</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: March 2026</p>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-8">

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">1. About Us</h2>
          <p>
            EnergyDirectory.ca (&ldquo;the Directory&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is operated by <strong>EnergyDirectory.ca</strong> (GST# 738605831 RT0001), registered in Alberta, Canada. By accessing or using this website, you agree to these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">2. Acceptance of Terms</h2>
          <p>
            By using EnergyDirectory.ca, you confirm that you are at least 18 years of age, have the authority to enter into these terms on behalf of your organization (if applicable), and agree to comply with all applicable laws in the Province of Alberta and Canada.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">3. Free Listings</h2>
          <p>
            Free listings are available to any Canadian energy sector business at no charge. Free listings include basic company information, contact details, and one service category. We reserve the right to review, approve, or remove any listing that does not meet our quality standards or violates these terms. Free listings do not guarantee placement, visibility, or priority in search results.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">4. Paid Subscriptions</h2>
          <p>
            Featured and Premium listing plans are offered on a monthly or annual subscription basis. All prices are in Canadian dollars (CAD) and are subject to 5% Goods and Services Tax (GST) at checkout.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Subscriptions renew automatically unless cancelled before the renewal date.</li>
            <li>You may cancel at any time; cancellations take effect at the end of the current billing period.</li>
            <li>Refunds are not provided for partial billing periods.</li>
            <li>Annual plans are non-refundable after 14 days from the start date.</li>
            <li>We reserve the right to change pricing with 30 days' notice.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">5. Accuracy of Vendor Data</h2>
          <p>
            You are solely responsible for the accuracy, completeness, and legality of all information submitted in your listing. You represent and warrant that:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>All information provided is true, accurate, and not misleading.</li>
            <li>You have the right to submit all content, including logos and images.</li>
            <li>Your business operates in compliance with all applicable Canadian laws and regulations.</li>
          </ul>
          <p className="mt-2">
            We reserve the right to remove or edit listings that contain inaccurate, misleading, or inappropriate content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">6. No Liability for Vendor Services</h2>
          <p>
            EnergyDirectory.ca is a directory platform only. We do not endorse, warrant, or guarantee the quality, safety, legality, or fitness of any vendor, product, or service listed. Any business relationship you enter into with a listed vendor is solely between you and that vendor.
          </p>
          <p className="mt-2">
            <strong>We are not liable for any damages, losses, or claims arising from your use of or reliance on information found in this directory, or from transactions with any listed vendor.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">7. Intellectual Property</h2>
          <p>
            All content on EnergyDirectory.ca, including design, code, and editorial content, is the property of EnergyDirectory.ca or its licensors. You may not reproduce, distribute, or create derivative works without our written consent. By submitting content (logos, descriptions, photos), you grant us a non-exclusive licence to display that content on the platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">8. Prohibited Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Submit false, misleading, or fraudulent information.</li>
            <li>Use the directory to send unsolicited communications (spam).</li>
            <li>Attempt to scrape, crawl, or systematically extract data without permission.</li>
            <li>Interfere with the security or integrity of the platform.</li>
            <li>Impersonate another company or individual.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">9. Termination</h2>
          <p>
            We reserve the right to suspend or terminate any account or listing at our sole discretion, with or without notice, for any violation of these terms or conduct we deem harmful to the platform or its users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">10. Disclaimer of Warranties</h2>
          <p>
            The platform is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. We do not warrant that the platform will be uninterrupted, error-free, or free of viruses.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">11. Governing Law</h2>
          <p>
            These Terms of Service are governed by the laws of the Province of Alberta and the federal laws of Canada applicable therein. Any disputes shall be resolved in the courts of Alberta.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">12. Changes to These Terms</h2>
          <p>
            We may update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will update the &ldquo;Last updated&rdquo; date above when changes are made.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">13. Contact</h2>
          <p>
            For questions about these Terms, contact us at:<br />
            <strong>EnergyDirectory.ca</strong><br />
            Calgary, Alberta, Canada<br />
            Email: <a href="mailto:atlas.commandnode@gmail.com" className="text-amber-600 hover:text-amber-500">atlas.commandnode@gmail.com</a>
          </p>
        </section>

      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-gray-500 flex gap-4">
        <Link href="/privacy" className="text-amber-600 hover:text-amber-500">Privacy Policy</Link>
        <Link href="/" className="hover:text-amber-600">Back to Home</Link>
      </div>
    </div>
  )
}
