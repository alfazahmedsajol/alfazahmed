import { createFileRoute } from "@tanstack/react-router";

import { Container, PageHeader } from "@/components/site/section";
import { site } from "@/data/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Alfaz Ahmed" },
      {
        name: "description",
        content:
          "Terms covering the content, demo material and technical guidance published on this portfolio website.",
      },
      { property: "og:title", content: "Terms of Use — Alfaz Ahmed" },
      { property: "og:description", content: "Terms covering content and use of this website." },
    ],
  }),
  component: Terms,
});

const sections = [
  {
    title: "Purpose of this site",
    body: "This website presents the professional work, services and technical writing of Alfaz Ahmed. It is informational and does not form a contract for any service.",
  },
  {
    title: "Demo content",
    body: "Projects, articles and certification entries marked as demo, lab, planned or in progress are exactly that. Nothing on this site should be read as a claim of completed client work, awarded credentials or measured commercial results unless explicitly stated.",
  },
  {
    title: "Technical guidance",
    body: "Configuration examples and articles are shared in good faith and reflect lab conditions. Apply them to production networks at your own risk and always verify against your own environment and vendor documentation.",
  },
  {
    title: "Intellectual property",
    body: "Written content and designs on this site belong to Alfaz Ahmed. You may quote short excerpts with attribution; republishing whole articles requires permission.",
  },
  {
    title: "Changes",
    body: "These terms may be updated as the site grows — particularly when the contact form, admin panel and other features go live.",
  },
];

function Terms() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Use"
        description="What the content on this site is, and how it may be used."
      />
      <section className="py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-8">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-lg font-semibold text-foreground">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{s.body}</p>
              </section>
            ))}
            <section>
              <h2 className="text-lg font-semibold text-foreground">Contact</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Questions about these terms:{" "}
                <a href={`mailto:${site.email}`} className="text-primary hover:underline">
                  {site.email}
                </a>
                .
              </p>
            </section>
          </div>
        </Container>
      </section>
    </>
  );
}
