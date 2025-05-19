import React from "react";
import { Button } from "../ui/button";

export const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-primaryCol py-16 md:py-24">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primaryCol-foreground/10" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primaryCol-foreground/10" />
      <div className="container mx-auto relative z-10 px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter text-primaryCol-foreground sm:text-4xl md:text-5xl">
            Give Your Child the Gift of a Montessori Education
          </h2>
          <p className="mb-8 text-lg text-primaryCol-foreground/90 md:text-xl">
            Join our vibrant community of learners and watch your child thrive
            in our supportive environment.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white text-primaryCol hover:bg-white/90"
            >
              Schedule a Tour
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Download Brochure
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
