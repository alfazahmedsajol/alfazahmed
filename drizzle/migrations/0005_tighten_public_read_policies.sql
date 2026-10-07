drop policy if exists "public read" on public.profiles;

drop policy if exists "public read" on public.site_settings;
create policy "public read" on public.site_settings for select to anon, authenticated using (key in ('general','seo'));

drop policy if exists "public read" on public.blog_categories;
create policy "public read" on public.blog_categories for select to anon, authenticated
  using (exists (select 1 from public.blog_posts p where p.category_id = blog_categories.id and p.status = 'published'));

drop policy if exists "public read" on public.blog_tags;
create policy "public read" on public.blog_tags for select to anon, authenticated
  using (exists (select 1 from public.blog_post_tags t join public.blog_posts p on p.id = t.post_id where t.tag_id = blog_tags.id and p.status = 'published'));

drop policy if exists "public read" on public.project_categories;
create policy "public read" on public.project_categories for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.category_id = project_categories.id and p.status = 'published'));

drop policy if exists "media public read" on storage.objects;
create policy "media admin read" on storage.objects for select to authenticated using (bucket_id = 'media' and public.is_admin());