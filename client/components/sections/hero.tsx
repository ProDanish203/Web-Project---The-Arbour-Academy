import { BookOpen, Clock, MapPin } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { heroData } from "@/lib/data";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative">
      <div className="relative h-[700px] w-full overflow-hidden">
        <Image
          src={heroData.imageUrl}
          alt="Children in Montessori classroom"
          fill
          className="object-cover brightness-[0.7]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primaryCol/40 to-primaryCol/20" />
        <div className="container mx-auto relative z-10 flex h-full flex-col items-start justify-center px-4 md:px-6">
          <div className="max-w-[600px] space-y-4">
            <div className="inline-block rounded-lg bg-white/90 px-4 py-1.5 text-sm font-medium text-primaryCol">
              Nurturing Minds, Inspiring Futures
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
              {heroData.title}
            </h1>
            <p className="max-w-[500px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {heroData.subtitle}
            </p>
            <Link href="/admission">
              <Button
                size="lg"
                className="bg-primaryCol hover:bg-primaryCol/90"
              >
                {heroData.buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Colorful banner under hero */}
      <div className="w-full bg-white py-4">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 md:grid-cols-3 md:px-6">
          <div className="flex items-center gap-2 rounded-lg bg-yellow-100 p-4">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="font-medium">School Hours</h3>
              <p className="text-sm text-muted-foreground">
                Mon-Fri: 8:00 AM - 3:30 PM
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-green-100 p-4">
            <BookOpen className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-medium">Ages 2-12</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive Montessori curriculum
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-blue-100 p-4">
            <MapPin className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-medium">Visit Us</h3>
              <p className="text-sm text-muted-foreground">
                123 Education Lane, Learning City
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
