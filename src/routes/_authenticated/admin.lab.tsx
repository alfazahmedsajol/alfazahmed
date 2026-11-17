import { createFileRoute } from "@tanstack/react-router";
import { LabEditor } from "@/components/admin/lab-editor";

export const Route = createFileRoute("/_authenticated/admin/lab")({
  head: () => ({
    meta: [
      { title: "Lab — Admin" },
      { name: "description", content: "Edit the public Lab page." },
      { property: "og:title", content: "Lab — Admin" },
      { property: "og:description", content: "Edit the public Lab page." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LabEditor,
});
