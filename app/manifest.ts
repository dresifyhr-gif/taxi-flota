import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FleetHub Admin",
    short_name: "FleetHub",
    description: "Administracija prijava vozača i vozila za najam.",
    start_url: "/admin/prijave",
    scope: "/",
    display: "standalone",
    background_color: "#070a08",
    theme_color: "#070a08",
    orientation: "portrait",
    icons: [
      { src: "/fh-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/fh-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/fh-icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/fh-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
