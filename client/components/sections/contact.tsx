import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Textarea } from "../ui/textarea";

export const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Get in Touch
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We&apos;re here to answer your questions and help you learn more
            about The Arbour Academy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl shadow-md h-full">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">Address</h4>
                    <p className="text-slate-600">
                      123 Education Lane
                      <br />
                      Arbour Heights, CA 90210
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">Phone</h4>
                    <p className="text-slate-600">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">Email</h4>
                    <p className="text-slate-600">info@arbouracademy.edu</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">Hours</h4>
                    <p className="text-slate-600">
                      Monday - Friday: 8:00 AM - 3:30 PM
                      <br />
                      Extended Care: Until 5:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Send Us a Message
              </h3>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="border-slate-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="border-slate-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-slate-700"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="What is this regarding?"
                    className="border-slate-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-slate-700"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    className="border-slate-200 focus:border-blue-500 min-h-[150px]"
                  />
                </div>

                <Button className="w-full bg-primaryCol hover:bg-primaryCol/90 text-white py-6">
                  Send Message
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  By submitting this form, you agree to our privacy policy and
                  terms of service.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
