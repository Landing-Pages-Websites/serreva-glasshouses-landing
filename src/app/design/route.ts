/**
 * Reverse proxy for /design → mega-landing-platform
 *
 * The /design landing page is served by the shared mega-landing-platform
 * Vercel project. When we moved the info.serrevaglasshouses.com domain
 * to THIS project, we needed to keep /design alive.
 *
 * The platform identifies pages by the Host header. We proxy through
 * landing.gomega.ai (a custom domain on the platform that bypasses
 * Vercel SSO protection) with Host: info.serrevaglasshouses.com so
 * the platform serves the correct page.
 *
 * All JS / CSS / image assets on the /design page use absolute URLs
 * (mega-landing-platform.vercel.app, Google Storage, etc.) so only
 * the HTML document itself needs proxying.
 */

import https from "https";
import { NextRequest } from "next/server";

/** Custom domain on mega-landing-platform (bypasses Vercel SSO) */
const UPSTREAM_HOST = "landing.gomega.ai";
/** The host the platform uses to identify the Serreva /design page */
const VIRTUAL_HOST = "info.serrevaglasshouses.com";

export const dynamic = "force-dynamic";

function proxy(
  path: string,
  incomingHeaders: Headers,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: UPSTREAM_HOST,
        path,
        method: "GET",
        headers: {
          Host: VIRTUAL_HOST,
          "User-Agent":
            incomingHeaders.get("user-agent") ?? "Vercel-Proxy/1.0",
          Accept: incomingHeaders.get("accept") ?? "text/html",
          "Accept-Encoding": "identity",
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => {
          const body = Buffer.concat(chunks);
          const headers = new Headers();
          headers.set(
            "Content-Type",
            (res.headers["content-type"] as string) ??
              "text/html; charset=utf-8",
          );
          if (res.headers["cache-control"]) {
            headers.set(
              "Cache-Control",
              res.headers["cache-control"] as string,
            );
          }
          resolve(
            new Response(body, {
              status: res.statusCode ?? 200,
              headers,
            }),
          );
        });
        res.on("error", reject);
      },
    );
    req.on("error", reject);
    req.end();
  });
}

export async function GET(request: NextRequest) {
  try {
    return await proxy("/design", request.headers);
  } catch {
    return new Response("Upstream unavailable", { status: 502 });
  }
}
