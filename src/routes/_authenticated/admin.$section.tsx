import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud";
import { sections, sectionTabs } from "@/components/admin/sections";

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
  const tabs = sectionTabs[section];
  return (
    <>
      {tabs && (
        <div className="mb-6 inline-flex rounded-lg border border-border bg-surface/60 p-1">
          {tabs.map(([key, label]) => (
            <Link
              key={key}
              to="/admin/$section"
              params={{ section: key }}
              className={`rounded-md px-4 py-1.5 text-sm transition-colors ${key === section ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
      <CrudPage key={section} config={sections[section]!} />
    </>
  );
}
