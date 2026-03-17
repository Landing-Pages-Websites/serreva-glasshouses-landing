"use client";

import { useState } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { Reveal } from "@/components/Reveal";

export default function LandingPage() {
  const { submit: submitLead, isSubmitting } = useMegaLeadForm();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    projectSize: "",
    glasshouseType: "",
    describe: ""
  });

  const PHONE = "(848) 400-5905";
  const PHONE_HREF = "tel:8484005905";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await submitLead({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        needsType: formData.glasshouseType,
        message: `Company: ${formData.company}. Project Size: ${formData.projectSize}. Description: ${formData.describe}`.trim()
      });
      alert("Thank you! We'll be in touch soon to discuss your project.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        projectSize: "",
        glasshouseType: "",
        describe: ""
      });
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  const LeadForm = () => (
    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border">
      <h3 className="font-display text-2xl font-bold mb-4 text-primary">Request Your Proposal</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="firstname"
          placeholder="First Name *"
          required
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name *"
          required
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="email"
          name="email"
          placeholder="Email *"
          required
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="company"
          placeholder="Company/Organization"
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
        <input
          type="text"
          name="project_size"
          placeholder="Project Size (sq ft)"
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.projectSize}
          onChange={(e) => setFormData({ ...formData, projectSize: e.target.value })}
        />
      </div>

      <select
        name="glasshouse_type"
        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none mb-4"
        value={formData.glasshouseType}
        onChange={(e) => setFormData({ ...formData, glasshouseType: e.target.value })}
      >
        <option value="">Glasshouse Type</option>
        <option value="hotel-conservatory">Hotel Conservatory</option>
        <option value="resort-pavilion">Resort Pavilion</option>
        <option value="event-venue">Event Venue</option>
        <option value="restaurant">Restaurant Enclosure</option>
        <option value="other">Other</option>
      </select>

      <textarea
        name="describe"
        placeholder="Describe your project vision and requirements"
        rows={4}
        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none mb-4"
        value={formData.describe}
        onChange={(e) => setFormData({ ...formData, describe: e.target.value })}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white font-semibold py-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 mb-4"
      >
        {isSubmitting ? "Submitting..." : "Request Proposal"}
      </button>

      <div className="text-center">
        <a
          href={PHONE_HREF}
          className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
        >
          Or call {PHONE}
        </a>
      </div>
    </form>
  );

  const DualCTA = ({ primary, href }: { primary: string; href: string }) => (
    <div className="flex flex-col items-center gap-4 mt-8">
      <a
        href={href}
        className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90"
      >
        {primary}
      </a>
      <a
        href={PHONE_HREF}
        className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
      >
        Or call {PHONE}
      </a>
    </div>
  );

  return (
    <>
      <QueryParamPersistence />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-display text-2xl font-bold text-primary">
            SERREVA GLASSHOUSES
          </div>
          <div className="flex items-center gap-4">
            <a
              href={PHONE_HREF}
              className="hidden sm:flex items-center border-2 border-primary text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              {PHONE}
            </a>
            <a
              href="#contact"
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90"
            >
              Get Proposal
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 pt-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal>
              <h1 className="font-display text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                LUXURY GLASSHOUSES FOR HOSPITALITY
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Transform your hotel, resort, or event venue with bespoke glasshouse structures. From intimate conservatories to grand pavilions, we create architectural masterpieces that captivate guests and elevate experiences.
              </p>
            </Reveal>
            <Reveal delay={400}>
              <DualCTA primary="Request Proposal" href="#contact" />
            </Reveal>
          </div>
          <div>
            <Reveal delay={600}>
              <LeadForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-2">20+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-2">150+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-gray-600">Luxury Hotels</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-gray-600">Custom Design</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <h2 className="font-display text-5xl font-bold text-center mb-4">
              HOSPITALITY GLASSHOUSE SOLUTIONS
            </h2>
            <p className="text-xl text-center text-gray-600 mb-16">
              Bespoke structures designed for the hospitality industry
            </p>
          </Reveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Hotel Conservatories", 
                desc: "Elegant glass conservatories for hotel lobbies, restaurants, and relaxation spaces",
                capacity: "50-500 guests"
              },
              { 
                title: "Resort Pavilions", 
                desc: "Grand pavilions for outdoor dining, events, and guest experiences at luxury resorts",
                capacity: "100-1000 guests"
              },
              { 
                title: "Event Venue Glasshouses", 
                desc: "Stunning glass venues for weddings, corporate events, and special occasions",
                capacity: "50-800 guests"
              },
              { 
                title: "Restaurant Enclosures", 
                desc: "Year-round outdoor dining spaces with retractable glass walls and climate control",
                capacity: "20-200 guests"
              },
              { 
                title: "Spa & Wellness", 
                desc: "Tranquil glass structures for spa treatments, yoga, and wellness experiences",
                capacity: "10-100 guests"
              },
              { 
                title: "Pool & Garden", 
                desc: "Glass pool houses and garden pavilions for resort amenities and guest relaxation",
                capacity: "Variable"
              }
            ].map((service, index) => (
              <Reveal key={service.title} delay={index * 100}>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="font-display text-2xl font-bold text-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.desc}</p>
                  <div className="text-sm text-secondary font-medium mb-6">
                    Capacity: {service.capacity}
                  </div>
                  <DualCTA primary="Learn More" href="#contact" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <h2 className="font-display text-5xl font-bold mb-6">
                CRAFTING ARCHITECTURAL MASTERPIECES
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                For over two decades, Serreva Glasshouses has specialized in creating bespoke glass structures that redefine hospitality experiences. Our team of architects, engineers, and craftspeople work exclusively with luxury hotels, resorts, and event venues.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Each project is custom-designed to complement your property's architecture while creating unforgettable spaces for your guests. From intimate conservatories to grand event pavilions, we bring your vision to life with precision and artistry.
              </p>
              <DualCTA primary="View Portfolio" href="#contact" />
            </Reveal>
            <Reveal delay={300}>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8">
                <h3 className="font-display text-3xl font-bold text-primary mb-6">
                  WHAT SETS US APART
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-secondary mr-3">✓</span>
                    100% custom design and engineering
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3">✓</span>
                    Premium materials and finishes
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3">✓</span>
                    Climate control integration
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3">✓</span>
                    Hospitality-focused design
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3">✓</span>
                    White-glove project management
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <h2 className="font-display text-5xl font-bold text-center mb-16">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </Reveal>

          <div className="space-y-6">
            {[
              {
                q: "What types of properties do you work with?",
                a: "We specialize exclusively in hospitality properties including luxury hotels, resorts, event venues, restaurants, and corporate retreat centers."
              },
              {
                q: "How long does a typical project take?",
                a: "Project timelines vary based on size and complexity, typically ranging from 3-12 months from design approval to completion. We work closely with your timeline and operational needs."
              },
              {
                q: "Do you handle permits and approvals?",
                a: "Yes, our team manages all necessary permits, engineering approvals, and regulatory compliance for your project."
              },
              {
                q: "Can the structures handle extreme weather?",
                a: "Absolutely. Our glasshouses are engineered to meet local building codes and withstand regional climate conditions while maintaining aesthetic beauty."
              },
              {
                q: "Do you provide climate control integration?",
                a: "Yes, we integrate HVAC, lighting, and audio systems to ensure year-round comfort and functionality for your guests."
              }
            ].map((faq, index) => (
              <Reveal key={index} delay={index * 100}>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="font-display text-xl font-bold text-primary mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={600}>
            <div className="text-center mt-12">
              <DualCTA primary="Discuss Your Project" href="#contact" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="font-display text-5xl font-bold mb-6">
              READY TO CREATE SOMETHING EXTRAORDINARY?
            </h2>
            <p className="text-xl mb-12 opacity-90">
              Transform your hospitality property with a custom glasshouse designed to captivate and inspire. Let's discuss your vision.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="max-w-2xl mx-auto">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white text-center">
        <p className="text-sm opacity-75">
          © 2026 Serreva Glasshouses. All rights reserved.
        </p>
      </footer>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          href="#contact"
          className="bg-secondary text-white px-6 py-4 rounded-full font-semibold shadow-lg hover:bg-secondary/90 transition-colors"
        >
          Get Proposal
        </a>
        <a
          href={PHONE_HREF}
          className="bg-primary text-white px-6 py-4 rounded-full font-semibold shadow-lg hover:bg-primary/90 transition-colors text-center"
        >
          {PHONE}
        </a>
      </div>
    </>
  );
}