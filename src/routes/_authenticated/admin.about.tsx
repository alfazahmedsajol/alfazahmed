import { createFileRoute } from "@tanstack/react-router";
import { AboutEditor } from "@/components/admin/about-editor";

export const Route = createFileRoute("/_authenticated/admin/about")({
  head: () => ({
    meta: [
      { title: "About — Admin" },
      { name: "description", content: "Edit the About section and photos." },
      { property: "og:title", content: "About — Admin" },
      { property: "og:description", content: "Edit the About section and photos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AboutEditor,
});
