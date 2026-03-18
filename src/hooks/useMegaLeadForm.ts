"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const CONFIG = {
  CUSTOMER_ID: "50f812f9-d269-4ebd-a6b8-d81e22636f0f",
  SITE_ID: "6a472573-8fd1-4255-bde6-3b505d452b2c",
  SOURCE_PROVIDER: "serreva-glasshouses-hospitality-landing",
  ENDPOINT: "https://analytics.gomega.ai/submission/submit",
};

const STORAGE_KEYS = {
  VISITOR_ID: "_mega_vid",
  SESSION_ID: "_mega_sid",
  ATTRIBUTION: "_mega_attr",
};

interface Attribution {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  fbclid: string | null;
  fbp: string | null;
  fbc: string | null;
}

const generateId = (prefix: string): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  })}`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const getVisitorId = (): string => {
  if (typeof localStorage === "undefined") return generateId("vis");
  let id = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!id) {
    id = generateId("vis");
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, id);
  }
  return id;
};

const getSessionId = (): string => {
  if (typeof sessionStorage === "undefined") return generateId("sess");
  let id = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!id) {
    id = generateId("sess");
    sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, id);
  }
  return id;
};

const getAttribution = (): Attribution => {
  if (typeof window === "undefined") {
    return { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null, utm_content: null, gclid: null, gbraid: null, wbraid: null, fbclid: null, fbp: null, fbc: null };
  }

  const stored = sessionStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* continue */ }
  }

  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid");
  const fbc = getCookie("_fbc") || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : null);

  const attribution: Attribution = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
    gclid: params.get("gclid"),
    gbraid: params.get("gbraid"),
    wbraid: params.get("wbraid"),
    fbclid,
    fbp: getCookie("_fbp"),
    fbc,
  };

  sessionStorage.setItem(STORAGE_KEYS.ATTRIBUTION, JSON.stringify(attribution));
  return attribution;
};

interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectType: string;
}

export function useMegaLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const attributionRef = useRef<Attribution | null>(null);

  useEffect(() => {
    attributionRef.current = getAttribution();
  }, []);

  const submit = useCallback(async (fields: FormFields) => {
    setIsSubmitting(true);
    try {
      const attribution = attributionRef.current || getAttribution();
      const payload = {
        customer_id: CONFIG.CUSTOMER_ID,
        site_id: CONFIG.SITE_ID,
        source_provider: CONFIG.SOURCE_PROVIDER,
        form_data: {
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
          phone: fields.phone,
          projectType: fields.projectType,
        },
        url: typeof window !== "undefined" ? window.location.href : "",
        referrer_url: typeof document !== "undefined" ? document.referrer || null : null,
        session_id: getSessionId(),
        visitor_id: getVisitorId(),
        ...attribution,
      };

      const response = await fetch(CONFIG.ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Submit failed: ${response.status}`);
      return true;
    } catch (error) {
      console.error("Form submission error:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submit, isSubmitting };
}
