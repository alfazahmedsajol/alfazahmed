import { createFileRoute, notFound } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud";
import { sections } from "@/components/admin/sections";

export const Route = createFileRoute("/_authenticated/admin/$section")({
  loader: ({ params }) => {
    const config = sections[params.section];
    if (!config) throw notFound();
    return { title: config.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? "Admin"} — Admin` }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => <p className="text-muted-foreground">Unknown admin section.</p>,
  component: Section,
});

function Section() {
  const { section } = Route.useParams();
  return <CrudPage key={section} config={sections[section]!} />;
}
