import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import pomiLogo from "@/assets/pomi-logo.png";

// Header for the public (non signed-in) pages: the logo plus the plain links a
// visitor or reviewer needs.
export default function PublicHeader() {
  return (
    <header className="border-b border-pomegranate-100/70 bg-background/85">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-5 py-3 sm:gap-4 sm:px-8 sm:py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          <Image
            src={pomiLogo}
            alt="Pomi"
            className="h-9 w-9 shrink-0 sm:h-11 sm:w-11"
            fittingType="fit"
          />
          <span className="font-heading text-base font-semibold text-slate-800 sm:text-lg">
            Pomi
          </span>
        </Link>
        <nav className="flex items-center gap-4 whitespace-nowrap text-sm">
          <Link
            to="/about"
            className="hidden font-medium text-slate-600 hover:text-pomegranate-600 sm:inline"
          >
            About us
          </Link>
          <Link
            to="/contact"
            className="hidden font-medium text-slate-600 hover:text-pomegranate-600 sm:inline"
          >
            Contact us
          </Link>
          <Link
            to="/login"
            className="font-medium text-pomegranate-700 hover:text-pomegranate-800"
          >
            Sign in
          </Link>
          <Button
            asChild
            size="sm"
            className="h-9 rounded-full bg-pomegranate-700 px-4 text-[13px] font-medium tracking-[0.01em] text-white hover:bg-pomegranate-800"
          >
            <Link to="/">Start with Pomi</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}