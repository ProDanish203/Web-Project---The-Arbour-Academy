import Image from "next/image";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col md:flex-row md:min-h-screen">
      {/* Left Section */}
      <div className="flex-1 relative hidden md:block">
        <Image
          src="/images/auth.jpg"
          alt="Authentication"
          width={1500}
          height={1500}
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Right Section */}
      <div className="relative flex-1 flex items-center justify-center bg-white p-4 sm:p-8 md:p-16 min-h-screen">
        <Link
          href="/"
          className="absolute top-5 left-0 right-0 flex items-center justify-center"
        >
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={200}
            height={150}
            className="w-20 h-20 rounded-full"
          />
          <span className="text-xl font-bold text-gray-800 ml-2">
            The Arbour Academy
          </span>
        </Link>
        {children}
      </div>
    </main>
  );
}
