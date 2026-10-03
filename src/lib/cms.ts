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
  excerpt: string; tags: string[]; featured: boolean; content: string; cover: string | null; author: string;
  seoTitle: string | null; seoDescription: string | null; canonical: string | null; ogImage: string | null;
};

const POST_COLS = "id,slug,title,excerpt,content,cover_url,featured,published_at,created_at,reading_time,tags,author,seo_title,seo_description,canonical_url,og_image_url,blog_categories(name)";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPost(r: any): PublicPost {
  const content = r.content ?? "";
  return {
    id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt ?? "", content, featured: r.featured,
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
