import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-white py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.jpg"
            alt="The Arbour Academy Logo"
            width={30}
            height={30}
            className="w-6 h-6 rounded-full bg-primaryCol/20"
          />
          <span className="text-sm font-semibold">The Arbour Academy</span>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Careers
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} The Arbour Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
