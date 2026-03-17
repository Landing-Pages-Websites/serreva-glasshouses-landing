"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import { useTracking } from "@/hooks/useTracking";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { Reveal } from "@/components/Reveal";

const PHONE = "(848) 400-5905";
const PHONE_HREF = "tel:8484005905";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, "").length === 10;
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const step = Math.ceil(target / 50);
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(current);
            }
          }, 25);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="font-display text-5xl md:text-6xl font-bold text-[#c9a64a]">
      {count}
      {suffix}
    </div>
  );
}

interface LeadFormProps {
  id?: string;
  dark?: boolean;
}

function LeadForm({ id = "hero-form", dark = false }: LeadFormProps) {
  const { submit, isSubmitting } = useMegaLeadForm();
  const [submitted, setSubmitted] = useState(false);
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
  });
  const [phoneError, setPhoneError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(fields.phone)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      return;
    }
    setPhoneError("");
    try {
      await submit(fields);
      setSubmitted(true);
    } catch {
      // silent
    }
  };

  const cardBg = dark
    ? "bg-[#0f1a2e]/90 border border-white/10"
    : "bg-white border border-[#e5e0d8]";
  const labelColor = dark ? "text-white" : "text-[#1a2640]";
  const inputBg = dark
    ? "bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-[#c9a64a]"
    : "bg-white border-[#d1cbc1] text-[#1a2640] placeholder-[#9ca3af] focus:border-[#c9a64a]";

  if (submitted) {
    return (
      <div className={`rounded-2xl p-8 shadow-2xl ${cardBg} text-center`}>
        <div className="w-16 h-16 bg-[#c9a64a]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#c9a64a]" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h4 className={`font-display text-2xl font-bold mb-2 ${dark ? "text-white" : "text-[#1a2640]"}`}>
          Proposal Request Received
        </h4>
        <p className={dark ? "text-white/70" : "text-[#6b7280]"}>
          Our design team will reach out within 24 hours to discuss your vision.
        </p>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={handleSubmit} className={`rounded-2xl p-8 shadow-2xl ${cardBg}`}>
      <h3 className={`font-display text-2xl font-bold mb-1 ${dark ? "text-white" : "text-[#1a2640]"}`}>
        Request Your Proposal
      </h3>
      <p className={`text-sm mb-6 ${dark ? "text-white/60" : "text-[#6b7280]"}`}>
        Tell us about your vision. We respond within 24 hours.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>First Name *</label>
          <input
            name="firstName"
            type="text"
            required
            placeholder="First Name"
            value={fields.firstName}
            onChange={(e) => setFields({ ...fields, firstName: e.target.value })}
            className={`w-full border-2 rounded-lg px-4 py-3 text-sm outline-none transition-colors ${inputBg}`}
          />
        </div>
        <div>
          <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>Last Name *</label>
          <input
            name="lastName"
            type="text"
            required
            placeholder="Last Name"
            value={fields.lastName}
            onChange={(e) => setFields({ ...fields, lastName: e.target.value })}
            className={`w-full border-2 rounded-lg px-4 py-3 text-sm outline-none transition-colors ${inputBg}`}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>Email *</label>
        <input
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          value={fields.email}
          onChange={(e) => setFields({ ...fields, email: e.target.value })}
          className={`w-full border-2 rounded-lg px-4 py-3 text-sm outline-none transition-colors ${inputBg}`}
        />
      </div>

      <div className="mb-3">
        <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>Phone *</label>
        <input
          name="phone"
          type="tel"
          inputMode="numeric"
          required
          placeholder="(555) 123-4567"
          value={fields.phone}
          onChange={(e) => {
            setFields({ ...fields, phone: formatPhone(e.target.value) });
            setPhoneError("");
          }}
          pattern="\(\d{3}\) \d{3}-\d{4}"
          className={`w-full border-2 rounded-lg px-4 py-3 text-sm outline-none transition-colors ${inputBg}`}
        />
        {phoneError && <p className="text-red-400 text-xs mt-1">{phoneError}</p>}
      </div>

      <div className="mb-6">
        <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>Project Type *</label>
        <select
          name="projectType"
          required
          value={fields.projectType}
          onChange={(e) => setFields({ ...fields, projectType: e.target.value })}
          className={`w-full border-2 rounded-lg px-4 py-3 text-sm outline-none transition-colors ${inputBg}`}
        >
          <option value="">Select Project Type</option>
          <option value="hotel-conservatory">Hotel Conservatory</option>
          <option value="resort-pavilion">Resort Pavilion</option>
          <option value="event-venue">Event Venue Glasshouse</option>
          <option value="restaurant-enclosure">Restaurant Enclosure</option>
          <option value="spa-wellness">Spa &amp; Wellness Structure</option>
          <option value="atrium">Grand Atrium</option>
          <option value="other">Other / Not Sure</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1a2640] text-white font-bold py-4 rounded-lg text-base hover:bg-[#243354] transition-all disabled:opacity-50 mb-3 tracking-wide"
      >
        {isSubmitting ? "Submitting..." : "Request Your Bespoke Proposal"}
      </button>
      <p className={`text-center text-xs ${dark ? "text-white/40" : "text-[#9ca3af]"}`}>
        No commitment required. Response within 24 hours.
      </p>
    </form>
  );
}

