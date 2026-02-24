import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenCode Learn English",
    short_name: "OpenCode Learn",
    description: "Context-first vocabulary practice with spaced repetition.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1ea",
    theme_color: "#f4f1ea",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
