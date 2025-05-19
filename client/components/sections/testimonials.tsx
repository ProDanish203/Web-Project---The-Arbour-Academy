import { testimonials } from "@/lib/data";
import Image from "next/image";
import React from "react";

export const Testimonials = () => {
  return (
    <section id="testimonials" className="w-full bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primaryCol/10 px-3 py-1 text-sm font-medium text-primaryCol">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Parents Say
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              Hear from families who have experienced the Arbour Academy
              difference.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 pt-10 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              img={testimonial.img}
              name={testimonial.name}
              subtitle={testimonial.subtitle}
              text={testimonial.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({
  img,
  name,
  subtitle,
  text,
}: {
  img: string;
  name: string;
  subtitle: string;
  text: string;
}) => {
  return (
    <div className="rounded-lg bg-slate-50 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-primaryCol/20">
          <Image src={img} alt="Parent" width={50} height={50} />
        </div>
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <p className="mt-4 text-muted-foreground">&quot;{text}&quot;</p>
    </div>
  );
};
