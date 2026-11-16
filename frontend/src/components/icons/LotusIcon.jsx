import React from "react";

export default function LotusIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 4.8c1.9 2.1 2.9 4.2 2.9 6.3 0 2.2-1 4.1-2.9 5.6-1.9-1.5-2.9-3.4-2.9-5.6 0-2.1 1-4.2 2.9-6.3Z" />
      <path d="M12 12.4C10.4 9.9 8.3 8.6 5.6 8.6c.2 2.6 1.3 4.6 3.2 5.9 1.1.8 2.2 1.1 3.2 1.2Z" />
      <path d="M12 12.4c1.6-2.5 3.7-3.8 6.4-3.8-.2 2.6-1.3 4.6-3.2 5.9-1.1.8-2.2 1.1-3.2 1.2Z" />
      <path d="M3.2 13.6c1.4 3.7 4.7 6 8.8 6s7.4-2.3 8.8-6" />
    </svg>
  );
}