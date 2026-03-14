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
            <strong>EnergyDirectory.ca</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting the privacy of individuals in accordance with the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable Alberta privacy legislation.
          </p>
          <p className="mt-2">
            This Privacy Policy explains how we collect, use, disclose, and safeguard personal information when you use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">2. Information We Collect</h2>
          <p>We collect the following types of information:</p>

          <h3 className="font-medium text-[#0a1628] mt-3 mb-1">Information You Provide</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Business name, contact name, address, phone, and email when submitting a listing</li>
            <li>Company logo and photos</li>
            <li>Billing information (processed securely via Stripe — we do not store card numbers)</li>
            <li>Communications sent to us by email or through the platform</li>
          </ul>

          <h3 className="font-medium text-[#0a1628] mt-3 mb-1">Automatically Collected Information</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>IP address, browser type, and device information</li>
            <li>Pages visited, time spent, and referring URLs (via analytics)</li>
            <li>Cookies and similar tracking technologies (see Section 7)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">3. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Create, display, and manage your vendor listing</li>
            <li>Process subscription payments and issue receipts</li>
            <li>Deliver lead enquiries to listed vendors</li>
            <li>Respond to support requests and communications</li>
            <li>Improve the platform&apos;s features, content, and performance</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p className="mt-2">
            We will not use your personal information for purposes other than those listed above without your consent.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">4. Disclosure of Information</h2>
          <p>
            We do not sell or rent personal information to third parties. We may share information with:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Stripe</strong> — for payment processing (subject to Stripe&apos;s Privacy Policy)</li>
            <li><strong>Supabase</strong> — for secure database hosting</li>
            <li><strong>Vercel</strong> — for platform hosting and delivery</li>
            <li><strong>Law enforcement or regulators</strong> — when required by law</li>
          </ul>
          <p className="mt-2">
            All third-party service providers are contractually bound to protect your information and use it only for the purposes for which it was disclosed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">5. Public Information on Listings</h2>
          <p>
            Business information submitted for a directory listing (company name, description, website, phone, email, location, and categories) is <strong>publicly visible</strong> on the platform. Do not include personal information you wish to keep private in your listing content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">6. Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to provide services. If you request deletion of your account, we will remove personal information within 30 days, except where retention is required for legal or tax purposes (e.g., billing records are retained for 7 years per CRA requirements).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">7. Cookies</h2>
          <p>
            We use essential cookies to operate the platform (e.g., session management). We may use analytics cookies to understand usage patterns. You can disable cookies in your browser settings, but some features may not function correctly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">8. Your Rights (PIPEDA)</h2>
          <p>Under PIPEDA, you have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Access</strong> — request a copy of the personal information we hold about you</li>
            <li><strong>Correction</strong> — request corrections to inaccurate or incomplete information</li>
            <li><strong>Withdrawal of consent</strong> — withdraw consent to the use of your personal information (subject to legal obligations)</li>
            <li><strong>Complaint</strong> — file a complaint with the Office of the Privacy Commissioner of Canada (OPC)</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at <a href="mailto:atlas.commandnode@gmail.com" className="text-amber-600 hover:text-amber-500">atlas.commandnode@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">9. Security</h2>
          <p>
            We implement commercially reasonable technical and organizational measures to protect your personal information, including encrypted data transmission (HTTPS), role-based access controls, and secure cloud infrastructure. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">10. Children&apos;s Privacy</h2>
          <p>
            EnergyDirectory.ca is a B2B platform intended for business users. We do not knowingly collect personal information from individuals under 18 years of age.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post the updated policy on this page with a revised date. Continued use of the platform constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0a1628] mb-2">12. Contact Our Privacy Officer</h2>
          <p>
            For privacy-related questions, concerns, or requests:<br />
            <strong>Privacy Officer — EnergyDirectory.ca</strong><br />
            Calgary, Alberta, Canada<br />
            Email: <a href="mailto:atlas.commandnode@gmail.com" className="text-amber-600 hover:text-amber-500">atlas.commandnode@gmail.com</a>
          </p>
          <p className="mt-2">
            You may also contact the Office of the Privacy Commissioner of Canada:{' '}
            <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-500">www.priv.gc.ca</a>
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
