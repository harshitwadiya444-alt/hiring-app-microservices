import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="
        mt-20
        bg-gradient-to-r from-[#14162e] via-[#2c2f6c] to-[#4b46a6]
        border-t border-white/10
        text-white/80
      "
    >
      <div className="max-w-7xl mx-auto px-4 py-8 text-center space-y-2">
        <p className="text-sm">
          © {new Date().getFullYear()} <span className="text-white font-medium">Harshit Wadiya</span>. All rights reserved.
        </p>

        <p className="text-sm">
          Powered by{" "}
          <span className="text-indigo-300 font-medium">
            {/* GitHub link tu baad me paste karega */}
            Harshit Wadiya
          </span>
        </p>

        <div className="flex justify-center gap-4 text-sm">
          <Link
            to="/PrivacyPolicy"
            className="hover:text-white transition"
          >
            Privacy Policy
          </Link>
          <span className="text-white/40">|</span>
          <Link
            to="/TermsofService"
            className="hover:text-white transition"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
