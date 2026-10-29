import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() { return [{ source: "/", destination: "/en", permanent: false }]; },
};
export default config;
