import React from "react";
import { Link } from "react-router-dom";

// Footer shown on the public pages, so the About and Contact pages are always
// one click away.
export default function PublicFooter() {
  return (
    <footer className="border-t border-pomegranate-100">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-5 py-8 text-center text-xs text-slate-500 sm:flex-row sm:justify-between sm:text-left">
        <p>© {new Date().getFullYear()} Pomi. Not a medical device.</p>
        <nav className="flex items-center gap-5">
          <Link
            to="/about"
            className="font-medium text-pomegranate-600 hover:text-pomegranate-700"
          >
            About us
          </Link>
          <Link
            to="/contact"
            className="font-medium text-pomegranate-600 hover:text-pomegranate-700"
          >
            Contact us
          </Link>
        </nav>
      </div>
    </footer>
  );
}