export default function LandingPage() {
  useTracking({ siteKey: "sk_placeholder" });

  const [floatingVisible, setFloatingVisible] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setFloatingVisible(window.scrollY > 900);
      setHeaderScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <QueryParamPersistence />

      {/* ── HEADER ────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          headerScrolled
            ? "bg-[#f8f6f1]/95 backdrop-blur-md border-b border-[#e5e0d8] shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Serreva Glasshouses"
              width={36}
              height={36}
              className="object-contain"
            />
            <span
              className={`font-display font-bold text-lg tracking-tight ${
                headerScrolled ? "text-[#1a2640]" : "text-white"
              }`}
            >
              Serreva <span className="font-normal opacity-70">Glasshouses</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={PHONE_HREF}
              className={`hidden sm:flex items-center gap-2 border-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                headerScrolled
                  ? "border-[#1a2640] text-[#1a2640] hover:bg-[#1a2640] hover:text-white"
                  : "border-white text-white hover:bg-white hover:text-[#1a2640]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
              </svg>
              {PHONE}
            </a>
            <a
              href="#contact"
              className="bg-[#c9a64a] text-[#1a2640] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#e8c97a] transition-all shadow-md"
            >
              Get Proposal
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center"
        style={{
          background: "linear-gradient(135deg, #0f1a2e 0%, #1a2640 50%, #0e2233 100%)",
        }}
      >
        {/* Background image overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/project-3.png"
            alt="Serreva luxury glasshouse"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1a2e]/90 via-[#0f1a2e]/70 to-[#0f1a2e]/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 border border-[#c9a64a]/40 bg-[#c9a64a]/10 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#c9a64a]" />
                <span className="text-[#c9a64a] text-xs font-semibold tracking-widest uppercase">
                  Luxury Hospitality Structures
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
                Bespoke Glass<br />
                Structures for<br />
                <span className="text-[#c9a64a]">World&#8209;Class</span><br />
                Venues
              </h1>

              <p className="text-white/70 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
                Transform your hotel, resort, or event property with a custom-engineered glasshouse that
                captivates guests and creates experiences they remember for life.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#c9a64a] text-[#1a2640] px-7 py-4 rounded-lg font-bold text-base hover:bg-[#e8c97a] transition-all shadow-lg"
                >
                  Request Your Proposal
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-7 py-4 rounded-lg font-semibold text-base hover:border-white hover:bg-white/10 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
                  </svg>
                  {PHONE}
                </a>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#c9a64a]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white/70 text-sm">10+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#c9a64a]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white/70 text-sm">Turnkey Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#c9a64a]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white/70 text-sm">4 Continents</span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:max-w-md w-full">
              <LeadForm id="hero-form" dark />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section id="stats" className="bg-[#1a2640] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 10, suffix: "+", label: "Years Engineering Excellence" },
              { value: 4, suffix: "", label: "Continents, One Standard of Quality" },
              { value: 100, suffix: "%", label: "Turnkey Delivery — Design to Install" },
              { value: 5, suffix: "", label: "Integrated Disciplines, Zero Handoffs" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 100}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-white/60 text-sm mt-2 leading-snug">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT SHOWCASE ──────────────────────────────────── */}
      <section id="portfolio" className="py-20 bg-[#f8f6f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-[#c9a64a] text-xs font-bold tracking-widest uppercase">Hospitality Portfolio</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2640] mt-3 mb-4">
                Built for Landmark Properties
              </h2>
              <p className="text-[#6b7280] text-lg max-w-2xl mx-auto">
                Each Serreva structure is designed to become a defining feature of your property — a landmark
                guests return for, photograph, and remember.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                src: "/images/project-1.png",
                title: "The Estelle",
                type: "Event Venue Glasshouse",
                desc: "An immersive event venue glasshouse designed for intimate celebrations and grand receptions alike.",
              },
              {
                src: "/images/project-2.png",
                title: "Resort Conservatory",
                type: "Hotel Conservatory",
                desc: "A full-span conservatory integrated into an existing resort wing, expanding capacity by 200 guests.",
              },
              {
                src: "/images/project-3.png",
                title: "Grand Pavilion",
                type: "Resort Pavilion",
                desc: "A sculptural freestanding pavilion serving as the resort's centrepiece outdoor dining venue.",
              },
            ].map((project, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="group relative overflow-hidden rounded-2xl shadow-lg bg-[#1a2640]">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={project.src}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a2e]/80 to-transparent" />
                  </div>
                  <div className="p-6">
                    <span className="text-[#c9a64a] text-xs font-bold tracking-widest uppercase">{project.type}</span>
                    <h3 className="font-display text-xl font-bold text-white mt-1 mb-2">{project.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{project.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                src: "/images/project-4.png",
                title: "Spa & Wellness Atrium",
                type: "Spa Structure",
                desc: "A light-filled wellness atrium connecting indoor spa facilities to the landscape beyond.",
              },
              {
                src: "/images/venue-1.jpg",
                title: "Hotel Restaurant Enclosure",
                type: "Restaurant Enclosure",
                desc: "Year-round alfresco dining in a climate-controlled glass enclosure for a five-star hotel.",
              },
            ].map((project, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="group relative overflow-hidden rounded-2xl shadow-lg bg-[#1a2640]">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={project.src}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a2e]/80 to-transparent" />
                  </div>
                  <div className="p-6">
                    <span className="text-[#c9a64a] text-xs font-bold tracking-widest uppercase">{project.type}</span>
                    <h3 className="font-display text-xl font-bold text-white mt-1 mb-2">{project.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{project.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────── */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-[#c9a64a] text-xs font-bold tracking-widest uppercase">Hospitality Services</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2640] mt-3 mb-4">
                Structures Built for Every Venue
              </h2>
              <p className="text-[#6b7280] text-lg max-w-2xl mx-auto">
                From intimate hotel conservatories to grand event venue glasshouses, every Serreva structure
                is engineered to your property&apos;s exact requirements.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                ),
                title: "Hotel Conservatories",
                capacity: "Seats 50–500+ guests",
                desc: "Integrated conservatory wings that expand your hotel&apos;s footprint and become a signature amenity. Custom climate control ensures year-round use regardless of weather.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                ),
                title: "Resort Pavilions",
                capacity: "Freestanding from 200 sq ft",
                desc: "Sculptural glass pavilions that transform resort grounds into destination experiences. Perfect as poolside dining, spa extensions, or exclusive event spaces.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                ),
                title: "Event Venue Glasshouses",
                capacity: "200–1,000+ event capacity",
                desc: "Purpose-built glasshouse venues for weddings, galas, and private events. Designed for dramatic impact, flexible floor plans, and guest flow that feels effortless.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 20.488l-.023.021A6.75 6.75 0 016.75 18l-.022.021M12 20.488V18.75m0 1.738c.663 0 1.318-.028 1.96-.083.24-.022.426-.24.426-.48v-.738M12 18.75a2.25 2.25 0 00-2.25 2.25v.24c0 .24.186.458.426.48A21.073 21.073 0 0012 21.75" />
                  </svg>
                ),
                title: "Restaurant Enclosures",
                capacity: "All-season dining, any climate",
                desc: "Year-round glass dining enclosures that keep alfresco experiences alive in any weather. HVAC-integrated to maintain perfect dining temperatures from desert heat to mountain winters.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ),
                title: "Spa & Wellness Structures",
                capacity: "Tranquil light-filled sanctuaries",
                desc: "Light-optimised glass structures designed for spa suites, meditation gardens, and wellness retreats. Shading systems, acoustic glass, and privacy configurations available.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                ),
                title: "Grand Atriums",
                capacity: "Transformative interior architecture",
                desc: "Steel and glass atriums that open your property&apos;s interior to the sky, creating dramatic arrival experiences and light-filled communal spaces for guests and visitors.",
              },
            ].map((service, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="p-7 rounded-2xl border border-[#e5e0d8] bg-[#f8f6f1] hover:border-[#c9a64a] hover:shadow-lg transition-all duration-300 group h-full">
                  <div className="w-14 h-14 bg-[#1a2640] rounded-xl flex items-center justify-center text-[#c9a64a] mb-5 group-hover:bg-[#c9a64a] group-hover:text-[#1a2640] transition-all duration-300">
                    {service.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#1a2640] mb-1">{service.title}</h3>
                  <p className="text-[#c9a64a] text-xs font-semibold tracking-wide mb-3">{service.capacity}</p>
                  <p
                    className="text-[#6b7280] text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: service.desc }}
                  />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="text-center mt-12">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-[#1a2640] text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-[#243354] transition-all shadow-md"
              >
                Discuss Your Project
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CLIMATE CONTROL USP ───────────────────────────────── */}
      <section id="climate" className="py-20 bg-[#0f1a2e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/hotel-2.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <Reveal>
              <div>
                <span className="text-[#c9a64a] text-xs font-bold tracking-widest uppercase">
                  The Serreva Difference
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3 mb-6 leading-tight">
                  Engineered for<br />
                  <span className="text-[#c9a64a]">Any Climate.</span><br />
                  Any Continent.
                </h2>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">
                  A decade of installing glasshouses across four continents taught us one truth: beautiful glass
                  means nothing if guests are uncomfortable. Every Serreva structure includes a fully integrated
                  climate control system — custom-designed for your location and use case.
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-[#c9a64a] text-[#1a2640] px-7 py-4 rounded-lg font-bold text-base hover:bg-[#e8c97a] transition-all"
                >
                  Get a Custom Climate Assessment
                </a>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "Custom HVAC Systems",
                  desc: "Purpose-built heating and cooling integrated invisibly into the structure itself. No exposed ductwork, no compromised aesthetics.",
                },
                {
                  title: "Automated Shading",
                  desc: "Motorised shading systems that respond to sun position and temperature, maintaining perfect light levels throughout the day.",
                },
                {
                  title: "Acoustic Glass Options",
                  desc: "Specialised glazing configurations that provide sound isolation for spa environments, intimate dining, and event privacy.",
                },
                {
                  title: "All-Season Performance",
                  desc: "From -30°C mountain winters to 45°C desert summers — our structures are engineered for your specific climate zone.",
                },
              ].map((feature, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-[#c9a64a]/40 transition-all">
                    <div className="w-8 h-8 bg-[#c9a64a]/20 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-4 h-4 text-[#c9a64a]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-2">{feature.title}</h4>
                    <p className="text-white/50 text-xs leading-relaxed">{feature.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────── */}
      <section id="process" className="py-20 bg-[#f0eae0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-[#c9a64a] text-xs font-bold tracking-widest uppercase">Our Process</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2640] mt-3 mb-4">
                How a Serreva Space<br />Comes to Life
              </h2>
              <p className="text-[#6b7280] text-lg max-w-xl mx-auto">
                A fully guided process — from first conversation to the moment guests step inside.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                step: "01",
                title: "Discovery",
                desc: "We begin with your vision — how you imagine the space and how it should feel within your existing property.",
              },
              {
                step: "02",
                title: "Design",
                desc: "Your vision transforms into form through proportion studies, site analysis, and bespoke architectural concepts.",
              },
              {
                step: "03",
                title: "Engineering",
                desc: "Our engineering team develops the structure from foundation to final pane — climate performance refined for longevity.",
              },
              {
                step: "04",
                title: "Construction",
                desc: "Fabricated components assembled on-site with controlled craftsmanship and coordinated delivery to your schedule.",
              },
              {
                step: "05",
                title: "Completion",
                desc: "The space settles into your property and becomes part of the guest experience — complete, ready, and filled with light.",
              },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="text-center relative">
                  {i < 4 && (
                    <div className="hidden md:block absolute top-7 left-1/2 w-full h-0.5 bg-[#c9a64a]/20" />
                  )}
                  <div className="relative inline-flex items-center justify-center w-14 h-14 bg-[#1a2640] rounded-full mb-4 font-display text-[#c9a64a] font-bold text-lg">
                    {step.step}
                  </div>
                  <h4 className="font-display text-lg font-bold text-[#1a2640] mb-2">{step.title}</h4>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ───────────────────────────────────────── */}
      <section id="testimonials" className="py-20 bg-[#1a2640]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-10">
              <span className="text-[#c9a64a] text-xs font-bold tracking-widest uppercase">Client Experience</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">
                Built With Precision.<br />Delivered With Care.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-10 md:p-14">
              <div className="absolute top-8 left-10 text-[#c9a64a]/30 font-display text-9xl leading-none select-none">
                &ldquo;
              </div>
              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#c9a64a]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="font-display text-xl md:text-2xl text-white leading-relaxed mb-8 italic">
                  From the first conversation to final installation, Serreva proved to be more than a builder
                  — they became a true project partner. Their team brought deep engineering expertise,
                  exceptional craftsmanship, and a collaborative approach that made even the most ambitious
                  ideas feel achievable. Every detail was thoughtfully considered, from structural performance
                  to climate conditions, ensuring the glasshouse would thrive through extreme heat, cold, and
                  changing light. The result is not just a glasshouse, but a landmark — a structure that
                  elevates the entire property and redefines what&apos;s possible through glass architecture.
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#c9a64a]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#c9a64a] font-display font-bold text-lg">H</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Hospitality Director</p>
                    <p className="text-white/50 text-sm">Luxury Resort — Europe</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── WHY SERREVA ───────────────────────────────────────── */}
      <section id="why" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <Reveal>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/venue-2.jpg"
                    alt="Serreva hospitality installation"
                    width={600}
                    height={480}
                    className="object-cover w-full"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#1a2640] rounded-2xl p-6 shadow-2xl max-w-xs">
                  <p className="text-[#c9a64a] font-display text-3xl font-bold">Only Provider</p>
                  <p className="text-white/70 text-sm mt-1">
                    Turnkey glasshouse engineering and installation for hospitality
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div>
                <span className="text-[#c9a64a] text-xs font-bold tracking-widest uppercase">
                  Why Serreva
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2640] mt-3 mb-6 leading-tight">
                  The Only Dedicated<br />
                  <span className="text-[#c9a64a]">Turnkey Provider</span><br />
                  for Hospitality
                </h2>
                <p className="text-[#6b7280] text-lg mb-8 leading-relaxed">
                  Most glass structure companies are manufacturers or contractors — not both. Serreva is the only
                  dedicated turnkey provider of luxury glasshouse engineering and installation, with a background
                  in industrial agricultural greenhouses spanning 10+ years across 4 continents.
                </p>

                <div className="space-y-4">
                  {[
                    "Design, engineering, fabrication, and installation under one roof",
                    "Background: 10+ years, 4 continents of glasshouse delivery",
                    "Custom climate control systems — HVAC and automated shading standard",
                    "Structures built to endure shifting climates and age with grace",
                    "Fully integrated process — zero handoffs, zero quality gaps",
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#c9a64a]/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-[#c9a64a]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-[#1a2640] text-base">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CONTACT / SECOND FORM ─────────────────────────────── */}
      <section id="contact" className="py-20 bg-[#f8f6f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <Reveal>
              <div>
                <span className="text-[#c9a64a] text-xs font-bold tracking-widest uppercase">
                  Start Your Project
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2640] mt-3 mb-6 leading-tight">
                  Let&apos;s Design a Space<br />
                  <span className="text-[#c9a64a]">That Defines</span><br />
                  Your Property
                </h2>
                <p className="text-[#6b7280] text-lg mb-8 leading-relaxed">
                  Every Serreva project begins with a conversation. Tell us about your property, your vision,
                  and the experience you want to create. We&apos;ll respond within 24 hours.
                </p>

                <div className="space-y-5">
                  {[
                    {
                      icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
                        </svg>
                      ),
                      label: "Call us directly",
                      value: PHONE,
                      href: PHONE_HREF,
                    },
                    {
                      icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      label: "Response time",
                      value: "Within 24 hours",
                      href: null,
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-[#1a2640] rounded-xl flex items-center justify-center text-[#c9a64a] flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[#6b7280] text-xs font-medium">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-[#1a2640] font-semibold hover:text-[#c9a64a] transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-[#1a2640] font-semibold">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <LeadForm id="contact-form" dark={false} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-[#0f1a2e] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/images/logo.png" alt="Serreva Glasshouses" width={28} height={28} className="object-contain opacity-70" />
            <span className="font-display text-white/70 font-medium">Serreva Glasshouses</span>
          </div>
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Serreva Glasshouses. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── FLOATING CTA ──────────────────────────────────────── */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          floatingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        }`}
      >
        <a
          href="#contact"
          className="flex items-center gap-3 bg-[#1a2640] text-white px-7 py-3.5 rounded-full shadow-2xl font-semibold text-sm hover:bg-[#243354] transition-all border border-white/10 whitespace-nowrap"
        >
          <span className="w-2 h-2 rounded-full bg-[#c9a64a] animate-pulse" />
          Request Your Bespoke Proposal
          <svg className="w-4 h-4 text-[#c9a64a]" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
    </>
  );
}
