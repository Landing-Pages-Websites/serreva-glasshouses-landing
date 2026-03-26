"use client";

import { useEffect } from "react";

export function QueryParamPersistence() {
  useEffect(() => {
    if (window.location.search) {
      sessionStorage.setItem("landing_params", window.location.search);
    }
  }, []);

  return null;
}