import type { CrudConfig } from "./crud";

const pub = { key: "published", label: "Published", type: "bool" } as const;
const feat = { key: "featured", label: "Featured", type: "bool" } as const;
const order = { key: "sort_order", label: "Display order", type: "number" } as const;
const ICONS = ["router", "network", "fiber", "server", "workflow", "brain", "shield", "cloud", "code", "activity"];

export const sections: Record<string, CrudConfig> = {
  skills: {
    table: "skills", title: "Skills", singular: "Skill", orderBy: "sort_order", publishKey: "published", featuredKey: "featured",
    columns: ["name", "category_id", "level_label"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "category_id", label: "Category", type: "relation", relation: "skill_categories" },
      { key: "level_label", label: "Proficiency", type: "select", options: ["Learning", "Working knowledge", "Practising", "Focus area"] },
      { key: "level", label: "Proficiency % (optional)", type: "number" },
      { key: "icon", label: "Icon", type: "text", help: "Optional icon name, e.g. router, server, shield" },
      { key: "description", label: "Description", type: "textarea" },
      order, pub, feat,
    ],
  },
  "skill-categories": {
    table: "skill_categories", title: "Skill categories", singular: "Category", orderBy: "sort_order", publishKey: "published", slugFrom: "name",
    columns: ["name", "slug"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", help: "Leave empty to generate from the name" },
      { key: "summary", label: "Summary", type: "textarea" },
      order, pub,
    ],
  },
  projects: {
    table: "projects", title: "Projects", singular: "Project", orderBy: "sort_order", publishKey: "status", featuredKey: "featured", slugFrom: "title",
    columns: ["title", "category_id", "project_status"],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", help: "URL: /projects/your-slug — leave empty to generate" },
      { key: "category_id", label: "Category", type: "relation", relation: "project_categories" },
      { key: "status", label: "Visibility", type: "select", options: ["draft", "published"] },
      { key: "project_status", label: "Project status", type: "select", options: ["Completed", "In progress", "Lab / demo", "Planned"] },
      { key: "project_date", label: "Project date", type: "date" },
      { key: "tags", label: "Technologies", type: "tags" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "problem", label: "Problem", type: "textarea" },
      { key: "objective", label: "Objective", type: "textarea" },
      { key: "architecture", label: "Architecture", type: "textarea" },
      { key: "diagram_url", label: "Architecture diagram image URL", type: "url" },
      { key: "cover_url", label: "Cover image URL", type: "url" },
      { key: "implementation", label: "Implementation", type: "textarea" },
      { key: "configuration", label: "Configuration / workflow (code)", type: "code" },
      { key: "results", label: "Results", type: "textarea" },
      { key: "lessons", label: "Lessons learned", type: "textarea" },
      { key: "content", label: "Extra case-study notes", type: "textarea" },
      { key: "github_url", label: "GitHub URL", type: "url" },
      { key: "demo_url", label: "Live demo URL", type: "url" },
      { key: "seo_title", label: "SEO title", type: "text" },
      { key: "seo_description", label: "Meta description", type: "textarea" },
      order, feat,
    ],
  },
  "project-categories": {
    table: "project_categories", title: "Project categories", singular: "Category", orderBy: "name", slugFrom: "name",
    columns: ["name", "slug"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", help: "Leave empty to generate from the name" },
    ],
  },
  services: {
    table: "services", title: "Services", singular: "Service", orderBy: "sort_order", publishKey: "published", featuredKey: "featured", slugFrom: "title",
    columns: ["title", "icon"],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", help: "Leave empty to generate" },
      { key: "icon", label: "Icon", type: "select", options: ICONS },
      { key: "description", label: "Short description", type: "textarea" },
      { key: "details", label: "Detailed description", type: "textarea" },
      { key: "technologies", label: "Technologies", type: "tags" },
      { key: "features", label: "Features", type: "tags" },
      { key: "cta", label: "Button text", type: "text" },
      order, pub, feat,
    ],
  },
  certifications: {
    table: "certifications", title: "Certifications", singular: "Certification", orderBy: "sort_order", publishKey: "published", featuredKey: "featured",
    columns: ["name", "issuer", "status"],
    fields: [
      { key: "name", label: "Certification name", type: "text", required: true },
      { key: "issuer", label: "Issuing organization", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Earned", "In progress", "Planned", "Self-study"] },
      { key: "issued_on", label: "Issue date", type: "date" },
      { key: "expires_on", label: "Expiration date", type: "date" },
      { key: "credential_id", label: "Credential ID", type: "text" },
      { key: "credential_url", label: "Credential URL", type: "url" },
      { key: "image_url", label: "Certificate image URL", type: "url" },
      { key: "file_url", label: "Certificate PDF URL", type: "url" },
      { key: "description", label: "Description", type: "textarea" },
      order, pub, feat,
    ],
  },
  experience: {
    table: "experience", title: "Experience", singular: "Experience", orderBy: "sort_order", publishKey: "published",
    columns: ["role", "company", "start_date"],
    fields: [
      { key: "company", label: "Organization", type: "text" },
      { key: "role", label: "Role", type: "text", required: true },
      { key: "start_date", label: "Start date", type: "date" },
      { key: "end_date", label: "End date", type: "date" },
      { key: "is_current", label: "Current position", type: "bool" },
      { key: "technologies", label: "Technologies", type: "tags" },
      { key: "description", label: "Description", type: "textarea" },
      order, pub,
    ],
  },
  education: {
    table: "education", title: "Education", singular: "Education", orderBy: "sort_order", publishKey: "published",
    columns: ["degree", "institution", "start_date"],
    fields: [
      { key: "institution", label: "Institution", type: "text" },
      { key: "degree", label: "Degree", type: "text", required: true },
      { key: "field", label: "Field of study", type: "text" },
      { key: "start_date", label: "Start date", type: "date" },
      { key: "end_date", label: "End date", type: "date" },
      { key: "document_url", label: "Credential / document URL", type: "url" },
      { key: "description", label: "Description", type: "textarea" },
      order, pub,
    ],
  },
};

export const nav = [
  { group: "Content", items: [["projects", "Projects"], ["project-categories", "Project categories"], ["skills", "Skills"], ["skill-categories", "Skill categories"], ["services", "Services"], ["certifications", "Certifications"]] },
  { group: "Profile", items: [["experience", "Experience"], ["education", "Education"]] },
] as const;
