import { Link } from "react-router-dom";
import { FaithBlissLogo } from "@/components/branding/FaithBlissLogo";
import { Mail } from "lucide-react";

/** Public contact page; aligns with in-app Help mail + site links. */
export default function ContactPublic() {
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
        <h1 className="text-3xl font-bold mb-6 bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Contact
        </h1>
        <p className="text-gray-300 leading-relaxed mb-8">
          Questions about FaithBliss? Reach our team—we typically reply within a few business days.
        </p>
        <a
          href="mailto:support@faithblissafrica.com"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-5 py-4 text-pink-300 hover:border-pink-500/40 hover:bg-gray-800 transition-colors"
        >
          <Mail className="w-5 h-5 shrink-0" />
          support@faithblissafrica.com
        </a>
        <p className="mt-8 text-sm text-gray-400">
          Web:{" "}
          <a
            href="https://faithblissafrica.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:underline"
          >
            faithblissafrica.com/contact
          </a>
        </p>
        <Link to="/" className="inline-block mt-10 text-pink-400 hover:text-pink-300 text-sm">
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
