"use client";
import { getCurrentUser } from "@/API/auth.api";
import { useAuth } from "@/store/AuthProvider";
import { IUser } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export const Header = () => {
  const { user, setUser }: { user: IUser; setUser: (user: any) => void } =
    useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(),
    initialData: user ? { success: true, response: user } : undefined,
  });

  useEffect(() => {
    if (!isLoading && data && data.success && data.response)
      setUser(data.response);
  }, [data, isLoading, setUser]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <nav className="flex gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primaryCol"
          >
            Home
          </Link>
          <Link
            href="/#about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primaryCol"
          >
            About
          </Link>
          <Link
            href="/#programs"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primaryCol"
          >
            Programs
          </Link>
          <Link
            href="/#testimonials"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primaryCol"
          >
            Testimonials
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primaryCol"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/images/logo.jpg"
              alt="The Arbour Academy Logo"
              width={40}
              height={40}
              className="w-6 h-6 rounded-full bg-primaryCol/20"
            />
            <span className="hidden font-bold sm:inline-block">
              The Arbour Academy
            </span>
          </Link>
          {user ? (
            <Link
              href={
                user.role === "ADMIN"
                  ? "/dashboard/admin"
                  : user.role === "TEACHER"
                  ? "/dashboard/teacher"
                  : "/dashboard/parent"
              }
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primaryCol"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primaryCol"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
