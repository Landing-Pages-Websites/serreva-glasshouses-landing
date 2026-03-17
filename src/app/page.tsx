"use client";

import { useState, useEffect, useRef } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { Reveal } from "@/components/Reveal";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let current = 0;
        const step = Math.ceil(target / 40);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) { setCount(target); clearInterval(interval); }
          else setCount(current);
        }, 30);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <div ref={ref} className="font-display text-5xl md:text-6xl font-bold text-gold">{count}{suffix}</div>;
}

export default function LandingPage() {
  const PHONE = "(848) 400-5905";
  const PHONE_HREF = "tel:8484005905";
  const { submit: submitLead, isSubmitting } = useMegaLeadForm();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", company: "", projectSize: "", glasshouseType: "", describe: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowFloating(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) return;
    try {
      await submitLead({
        firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone,
        needsType: formData.glasshouseType,
        message: `Company: ${formData.company}. Size: ${formData.projectSize}. ${formData.describe}`.trim()
      });
      setSubmitted(true);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", company: "", projectSize: "", glasshouseType: "", describe: "" });
    } catch { /* fail silently */ }
  };

  const LeadForm = ({ id = "hero-form" }: { id?: string }) => (
    <form id={id} onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
      <h3 className="font-display text-3xl font-bold mb-2 text-primary">Request Your Proposal</h3>
      <p className="text-text-muted mb-6 text-sm">Tell us about your vision and we will craft a bespoke solution.</p>
      {submitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <h4 className="font-display text-2xl font-bold text-primary mb-2">Proposal Request Received</h4>
          <p className="text-text-muted">Our design team will contact you within 24 hours.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="text" name="firstname" placeholder="First Name *" required className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary outline-none transition-colors" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            <input type="text" name="lastname" placeholder="Last Name *" required className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary outline-none transition-colors" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="email" name="email" placeholder="Email *" required className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary outline-none transition-colors" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input type="tel" name="phone" placeholder="Phone" className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary outline-none transition-colors" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="text" name="company" placeholder="Company / Organization" className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary outline-none transition-colors" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            <input type="text" name="project_size" placeholder="Project Size (sq ft)" className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary outline-none transition-colors" value={formData.projectSize} onChange={(e) => setFormData({ ...formData, projectSize: e.target.value })} />
          </div>
          <select name="glasshouse_type" className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary outline-none transition-colors mb-3" value={formData.glasshouseType} onChange={(e) => setFormData({ ...formData, glasshouseType: e.target.value })}>
            <option value="">Glasshouse Type</option>
            <option value="hotel-conservatory">Hotel Conservatory</option>
            <option value="resort-pavilion">Resort Pavilion</option>
            <option value="event-venue">Event Venue Glasshouse</option>
            <option value="restaurant">Restaurant Enclosure</option>
            <option value="spa-wellness">Spa and Wellness</option>
            <option value="other">Other</option>
          </select>
          <textarea name="describe" placeholder="Describe your project vision and requirements" rows={3} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary outline-none transition-colors mb-4" value={formData.describe} onChange={(e) => setFormData({ ...formData, describe: e.target.value })} />
          <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-4 rounded-lg text-lg hover:bg-primary/90 transition-all disabled:opacity-50 mb-3">
            {isSubmitting ? "Submitting..." : "Request Your Proposal"}
          </button>
          <div className="text-center">
            <a href={PHONE_HREF} className="inline-block border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all">
              Or call {PHONE}
            </a>
          </div>
        </>
      )}
    </form>
  );

  const DualCTA = ({ primary, href }: { primary: string; href: string }) => (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
      <a href={href} className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all">{primary}</a>
      <a href={PHONE_HREF} className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all">
        Call {PHONE}
      </a>
    </div>
  );

  return (
    <>
      <QueryParamPersistence />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-cream/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-display text-2xl font-bold text-primary tracking-tight">Serreva <span className="font-normal text-text-muted">Glasshouses</span></div>
          <div className="flex items-center gap-4">
            <a href={PHONE_HREF} className="hidden sm:flex items-center border-2 border-primary text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all text-sm">{PHONE}</a>
            <a href="#hero-form" className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all">Get Proposal</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="min-h-screen pt-20 flex items-center bg-gradient-to-br from-primary via-dark to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 border border-gold/30 rounded-full" />
          <div className="absolute bottom-20 left-20 w-64 h-64 border border-gold/20 rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10 py-12">
          <div>
            <Reveal>
              <div className="inline-block border border-gold/50 text-gold px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider mb-6">
                Luxury Hospitality Structures
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Bespoke Glasshouses for World-Class Venues
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Transform your hotel, resort, or event venue with custom-designed glasshouse structures that captivate guests and create unforgettable experiences.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <a href="#hero-form" className="bg-gold text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gold/90 transition-all">Request Proposal</a>
                <a href={PHONE_HREF} className="border-2 border-white/30 text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-all">Call {PHONE}</a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={400}>
            <LeadForm />
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div><AnimatedCounter target={20} suffix="+" /><div className="text-text-muted mt-2 text-sm tracking-wider">Years Experience</div></div>
              <div><AnimatedCounter target={150} suffix="+" /><div className="text-text-muted mt-2 text-sm tracking-wider">Projects Completed</div></div>
              <div><AnimatedCounter target={50} suffix="+" /><div className="text-text-muted mt-2 text-sm tracking-wider">Luxury Hotels</div></div>
              <div><AnimatedCounter target={12} /><div className="text-text-muted mt-2 text-sm tracking-wider">Countries</div></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-gold tracking-[0.2em] text-sm font-semibold mb-4">Our Expertise</div>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-primary">Hospitality Glasshouse Solutions</h2>
              <p className="text-text-muted mt-4 text-lg max-w-2xl mx-auto">Bespoke structures designed exclusively for the hospitality industry.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Hotel Conservatories", desc: "Elegant glass conservatories for hotel lobbies, dining rooms, and relaxation spaces. Seamless integration with existing architecture.", capacity: "50 - 500 guests" },
              { title: "Resort Pavilions", desc: "Grand pavilions for outdoor dining, poolside events, and guest experiences at luxury resorts worldwide.", capacity: "100 - 1,000 guests" },
              { title: "Event Venue Glasshouses", desc: "Stunning glass venues for weddings, galas, corporate events, and exclusive occasions. Year-round use with climate control.", capacity: "50 - 800 guests" },
              { title: "Restaurant Enclosures", desc: "Retractable glass walls and climate-controlled dining spaces that extend your restaurant into the outdoors.", capacity: "20 - 200 guests" },
              { title: "Spa and Wellness", desc: "Tranquil glass structures for spa treatments, yoga studios, and wellness retreats. Natural light meets controlled comfort.", capacity: "10 - 100 guests" },
              { title: "Rooftop Structures", desc: "Elevated glass pavilions and rooftop conservatories offering panoramic views for dining, events, or guest amenities.", capacity: "30 - 300 guests" }
            ].map((service, index) => (
              <Reveal key={service.title} delay={index * 80}>
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                  <h3 className="font-display text-2xl font-bold text-primary mb-3">{service.title}</h3>
                  <p className="text-text-muted leading-relaxed mb-4">{service.desc}</p>
                  <div className="text-sm text-secondary font-medium">Capacity: {service.capacity}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <DualCTA primary="Discuss Your Project" href="#contact" />
        </div>
      </section>

      {/* Why Serreva */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <div className="text-gold tracking-[0.2em] text-sm font-semibold mb-4">Why Serreva</div>
                <h2 className="font-display text-5xl font-bold text-primary mb-6">Crafting Architectural Masterpieces</h2>
                <p className="text-text-muted text-lg mb-6 leading-relaxed">
                  For over two decades, Serreva Glasshouses has specialized in creating bespoke glass structures that redefine hospitality experiences. Our team of architects, engineers, and artisans work exclusively with luxury hotels, resorts, and event venues around the world.
                </p>
                <p className="text-text-muted text-lg mb-8 leading-relaxed">
                  Each project is custom-designed to complement your property&apos;s architecture while creating unforgettable spaces that guests remember long after their stay.
                </p>
                <div className="space-y-4">
                  {["100% custom design and engineering for every project", "Premium materials and finishes sourced globally", "Integrated climate control, lighting, and acoustics", "White-glove project management from concept to completion", "Dedicated hospitality design specialists"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <span className="text-text-dark">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="bg-primary text-white rounded-2xl p-10">
                <h3 className="font-display text-3xl font-bold mb-8">The Serreva Difference</h3>
                <div className="space-y-8">
                  <div className="border-b border-white/10 pb-6">
                    <div className="font-display text-4xl font-bold text-gold">Bespoke Design</div>
                    <p className="text-gray-300 mt-2">No templates. Every structure is designed from scratch for your property.</p>
                  </div>
                  <div className="border-b border-white/10 pb-6">
                    <div className="font-display text-4xl font-bold text-gold">Engineering Excellence</div>
                    <p className="text-gray-300 mt-2">Structural engineering for any climate, from tropical to subarctic.</p>
                  </div>
                  <div>
                    <div className="font-display text-4xl font-bold text-gold">Turnkey Delivery</div>
                    <p className="text-gray-300 mt-2">Design, permits, fabrication, installation, and aftercare. One team.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-gold tracking-[0.2em] text-sm font-semibold mb-4">Our Process</div>
              <h2 className="font-display text-5xl font-bold text-primary">From Vision to Reality</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", desc: "We visit your property, understand your vision, guest experience goals, and architectural context." },
              { step: "02", title: "Design", desc: "Our architects create bespoke designs with 3D renderings, material selections, and engineering specifications." },
              { step: "03", title: "Fabrication", desc: "Premium materials are precision-fabricated at our facilities, with rigorous quality control at every stage." },
              { step: "04", title: "Installation", desc: "Our specialist team installs your glasshouse with minimal disruption to hotel operations. Typically 4-12 weeks." }
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 150}>
                <div className="text-center">
                  <div className="font-display text-7xl font-bold text-gold/20 mb-4">{item.step}</div>
                  <h3 className="font-display text-xl font-bold text-primary mb-3">{item.title}</h3>
                  <p className="text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section id="audience" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-gold tracking-[0.2em] text-sm font-semibold mb-4">Who We Serve</div>
              <h2 className="font-display text-5xl font-bold text-primary">Built for Hospitality Leaders</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Hotel Owners and Groups", desc: "Differentiate your property with a signature glasshouse space. Increase revenue from events, dining, and guest experiences." },
              { title: "Resort Ownership Groups", desc: "Create world-class amenities that justify premium rates and earn repeat visits from discerning travelers." },
              { title: "Event Directors", desc: "Offer a venue that sells itself. Our glasshouses create the backdrop for unforgettable weddings, galas, and corporate events." },
              { title: "Hospitality Developers", desc: "Integrate architectural glass features from the ground up. We collaborate with your design team from day one." },
              { title: "Architects and Designers", desc: "Partner with our structural engineers to realize ambitious glass designs that meet every building code and timeline." },
              { title: "Restaurant Groups", desc: "Extend dining capacity year-round with glass-enclosed spaces that preserve the outdoor experience in any weather." }
            ].map((audience, index) => (
              <Reveal key={audience.title} delay={index * 80}>
                <div className="bg-cream rounded-2xl p-8 border border-gray-100">
                  <h3 className="font-display text-xl font-bold text-primary mb-3">{audience.title}</h3>
                  <p className="text-text-muted leading-relaxed">{audience.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <DualCTA primary="Start a Conversation" href="#contact" />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-gold tracking-[0.2em] text-sm font-semibold mb-4">Client Testimonials</div>
              <h2 className="font-display text-5xl font-bold text-primary">Trusted by World-Class Venues</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "The conservatory Serreva designed for our lobby has become the signature feature of our hotel. Guests specifically request rooms overlooking it. It paid for itself in the first year through event bookings alone.", name: "James M.", role: "General Manager, Boutique Hotel Collection" },
              { quote: "Working with Serreva was seamless. They understood our vision immediately and delivered a pavilion that exceeded our expectations. The structural engineering for our coastal location was flawless.", name: "Elena K.", role: "VP Operations, Luxury Resort Group" },
              { quote: "Our event venue glasshouse books 18 months in advance for weddings. It is the most photographed feature of our property and the single best investment we have made in guest experience.", name: "David R.", role: "Owner, Estate Venue" }
            ].map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 100}>
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-text-dark mb-6 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <div className="font-bold text-primary">{testimonial.name}</div>
                    <div className="text-text-muted text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-gold tracking-[0.2em] text-sm font-semibold mb-4">FAQ</div>
              <h2 className="font-display text-5xl font-bold text-primary">Common Questions</h2>
            </div>
          </Reveal>
          <div className="space-y-4">
            {[
              { q: "What types of hospitality properties do you work with?", a: "We specialize exclusively in luxury hotels, resorts, event venues, restaurants, corporate retreat centers, and spa facilities. Every project is custom-designed for the hospitality industry." },
              { q: "How long does a typical project take from concept to completion?", a: "Timelines vary by size and complexity, typically 3-12 months from design approval to completion. We coordinate closely with your operational calendar to minimize guest disruption." },
              { q: "Do you handle permits, engineering, and regulatory approvals?", a: "Yes. Our team manages all structural engineering, building permits, code compliance, and regulatory approvals for every project, in any jurisdiction." },
              { q: "Can the structures withstand extreme weather conditions?", a: "Absolutely. Every structure is engineered to exceed local building codes for wind, snow, seismic, and thermal loads. We have completed projects in tropical, coastal, alpine, and desert environments." },
              { q: "Do you provide climate control and technology integration?", a: "Yes. We integrate HVAC, lighting, acoustics, audio-visual systems, and smart controls to ensure year-round comfort and functionality for your guests." },
              { q: "What is the typical investment range for a hospitality glasshouse?", a: "Projects range from $150,000 for intimate restaurant enclosures to several million for grand resort pavilions. We provide detailed proposals after the discovery phase." }
            ].map((faq, index) => (
              <Reveal key={index} delay={index * 80}>
                <div className="bg-cream rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-display text-lg font-bold text-primary mb-3">{faq.q}</h3>
                  <p className="text-text-muted leading-relaxed">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <DualCTA primary="Have More Questions? Let&apos;s Talk" href="#contact" />
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-80 h-80 border border-gold/30 rounded-full" />
          <div className="absolute bottom-10 left-10 w-60 h-60 border border-gold/20 rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Reveal>
            <div className="text-gold tracking-[0.2em] text-sm font-semibold mb-4">Ready to Create Something Extraordinary?</div>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
              Your Vision, Our Expertise
            </h2>
            <p className="text-gray-300 text-xl mb-12 max-w-2xl mx-auto">
              Every great hospitality space begins with a conversation. Tell us about your property and vision, and we will show you what is possible.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="max-w-2xl mx-auto">
              <LeadForm id="contact-form" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-dark text-center">
        <p className="text-gray-500 text-sm">© 2026 Serreva Glasshouses. All rights reserved.</p>
      </footer>

      {/* Floating CTA */}
      <div className={`fixed bottom-6 right-6 z-40 flex flex-col gap-3 transition-all duration-500 ${showFloating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}>
        <a href="#contact" className="bg-secondary text-white px-6 py-4 rounded-full font-semibold shadow-lg hover:bg-secondary/90 transition-all text-center">Get Proposal</a>
        <a href={PHONE_HREF} className="bg-primary text-white px-6 py-4 rounded-full font-semibold shadow-lg hover:bg-primary/90 transition-all text-center">{PHONE}</a>
      </div>
    </>
  );
}