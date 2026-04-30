import { Link } from "react-router-dom";
import { FaithBlissLogo } from "@/components/branding/FaithBlissLogo";

/** Public marketing About page (not the authenticated app shell). */
export default function AboutPublic() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-pink-300">
            <FaithBlissLogo imgProps={{ className: "h-8 w-auto shrink-0 object-contain" }} />
            <span className="font-bold">FaithBliss</span>
          </Link>
          <Link to="/signup" className="text-sm text-pink-400 hover:text-pink-300">
            Join
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          About FaithBliss
        </h1>
        <p className="text-gray-300 leading-relaxed mb-4">
          FaithBliss is a platform for Christian singles across Africa who want intentional,
          faith-centered connections—with marriage in view, not casual dating.
        </p>
        <p className="text-gray-300 leading-relaxed mb-8">
          We focus on shared values, safety, and community so you can meet people who take faith
          and relationships seriously.
        </p>
        <Link to="/" className="text-pink-400 hover:text-pink-300 text-sm">
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
