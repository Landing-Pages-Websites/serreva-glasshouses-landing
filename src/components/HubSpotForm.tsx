"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (opts: Record<string, unknown>) => void;
      };
    };
  }
}

const PORTAL_ID = "46084449";
const FORM_ID = "b453dc68-f5d1-43c6-a097-238b28e28601";
const REGION = "na1";

interface HubSpotFormProps {
  id?: string;
}

export function HubSpotForm({ id = "hs-form-hero" }: HubSpotFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const created = useRef(false);

  useEffect(() => {
    if (created.current) return;

    const createForm = () => {
      if (!containerRef.current || !window.hbspt) return;
      created.current = true;
      window.hbspt.forms.create({
        region: REGION,
        portalId: PORTAL_ID,
        formId: FORM_ID,
        target: `#${id}`,
      });
    };

    // If script already loaded
    if (window.hbspt) {
      createForm();
      return;
    }

    // Load the HubSpot forms script
    const existing = document.querySelector(
      'script[src*="js.hsforms.net/forms/embed"]'
    );
    if (existing) {
      existing.addEventListener("load", createForm);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://js.hsforms.net/forms/embed/v2.js`;
    script.charset = "utf-8";
    script.async = true;
    script.onload = createForm;
    document.head.appendChild(script);
  }, [id]);

  return (
    <div className="rounded-2xl p-8 shadow-2xl bg-white border border-[#d1cbc1]">
      <h3 className="font-display text-2xl font-bold mb-1 text-[#133B43]">
        Request Your Proposal
      </h3>
      <p className="text-sm mb-6 text-[#6b7280]">
        Tell us about your vision. We respond within 24 hours.
      </p>
      <div id={id} ref={containerRef} />
    </div>
  );
}
