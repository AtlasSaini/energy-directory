import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | EnergyDirectory.ca',
  description: 'Privacy Policy for EnergyDirectory.ca. PIPEDA compliant.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <span className="text-gray-800">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-[#0a1628] mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: March 2026</p>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-8">

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">1. Introduction</h2>
          <p>
            <strong>EnergyDirectory.ca</strong> (&ldquo;EnergyDirectory&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting personal information in accordance with the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable Alberta privacy legislation.
          </p>
          <p className="mt-2">
            This Privacy Policy explains how we collect, use, disclose, and safeguard personal information when you access or use our platform (the &ldquo;Platform&rdquo;).
          </p>
          <p className="mt-2">
            By using the Platform, you consent to the collection, use, and disclosure of your information as described in this Policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">2. Scope and Nature of Information</h2>
          <p>
            EnergyDirectory.ca is a business-to-business (B2B) directory platform. Much of the information we collect relates to individuals acting in a business or professional capacity (e.g., company representatives, vendor contacts).
          </p>
          <p className="mt-2">
            Information submitted for listings may become publicly available (see Section 6).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">3. Information We Collect</h2>

          <h3 className="font-medium text-[#0a1628] mt-3 mb-1">A. Information You Provide</h3>
          <p>We may collect information you voluntarily provide, including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Business name, contact name, address, phone number, and email</li>
            <li>Listing content (descriptions, service categories, logos, images)</li>
            <li>Billing and account information (processed securely via Stripe &mdash; we do not store full payment card details)</li>
            <li>Communications submitted through the Platform (including inquiries and support requests)</li>
          </ul>

          <h3 className="font-medium text-[#0a1628] mt-4 mb-1">B. Information Collected Automatically</h3>
          <p>We may collect certain technical and usage information, including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>IP address, browser type, and device information</li>
            <li>Pages visited, time spent, and referring URLs</li>
            <li>Interaction data through analytics tools</li>
            <li>Cookies and similar tracking technologies (see Section 9)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">4. How We Use Your Information</h2>
          <p>We use personal information for the following purposes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>To create, manage, and display vendor listings</li>
            <li>To process payments, subscriptions, and billing</li>
            <li>To deliver inquiries and lead communications to vendors</li>
            <li>To operate, maintain, and improve the Platform</li>
            <li>To respond to inquiries, support requests, and communications</li>
            <li>To comply with legal, regulatory, and tax obligations</li>
            <li>To protect the security and integrity of the Platform</li>
          </ul>
          <p className="mt-2">
            We will not use your information for purposes other than those described above without your consent, unless required or permitted by law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">5. Consent</h2>
          <p>
            By using the Platform and submitting information, you consent to the collection, use, and disclosure of your information as outlined in this Policy.
          </p>
          <p className="mt-2">
            Consent may be express or implied, depending on the nature of the information and the context in which it is provided.
          </p>
          <p className="mt-2">
            You may withdraw your consent at any time (subject to legal or contractual restrictions), as described in Section 10.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">6. Public Listing Information</h2>
          <p>
            Information submitted for directory listings&mdash;including company name, description, website, phone number, email, location, and service categories&mdash;may be publicly displayed on the Platform.
          </p>
          <p className="mt-2">
            You should not include personal information in listing content that you do not wish to make publicly available.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">7. Contact and Inquiry Data (Lead Sharing)</h2>
          <p>The Platform may allow users to submit inquiries or contact vendors.</p>
          <p className="mt-2">By using these features, you acknowledge and agree that:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Inquiry information (including your contact details and message content) will be shared directly with the selected vendor(s);</li>
            <li>EnergyDirectory.ca acts solely as a conduit for transmitting communications;</li>
            <li>Vendors are independent parties and are solely responsible for how they collect, use, store, and respond to your information;</li>
            <li>We do not control or assume responsibility for vendor data practices, communications, or actions following transmission.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">8. Disclosure of Information</h2>
          <p>We do not sell or rent personal information.</p>
          <p className="mt-2">We may disclose information to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Stripe</strong> &mdash; for payment processing</li>
            <li><strong>Supabase</strong> &mdash; for secure database infrastructure</li>
            <li><strong>Vercel</strong> &mdash; for hosting and content delivery</li>
            <li>Service providers who support our operations (subject to confidentiality obligations)</li>
            <li>Law enforcement, regulators, or authorities where required or permitted by law</li>
          </ul>
          <p className="mt-2">
            All service providers are required to use personal information only for the purposes for which it is disclosed and to protect it appropriately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">9. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar technologies to operate and improve the Platform.</p>

          <h3 className="font-medium text-[#0a1628] mt-3 mb-1">Types of Cookies We Use</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Essential Cookies</strong> &mdash; required for core functionality (e.g., login sessions)</li>
            <li><strong>Analytics Cookies</strong> &mdash; used to understand usage patterns and improve performance</li>
          </ul>
          <p className="mt-2">
            You can manage or disable cookies through your browser settings. Disabling cookies may affect certain features of the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">10. Communications and CASL Compliance</h2>
          <p>By using the Platform, you consent to receive transactional communications, including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Account notifications</li>
            <li>Billing and subscription updates</li>
            <li>Inquiry and lead notifications</li>
            <li>Service-related announcements</li>
          </ul>
          <p className="mt-2">
            Where applicable, we may send marketing communications, which you can opt out of at any time using the unsubscribe mechanism provided.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">11. Data Retention</h2>
          <p>We retain personal information only as long as necessary to fulfill the purposes described in this Policy, including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>As long as your account is active</li>
            <li>As required for legal, tax, or regulatory purposes (e.g., billing records retained for up to 7 years per CRA requirements)</li>
          </ul>
          <p className="mt-2">
            If you request deletion of your account, we will remove personal information within a reasonable timeframe (generally within 30 days), subject to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Legal retention requirements</li>
            <li>Residual copies in secure backups, which are retained for a limited period and then securely deleted</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">12. Cross-Border Data Transfers</h2>
          <p>
            Your information may be stored or processed outside of Canada, including in the United States or other jurisdictions where our service providers operate.
          </p>
          <p className="mt-2">
            In such cases, your information may be subject to the laws of those jurisdictions and accessible to government authorities in accordance with applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">13. Security</h2>
          <p>
            We implement reasonable technical and organizational safeguards appropriate to the sensitivity of the information, including:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Encrypted data transmission (HTTPS)</li>
            <li>Role-based access controls</li>
            <li>Secure cloud infrastructure</li>
          </ul>
          <p className="mt-2">
            While we take reasonable steps to protect information, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">14. Breach Notification</h2>
          <p>In the event of a security breach involving personal information that poses a real risk of significant harm, we will:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Take steps to contain and investigate the breach;</li>
            <li>Notify affected individuals and applicable regulators as required by law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">15. Your Rights (PIPEDA)</h2>
          <p>Under PIPEDA, you have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Access</strong> &mdash; request a copy of the personal information we hold about you</li>
            <li><strong>Correction</strong> &mdash; request correction of inaccurate or incomplete information</li>
            <li><strong>Withdrawal of Consent</strong> &mdash; withdraw consent to the use of your information (subject to legal or contractual obligations)</li>
            <li><strong>Complaint</strong> &mdash; file a complaint with the Office of the Privacy Commissioner of Canada</li>
          </ul>
          <p className="mt-2">To exercise your rights, please contact us using the details below.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">16. Children&apos;s Privacy</h2>
          <p>
            The Platform is intended for business use and is not directed at individuals under 18 years of age. We do not knowingly collect personal information from minors.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">17. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised &ldquo;Last updated&rdquo; date. Continued use of the Platform constitutes acceptance of the updated Policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">18. Contact Our Privacy Officer</h2>
          <p>
            For privacy-related questions, requests, or complaints, please contact:<br />
            <strong>Privacy Officer &mdash; EnergyDirectory.ca</strong><br />
            Calgary, Alberta, Canada<br />
            Email:{' '}
            <a href="mailto:support@energydirectory.ca" className="text-amber-600 hover:text-amber-500">
              support@energydirectory.ca
            </a>
          </p>
          <p className="mt-2">
            You may also contact the Office of the Privacy Commissioner of Canada:{' '}
            <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-500">
              www.priv.gc.ca
            </a>
          </p>
        </section>

      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-gray-500 flex gap-4">
        <Link href="/terms" className="text-amber-600 hover:text-amber-500">Terms of Service</Link>
        <Link href="/" className="hover:text-amber-600">Back to Home</Link>
      </div>
    </div>
  )
}
