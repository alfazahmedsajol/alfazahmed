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
