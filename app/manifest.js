const SITE_NAME = "dedrive";
const DESCRIPTION = "Scan Google Drive for duplicates, review matches, and safely move extras into a _dupes folder.";

export default function manifest() {
  return {
    name: "dedrive | Google Drive Duplicate File Finder",
    short_name: SITE_NAME,
    description: DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d0d",
    theme_color: "#0d0d0d",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
