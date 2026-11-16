import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import pomiLogo from "@/assets/pomi-logo.png";

// Header for the public (non signed-in) pages: the logo plus the plain links a
// visitor or reviewer needs.
export default function PublicHeader() {
  return (
    <header className="border-b border-pomegranate-100/70 bg-background/85">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={pomiLogo}
            alt="Pomi"
            className="h-12 w-12 shrink-0"
            style={{ objectFit: "contain" }}
          />
          <span className="font-heading text-lg font-semibold text-slate-800">
            Pomi
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-4">
          <Link
            to="/about"
            className="font-medium text-slate-600 hover:text-pomegranate-600"
          >
            About us
          </Link>
          <Link
            to="/contact"
            className="font-medium text-slate-600 hover:text-pomegranate-600"
          >
            Contact us
          </Link>
          <Link
            to="/login"
            className="font-medium text-pomegranate-600 hover:text-pomegranate-700"
          >
            Sign in
          </Link>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-pomegranate-600 px-4 hover:bg-pomegranate-700"
          >
            <Link to="/">Start with Pomi</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}