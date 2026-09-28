import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/site/reveal";
import { Container, DemoNotice, PageHeader } from "@/components/site/section";
import { site, socials } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Alfaz Ahmed — Networking & Automation Projects" },
      {
        name: "description",
        content:
          "Get in touch about MikroTik, ISP/FTTH, Linux infrastructure or automation work. Email alfazahmedsajol@gmail.com or call +8801324844564.",
      },
      { property: "og:title", content: "Contact Alfaz Ahmed" },
      {
        property: "og:description",
        content: "Discuss a networking, infrastructure or automation project.",
      },
    ],
  }),
  component: Contact,
});

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(values: Fields): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name (at least 2 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (values.subject.trim().length < 3) errors.subject = "Please add a short subject.";
  if (values.message.trim().length < 20)
    errors.message = "Please describe your project in at least 20 characters.";
  return errors;
}

function Contact() {
  const [values, setValues] = useState<Fields>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});

  const update = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    toast.success("Message validated. Sending is enabled in the next phase — please email me directly for now.");
    setValues({ name: "", email: "", subject: "", message: "" });
  };

  const fieldError = (key: keyof Fields) =>
    errors[key] ? (
      <p id={`${key}-error`} role="alert" className="mt-1.5 text-xs text-destructive">
        {errors[key]}
      </p>
    ) : null;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your network"
        description="Describe what you're building or what's breaking. I'll reply with how I'd approach it and what it would take."
      />

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <form onSubmit={onSubmit} noValidate className="panel p-7 sm:p-9">
                <h2 className="text-lg font-semibold text-foreground">Send a message</h2>
                <div className="mt-3">
                  <DemoNotice>Form validation is live; delivery is added in the next phase</DemoNotice>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={values.name}
                      onChange={update("name")}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className="mt-2"
                    />
                    {fieldError("name")}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={update("email")}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className="mt-2"
                    />
                    {fieldError("email")}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={values.subject}
                      onChange={update("subject")}
                      aria-invalid={Boolean(errors.subject)}
                      aria-describedby={errors.subject ? "subject-error" : undefined}
                      className="mt-2"
                    />
                    {fieldError("subject")}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={values.message}
                      onChange={update("message")}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      className="mt-2"
                    />
                    {fieldError("message")}
                  </div>
                </div>

                <Button type="submit" size="lg" className="mt-8">
                  <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                  Send message
                </Button>
              </form>
            </Reveal>

            <Reveal delay={100} className="space-y-6">
              <div className="panel p-7">
                <h2 className="text-lg font-semibold text-foreground">Direct contact</h2>
                <ul className="mt-5 space-y-4">
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/60 text-primary">
                        <Mail className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                          Email
                        </span>
                        <span className="block text-foreground">{site.email}</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${site.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/60 text-primary">
                        <Phone className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                          Phone
                        </span>
                        <span className="block text-foreground">{site.phone}</span>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="panel p-7">
                <h2 className="text-lg font-semibold text-foreground">Social</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Profile links are placeholders until the accounts are added.
                </p>
                <ul className="mt-5 grid grid-cols-2 gap-3">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        className="block rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        {s.label}
                        <span className="mt-1 block font-mono text-[0.65rem] text-muted-foreground">
                          {s.handle}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel p-7">
                <h2 className="text-lg font-semibold text-foreground">What to include</h2>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  <li>The equipment involved (router, OLT, servers)</li>
                  <li>Roughly how many users or subscribers</li>
                  <li>What currently happens versus what should happen</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
