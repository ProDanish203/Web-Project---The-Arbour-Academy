"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { ProfileButton } from "./profile-button";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export const AdminHeader = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-md border-b">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logo.jpg"
            alt="The Arbour Academy Logo"
            width={40}
            height={40}
            className="h-6 w-6 rounded-full bg-primaryCol/20"
          />
          <span className="hidden font-bold sm:inline-block">
            The Arbour Academy
          </span>
        </Link>
      </div>
      <ProfileButton />
    </div>
  );
};
