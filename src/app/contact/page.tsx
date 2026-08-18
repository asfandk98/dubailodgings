"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { sendContactMessage } from "@/lib/api";

const SUBJECTS = ["New Booking Inquiry", "Existing Reservation", "Concierge Request", "Partnership Inquiry", "General Question"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setStatus("error");
      setStatusMessage("Please fill in your name and email.");
      return;
    }
    if (form.message.trim().length < 10) {
      setStatus("error");
      setStatusMessage("Your message must be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    setStatus("idle");

    // Backend has no dedicated "subject" field, so it's folded into the
    // message body — ContactController::send() only accepts name/email/phone/message.
    const result = await sendContactMessage({
      name: form.name,
      email: form.email,
      phone: "",
      message: `Subject: ${form.subject}\n\n${form.message}`,
    });

    setSubmitting(false);
    setStatusMessage(result.message);

    if (result.ok) {
      setStatus("success");
      setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md pb-20 md:pb-0">
      <Header />

      <main className="flex-grow pt-20">
        {/* Hero */}
        <section className="relative h-[420px] flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center"
              role="img"
              aria-label="Dubai skyline at dusk"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAED-BsHYqaX2klSNZPiRBzzYzfK1z5bCTI6QcIAImwhDbmFLGBNDOUIjwWU4coVKyl0I59Ca7WEmNAgdzZ0G24ewP3P2thju__f9-V90UtkyYnuYbj5wyLctGwNk-yTjMrAZrkiqu_b7YZR0UCIngjLu8AKmjDw8k4wDdip1So8d45x8_pZD_KgSv1FgNghMwRnvg3YYHr98T4aYgAkOPivpTZYBIXSv3yFGg6UgwpJayArNz5cU7-')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/60 to-black/30" />
          </div>
          <div className="relative z-10 px-gutter pb-12 w-full max-w-container-max mx-auto">
            <h1 className="font-display-lg-mobile md:font-display-lg text-white leading-tight mb-4">
              Elevated Service, Always.
            </h1>
            <p className="font-body-md text-white/80 max-w-xl">
              Our dedicated concierge team is at your disposal for bookings, inquiries, and bespoke hospitality requirements.
            </p>
          </div>
        </section>

        {/* Form + Info */}
        <section className="max-w-container-max mx-auto px-gutter py-section-gap-sm md:py-section-gap-lg grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-7">
            <div className="mb-8">
              <h2 className="font-headline-md text-headline-md text-primary mb-2 relative inline-block pb-2">
                Get in Touch
                <span className="absolute bottom-0 left-0 w-16 h-[3px] bg-secondary" />
              </h2>
              <p className="font-body-md text-on-surface-variant mt-4 max-w-lg">
                Complete the form below and a luxury travel consultant will respond to your inquiry within 4 business hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full h-touch-target px-4 border border-outline-variant bg-white rounded-lg outline-none transition-all focus:border-primary focus:shadow-[0_0_0_1px_#000000]"
                  placeholder="Full Name"
                  type="text"
                />
              </div>

              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full h-touch-target px-4 border border-outline-variant bg-white rounded-lg outline-none transition-all focus:border-primary focus:shadow-[0_0_0_1px_#000000]"
                  placeholder="email@address.com"
                  type="email"
                />
              </div>

              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full h-touch-target px-4 border border-outline-variant bg-white rounded-lg outline-none transition-all focus:border-primary focus:shadow-[0_0_0_1px_#000000]"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 border border-outline-variant bg-white rounded-lg outline-none transition-all focus:border-primary focus:shadow-[0_0_0_1px_#000000] resize-none"
                  placeholder="How may we assist you today?"
                />
              </div>

              {status === "success" && <p className="text-green-700 text-sm">{statusMessage}</p>}
              {status === "error" && <p className="text-error text-sm">{statusMessage}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-touch-target bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-300 active:scale-[0.98] disabled:opacity-50 rounded-lg"
              >
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8 md:p-10">
              <h3 className="font-headline-md text-headline-md text-primary mb-8">Contact Information</h3>

              <div className="space-y-8">
                <DetailBlock icon="call" label="Phone" primary="+971 50 247 7593" secondary="Available 24/7 for active guests." />
                <DetailBlock icon="mail" label="Email" primary="info@dubailodgings.com" secondary="Response within 4 business hours." />
                <DetailBlock
                  icon="location_on"
                  label="Location"
                  primary={
                    <>
                      HDS Tower JLT
                      <br />
                      DIFC, Dubai, UAE
                    </>
                  }
                  secondary="By appointment only."
                />
              </div>

              <div className="mt-12 group cursor-pointer overflow-hidden border border-outline-variant rounded-lg">
               <div className="relative h-48 w-full bg-surface-container-high overflow-hidden">
  <div
    className="absolute inset-0 bg-cover bg-center grayscale opacity-80 transition-transform duration-700 group-hover:scale-105"
    role="img"
    aria-label="Map of DIFC Dubai"
    style={{
      backgroundImage:
        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDa_BmTdQMxTHS24myzcEr_Qx9lBgnoUoTpAdl8goE6th-XKYAgADvPSfeG64Zd-6H_VZ26bzECij_MRO17oXjZqRanbmNeWPmGg_VCcXOFOOWyl57DNa-1jluEnzdKJfvcyKwD3jzfZXLKnJQiKZpbK-OGogkKIOOWrb8XLAppwPOyq2vG6-HBkA16J5GTgXb8I18YcflMZwHjKjngGfbz6qbHWxAeBXS4TICkJUeeKVd948F5UNOQ')",
    }}
  />

  <a
    href="https://maps.google.com/?q=DIFC+Dubai"
    target="_blank"
    rel="noopener noreferrer"
    className="absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity group-hover:opacity-0"
  >
    <span className="bg-white px-4 py-2 font-label-caps text-label-caps shadow-lg">
      View On Map
    </span>
  </a>
</div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-primary text-on-primary py-section-gap-sm">
          <div className="max-w-container-max mx-auto px-gutter text-center">
            <h2 className="font-display-lg-mobile md:font-display-lg text-on-primary mb-6">Stay Inspired.</h2>
            <p className="font-body-md text-on-primary/80 mb-8 max-w-xl mx-auto">
              Join our private collection list for early access to the newest penthouse releases and exclusive DIFC event invites.
            </p>
            <NewsletterForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap-sm md:py-section-gap-lg bg-primary-container border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-gutter max-w-container-max mx-auto">
          <div className="md:col-span-1">
            <h4 className="font-display-lg-mobile text-display-lg-mobile text-on-primary mb-6 uppercase tracking-widest">DUBAILODGINGS</h4>
            <p className="font-body-sm text-on-primary-container leading-relaxed">
              Defining the standard of high-luxury accommodations in the heart of Dubai&apos;s financial district.
            </p>
          </div>
          <div className="md:col-span-1">
            <h5 className="font-label-caps text-label-caps text-on-primary mb-6">Company</h5>
            <ul className="space-y-4">
              <li><a className="font-body-sm text-on-primary-container hover:text-secondary-fixed transition-colors" href="/about-us">About Us</a></li>
              <li><a className="font-body-sm text-on-primary-container hover:text-secondary-fixed transition-colors" href="/terms-of-service">Terms of Service</a></li>
              <li><a className="font-body-sm text-on-primary-container hover:text-secondary-fixed transition-colors" href="/privacy-policy">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h5 className="font-label-caps text-label-caps text-on-primary mb-6">Support</h5>
            <ul className="space-y-4">
              <li><a className="font-body-sm text-on-primary-container hover:text-secondary-fixed transition-colors" href="/contact">Contact</a></li>
              <li><a className="font-body-sm text-on-primary-container hover:text-secondary-fixed transition-colors" href="#">Press</a></li>
              <li><a className="font-body-sm text-on-primary-container hover:text-secondary-fixed transition-colors" href="#">FAQs</a></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h5 className="font-label-caps text-label-caps text-on-primary mb-6">Connect</h5>
            <div className="flex gap-4">
              <a className="w-10 h-10 flex items-center justify-center border border-on-primary-container/30 text-on-primary hover:border-secondary transition-colors" href="#">
                <span className="material-symbols-outlined text-sm">share</span>
              </a>
              <a className="w-10 h-10 flex items-center justify-center border border-on-primary-container/30 text-on-primary hover:border-secondary transition-colors" href="#">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center border-t border-on-primary-container/20 pt-8 max-w-container-max mx-auto px-gutter">
          <p className="font-body-sm text-on-primary-container">© {new Date().getFullYear()} DUBAILODGINGS.COM. Luxury Reimagined.</p>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}

function DetailBlock({
  icon,
  label,
  primary,
  secondary,
}: {
  icon: string;
  label: string;
  primary: React.ReactNode;
  secondary: string;
}) {
  return (
    <div className="flex gap-6">
      <div className="w-12 h-12 flex items-center justify-center bg-secondary-container text-on-secondary-container rounded-full shrink-0">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-1">{label}</h4>
        <p className="font-body-lg text-body-lg text-primary">{primary}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{secondary}</p>
      </div>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to a real newsletter endpoint once one exists
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 500);
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-0 max-w-md mx-auto">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-grow h-touch-target px-6 bg-white/10 border border-white/20 focus:bg-white focus:text-primary transition-all text-on-primary outline-none font-body-sm"
        placeholder="Your premium email"
        type="email"
        required
      />
      <button
        type="submit"
        disabled={submitting}
        className="h-touch-target px-8 bg-secondary text-on-secondary-fixed font-label-caps text-label-caps hover:bg-secondary-fixed transition-colors disabled:opacity-50"
      >
        {submitting ? "…" : "Subscribe"}
      </button>
    </form>
  );
}