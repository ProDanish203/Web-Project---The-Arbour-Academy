import { aboutData } from "@/lib/data";
import Image from "next/image";
import React from "react";

export const About = () => {
  return (
    <section id="about" className="w-full bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primaryCol/10 px-3 py-1 text-sm font-medium text-primaryCol">
              About Us
            </div>
            <div className="relative">
              <div className="absolute -left-6 top-0 h-20 w-20 rounded-full bg-yellow-200 opacity-50" />
              <div className="absolute -right-4 bottom-10 h-16 w-16 rounded-full bg-blue-200 opacity-50" />
              <h2 className="relative z-10 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {aboutData.title}
              </h2>
            </div>
            <p className="text-muted-foreground md:text-lg">
              {aboutData.description}
            </p>
            <p className="text-muted-foreground md:text-lg">
              {aboutData.secondDescription}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Child-centered</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">Self-paced learning</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2">
                <div className="h-3 w-3 rounded-full bg-purple-500" />
                <span className="text-sm font-medium">Hands-on materials</span>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-primaryCol/10" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-yellow-200/50" />
            <div className="relative overflow-hidden rounded-lg border-8 border-white shadow-xl">
              <Image
                src={aboutData.imageUrl}
                alt="Children engaged in Montessori activities"
                width={600}
                height={400}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
