import Link from "next/link";
import React from "react";

export const Programs = () => {
  return (
    <section id="programs" className="w-full bg-slate-50 py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Our Programs
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Comprehensive Montessori Education
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              We offer age-appropriate programs designed to meet the
              developmental needs of each child.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 pt-10 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-lg border bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="h-3 w-full bg-pink-500" />
            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold">Toddler Community</h3>
              <p className="mb-4 text-sm text-muted-foreground">Ages 2-3</p>
              <p className="text-muted-foreground">
                A nurturing environment where toddlers develop independence,
                language skills, and coordination.
              </p>
              <Link
                href="#"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                Learn more →
              </Link>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg border bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="h-3 w-full bg-blue-500" />
            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold">Primary Program</h3>
              <p className="mb-4 text-sm text-muted-foreground">Ages 3-6</p>
              <p className="text-muted-foreground">
                Children explore practical life, sensorial, language,
                mathematics, and cultural subjects.
              </p>
              <Link
                href="#"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                Learn more →
              </Link>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg border bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="h-3 w-full bg-green-500" />
            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold">Elementary Program</h3>
              <p className="mb-4 text-sm text-muted-foreground">Ages 6-12</p>
              <p className="text-muted-foreground">
                Students engage in an integrated curriculum that sparks
                imagination and critical thinking.
              </p>
              <Link
                href="#"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
