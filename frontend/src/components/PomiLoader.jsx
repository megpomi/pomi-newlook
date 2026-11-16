import React from "react";
import pomiLogo from "@/assets/pomi-logo.png";

export default function PomiLoader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      data-testid="pomi-loader"
      className="fixed inset-0 flex items-center justify-center bg-background"
    >
      <img
        src={pomiLogo}
        alt=""
        className="h-14 w-14 animate-soft-fade object-contain motion-reduce:animate-none"
      />
    </div>
  );
}
