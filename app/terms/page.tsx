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
            EnergyDirectory.ca (&ldquo;EnergyDirectory&rdquo;, &ldquo;the Directory&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is operated in Alberta, Canada (GST# 738605831 RT0001).
          </p>
          <p className="mt-2">
            EnergyDirectory.ca provides an online platform that allows users to discover, review, and connect with businesses operating in the energy, oil &amp; gas, renewables, and mining sectors across Canada (the &ldquo;Platform&rdquo;).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">2. Acceptance of Terms</h2>
          <p>By accessing or using the Platform, you confirm that:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>You are at least 18 years of age;</li>
            <li>You have the legal authority to enter into these Terms on your own behalf or on behalf of your organization; and</li>
            <li>You agree to comply with all applicable laws and regulations in Canada, including those of the Province of Alberta.</li>
          </ul>
          <p className="mt-2">If you do not agree to these Terms, you must not use the Platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">3. Platform Services and Nature of the Directory</h2>
          <p>EnergyDirectory.ca is a directory and connection platform only.</p>
          <p className="mt-2">We:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Do not provide, endorse, or guarantee any vendor services;</li>
            <li>Do not verify all vendor information;</li>
            <li>Are not a party to any transactions, communications, or agreements between users and vendors.</li>
          </ul>
          <p className="mt-2">Vendor rankings, search results, and visibility may be influenced by factors including (but not limited to):</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Paid subscription status;</li>
            <li>Relevance and completeness of listings;</li>
            <li>Platform algorithms and internal business considerations.</li>
          </ul>
          <p className="mt-2">We do not guarantee leads, inquiries, business opportunities, search ranking position, website traffic, or return on investment.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">4. Free Listings</h2>
          <p>Free listings may be available to qualifying Canadian energy-sector businesses.</p>
          <p className="mt-2">Free listings:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Include limited company information and one service category;</li>
            <li>Are subject to approval and ongoing review;</li>
            <li>May be modified, suspended, or removed at our discretion;</li>
            <li>Do not guarantee visibility, placement, or inclusion in search results.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">5. Paid Subscriptions</h2>
          <p>We offer Basic, Featured, and Premium listing plans on a monthly or annual subscription basis.</p>

          <p className="mt-3 font-medium text-gray-800">Billing and Taxes</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>All fees are in Canadian dollars (CAD);</li>
            <li>Applicable taxes, including GST (currently 5%), will be applied at checkout.</li>
          </ul>

          <p className="mt-3 font-medium text-gray-800">Renewals</p>
          <p>Subscriptions renew automatically unless cancelled prior to the renewal date.</p>

          <p className="mt-3 font-medium text-gray-800">Cancellations</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>You may cancel at any time;</li>
            <li>Cancellations take effect at the end of the current billing period.</li>
          </ul>

          <p className="mt-3 font-medium text-gray-800">Refunds</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>No refunds are provided for partial billing periods;</li>
            <li>Annual plans are non-refundable after 14 days from the start date.</li>
          </ul>

          <p className="mt-3 font-medium text-gray-800">Pricing Changes</p>
          <p>We may change pricing with at least 30 days&rsquo; notice.</p>

          <p className="mt-3 font-medium text-gray-800">Payment Failure</p>
          <p>If payment cannot be processed, we reserve the right to suspend or downgrade your listing until payment is received.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">6. Vendor Content and Accuracy</h2>
          <p>You are solely responsible for all content submitted to the Platform, including company details, descriptions, logos, and images.</p>
          <p className="mt-2">You represent and warrant that:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>All information is accurate, complete, and not misleading;</li>
            <li>You have all necessary rights and permissions to submit the content;</li>
            <li>Your business complies with all applicable laws and regulations.</li>
          </ul>
          <p className="mt-2">We reserve the right to edit, reject, or remove any content at our discretion.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">7. Contact and Inquiry Tools</h2>
          <p>The Platform may include tools that allow users to contact vendors or submit inquiries.</p>
          <p className="mt-2">By using these tools, you acknowledge that:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>EnergyDirectory.ca is not a party to any communication between users and vendors;</li>
            <li>We do not guarantee delivery, response, or accuracy of any inquiry;</li>
            <li>We do not verify the identity or legitimacy of users or inquiries;</li>
            <li>We are not responsible for any misuse of the Platform, including spam, fraud, or misrepresentation.</li>
          </ul>
          <p className="mt-2">You agree that any business relationship formed is solely between you and the other party.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">8. Data Usage and Privacy</h2>
          <p>By using the Platform, you acknowledge that:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Inquiry and contact information you submit may be shared with listed vendors;</li>
            <li>We are not responsible for how vendors use or process your information once it has been transmitted;</li>
            <li>Your use of the Platform is also governed by our <Link href="/privacy" className="text-amber-600 hover:text-amber-500">Privacy Policy</Link>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">9. Intellectual Property</h2>
          <p>
            All content on the Platform, including design, layout, software, and editorial content, is owned by EnergyDirectory.ca or its licensors and is protected by applicable intellectual property laws.
          </p>
          <p className="mt-2">
            By submitting content, you grant EnergyDirectory.ca a non-exclusive, worldwide, royalty-free licence to use, display, reproduce, and distribute such content in connection with operating and promoting the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">10. Prohibited Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Submit false, misleading, or fraudulent information;</li>
            <li>Use the Platform to send unsolicited or unauthorized communications (spam);</li>
            <li>Scrape, crawl, or systematically extract data without permission;</li>
            <li>Interfere with or disrupt the security or operation of the Platform;</li>
            <li>Impersonate any individual or entity.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">11. Termination</h2>
          <p>
            We reserve the right to suspend or terminate any account or listing, with or without notice, for any violation of these Terms or conduct we deem harmful to the Platform or its users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">12. Disclaimer of Warranties</h2>
          <p>The Platform is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.</p>
          <p className="mt-2">We make no representations or warranties, express or implied, including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>That the Platform will be uninterrupted, error-free, or secure;</li>
            <li>That listings, results, or content will be accurate or reliable;</li>
            <li>That the Platform will meet your expectations or business needs.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">13. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law:</p>
          <p className="mt-2">
            EnergyDirectory.ca shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, business opportunities, data, or goodwill.
          </p>
          <p className="mt-2">In no event shall our total cumulative liability exceed the greater of:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The amount paid by you to EnergyDirectory.ca in the twelve (12) months preceding the claim; or</li>
            <li>One hundred Canadian dollars (CAD $100).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">14. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless EnergyDirectory.ca and its owners, officers, and affiliates from and against any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Your use of the Platform;</li>
            <li>Your submitted content;</li>
            <li>Your violation of these Terms;</li>
            <li>Any dispute between you and another user or vendor.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">15. Service Availability</h2>
          <p>
            We do not guarantee that the Platform will be available at all times. We are not responsible for any interruptions, delays, errors, or outages, including those caused by maintenance, technical issues, or events beyond our control.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">16. Force Majeure</h2>
          <p>
            We shall not be liable for any failure or delay in performance due to events beyond our reasonable control, including but not limited to natural disasters, internet outages, cyberattacks, labour disputes, or government actions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">17. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Province of Alberta and the federal laws of Canada applicable therein. Any disputes shall be resolved exclusively in the courts of Alberta, sitting in Calgary, Alberta.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">18. Changes to These Terms</h2>
          <p>
            We may update these Terms at any time. Continued use of the Platform after changes are posted constitutes acceptance of the updated Terms. The &ldquo;Last updated&rdquo; date will reflect the most recent revisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">19. Contact</h2>
          <p>
            For questions regarding these Terms, please contact:<br />
            <strong>EnergyDirectory.ca</strong><br />
            Calgary, Alberta, Canada<br />
            Email: <a href="mailto:support@energydirectory.ca" className="text-amber-600 hover:text-amber-500">support@energydirectory.ca</a>
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
