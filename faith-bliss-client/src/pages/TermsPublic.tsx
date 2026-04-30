import { Link } from "react-router-dom";
import { FaithBlissLogo } from "@/components/branding/FaithBlissLogo";

/** Public terms overview; replace with counsel-approved terms before formal launch. */
export default function TermsPublic() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-pink-300">
            <FaithBlissLogo imgProps={{ className: "h-8 w-auto shrink-0 object-contain" }} />
            <span className="font-bold">FaithBliss</span>
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-white">Terms of use</h1>
        <p className="text-gray-400 text-sm mb-8">
          Last updated: April 30, 2026
        </p>
        <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
          <p>
            By accessing or using FaithBliss, you agree to follow these terms, our community
            guidelines, and applicable law. You must be of legal age to use the service in your
            country.
          </p>
          <p>
            You are responsible for your account, your interactions with other members, and any
            content you post. We may suspend or terminate accounts that violate these terms or harm
            the community.
          </p>
          <p>
            The service is provided &quot;as is.&quot; To the extent permitted by law, we are not
            liable for disputes between users or for indirect damages arising from use of the
            platform.
          </p>
        </div>
        <p className="mt-10 text-xs text-gray-500">
          This page is a summary. Formal terms of service should be drafted or reviewed by legal
          counsel for your markets.
        </p>
        <Link to="/" className="inline-block mt-8 text-pink-400 hover:text-pink-300 text-sm">
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
