import { createFileRoute } from "@tanstack/react-router";

import { Container, PageHeader } from "@/components/site/section";
import { site } from "@/data/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Alfaz Ahmed" },
      {
        name: "description",
        content:
          "How information submitted through this portfolio website is handled, stored and contacted about.",
      },
      { property: "og:title", content: "Privacy Policy — Alfaz Ahmed" },
      { property: "og:description", content: "How your information is handled on this website." },
    ],
  }),
  component: Privacy,
});

const sections = [
  {
    title: "Information collected",
    body: "This website collects only the information you choose to submit through the contact form: your name, email address, subject and message. No account is created and no tracking profile is built.",
  },
  {
    title: "How it is used",
    body: "Submitted details are used solely to respond to your enquiry about networking, infrastructure or automation work. They are not sold, rented or shared for marketing purposes.",
  },
  {
    title: "Storage",
    body: "During this phase the contact form validates input in your browser and does not transmit or store it. When message delivery is enabled, submissions will be stored securely and retained only as long as needed to handle the conversation.",
  },
  {
    title: "Cookies and analytics",
    body: "This site does not set advertising cookies. If basic analytics are added later, this page will be updated to describe exactly what is measured.",
  },
  {
    title: "Your choices",
    body: "You can ask for any message you sent to be deleted, or ask what has been stored, at any time.",
  },
];

function Privacy() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="A short, plain explanation of what this website does with your information."
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
                Questions about this policy can be sent to{" "}
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
