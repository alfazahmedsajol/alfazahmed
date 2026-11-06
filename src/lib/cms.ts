import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const skillsQuery = queryOptions({
  queryKey: ["public", "skills"],
  queryFn: async () => {
    const [{ data: cats, error: e1 }, { data: skills, error: e2 }] = await Promise.all([
      supabase.from("skill_categories").select("id,name,slug,summary").eq("published", true).order("sort_order"),
      supabase.from("skills").select("id,name,level_label,description,category_id,featured").eq("published", true).order("sort_order"),
    ]);
    if (e1 || e2) throw e1 ?? e2;
    return (cats ?? []).map((c) => ({ ...c, skills: (skills ?? []).filter((s) => s.category_id === c.id) }));
  },
});

export const servicesQuery = queryOptions({
  queryKey: ["public", "services"],
  queryFn: async () => {
    const { data, error } = await supabase.from("services").select("*").eq("published", true).order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const certificationsQuery = queryOptions({
  queryKey: ["public", "certifications"],
  queryFn: async () => {
    const { data, error } = await supabase.from("certifications").select("*").eq("published", true).order("sort_order");
    if (error) throw error;
    return data;
  },
});

export type PublicPost = {
  id: string; slug: string; title: string; category: string; date: string; readingTime: string;
  excerpt: string; tags: string[]; featured: boolean; sortOrder: number; content: string; cover: string | null; author: string;
  seoTitle: string | null; seoDescription: string | null; canonical: string | null; ogImage: string | null;
};

const POST_COLS = "id,slug,title,excerpt,content,cover_url,featured,sort_order,published_at,created_at,reading_time,tags,author,seo_title,seo_description,canonical_url,og_image_url,blog_categories(name)";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPost(r: any): PublicPost {
  const content = r.content ?? "";
  return {
    id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt ?? "", content, featured: r.featured, sortOrder: r.sort_order ?? 0,
    category: r.blog_categories?.name ?? "General", date: (r.published_at ?? r.created_at).slice(0, 10),
    readingTime: r.reading_time || `${Math.max(1, Math.round(content.split(/\s+/).length / 200))} min read`,
    tags: r.tags ?? [], cover: r.cover_url, author: r.author || "Alfaz Ahmed",
    seoTitle: r.seo_title, seoDescription: r.seo_description, canonical: r.canonical_url, ogImage: r.og_image_url,
  };
}

export const blogListQuery = queryOptions({
  queryKey: ["public", "blog"],
  queryFn: async () => {
    const [{ data, error }, { data: cats, error: e2 }] = await Promise.all([
      supabase.from("blog_posts").select(POST_COLS).order("published_at", { ascending: false, nullsFirst: false }),
      supabase.from("blog_categories").select("name").order("name"),
    ]);
    if (error || e2) throw error ?? e2;
    return { posts: (data ?? []).map(toPost), categories: (cats ?? []).map((c) => c.name) };
  },
});

export const blogPostQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public", "blog", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select(POST_COLS).eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data ? toPost(data) : null;
    },
  });

export type PublicProject = {
  id: string; slug: string; title: string; category: string; summary: string; featured: boolean; year: string;
  stack: string[]; status: string | null; cover: string | null; diagram: string | null; github: string | null; demo: string | null;
  problem: string | null; objective: string | null; architecture: string | null; implementation: string | null;
  configuration: string | null; results: string | null; lessons: string | null; content: string | null;
  seoTitle: string | null; seoDescription: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toProject(r: any): PublicProject {
  return {
    id: r.id, slug: r.slug, title: r.title, category: r.project_categories?.name ?? "General", summary: r.summary ?? "",
    featured: r.featured, year: (r.project_date ?? r.published_at ?? r.created_at ?? "").slice(0, 4), stack: r.tags ?? [],
    status: r.project_status, cover: r.cover_url, diagram: r.diagram_url, github: r.github_url, demo: r.demo_url,
    problem: r.problem, objective: r.objective, architecture: r.architecture, implementation: r.implementation,
    configuration: r.configuration, results: r.results, lessons: r.lessons, content: r.content,
    seoTitle: r.seo_title, seoDescription: r.seo_description,
  };
}

const PROJECT_COLS = "*, project_categories(name)";

export const projectsQuery = queryOptions({
  queryKey: ["public", "projects"],
  queryFn: async () => {
    const [{ data, error }, { data: cats, error: e2 }] = await Promise.all([
      supabase.from("projects").select(PROJECT_COLS).eq("status", "published").order("sort_order"),
      supabase.from("project_categories").select("name").order("name"),
    ]);
    if (error || e2) throw error ?? e2;
    return { projects: (data ?? []).map(toProject), categories: (cats ?? []).map((c) => c.name) };
  },
});

export const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public", "projects", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select(PROJECT_COLS).eq("slug", slug).eq("status", "published").maybeSingle();
      if (error) throw error;
      return data ? toProject(data) : null;
    },
  });

export type SiteSettings = { general: Record<string, string>; seo: Record<string, string>; socials: { platform: string; url: string }[] };

export const settingsQuery = queryOptions({
  queryKey: ["public", "settings"],
  queryFn: async (): Promise<SiteSettings> => {
    const [{ data, error }, { data: soc, error: e2 }] = await Promise.all([
      supabase.from("site_settings").select("key,value").in("key", ["general", "seo"]),
      supabase.from("social_links").select("platform,url").eq("published", true).order("sort_order"),
    ]);
    if (error || e2) throw error ?? e2;
    const get = (k: string) => (data?.find((d) => d.key === k)?.value ?? {}) as Record<string, string>;
    return { general: get("general"), seo: get("seo"), socials: soc ?? [] };
  },
  staleTime: 5 * 60_000,
});

/** Converts Google Drive share links to a direct image URL; passes other URLs through. */
export function toImageUrl(url?: string | null): string | null {
  const u = (url ?? "").trim();
  if (!u) return null;
  const m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
  return m ? `https://lh3.googleusercontent.com/d/${m[1]}` : u;
}
