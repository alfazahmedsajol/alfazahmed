create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid not null, role app_role not null, created_at timestamptz not null default now(), unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select public.has_role(auth.uid(),'admin') $$;

create or replace function public.claim_owner_admin() returns boolean language plpgsql security definer set search_path=public,auth as $$
declare ok boolean;
begin
  select exists(select 1 from auth.users where id=auth.uid() and lower(email)='alfazahmedsajol@gmail.com' and email_confirmed_at is not null) into ok;
  if ok then insert into public.user_roles(user_id,role) values (auth.uid(),'admin') on conflict do nothing; end if;
  return public.is_admin();
end $$;
revoke execute on function public.claim_owner_admin() from anon, public; grant execute on function public.claim_owner_admin() to authenticated;

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path=public as $$ begin new.updated_at=now(); return new; end $$;

create table public.profiles (id uuid primary key, full_name text, headline text, bio text, avatar_url text, resume_url text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.skill_categories (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, sort_order int not null default 0, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.skills (id uuid primary key default gen_random_uuid(), category_id uuid references public.skill_categories(id) on delete set null, name text not null, level int, sort_order int not null default 0, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.project_categories (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.projects (id uuid primary key default gen_random_uuid(), category_id uuid references public.project_categories(id) on delete set null, title text not null, slug text unique not null, summary text, content text, cover_url text, tags text[] not null default '{}', status text not null default 'draft' check (status in ('draft','published')), featured boolean not null default false, published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.project_images (id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade, url text not null, caption text, sort_order int not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.services (id uuid primary key default gen_random_uuid(), title text not null, description text, icon text, sort_order int not null default 0, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.certifications (id uuid primary key default gen_random_uuid(), name text not null, issuer text, status text not null default 'planned', issued_on date, credential_url text, image_url text, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.experience (id uuid primary key default gen_random_uuid(), role text not null, company text, start_date date, end_date date, description text, sort_order int not null default 0, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.education (id uuid primary key default gen_random_uuid(), degree text not null, institution text, start_date date, end_date date, description text, sort_order int not null default 0, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.blog_categories (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.blog_tags (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.blog_posts (id uuid primary key default gen_random_uuid(), category_id uuid references public.blog_categories(id) on delete set null, title text not null, slug text unique not null, excerpt text, content text, cover_url text, status text not null default 'draft' check (status in ('draft','published')), featured boolean not null default false, seo_title text, seo_description text, published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.blog_post_tags (post_id uuid not null references public.blog_posts(id) on delete cascade, tag_id uuid not null references public.blog_tags(id) on delete cascade, created_at timestamptz not null default now(), primary key(post_id, tag_id));
create table public.messages (id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 120), email text not null check (char_length(email) between 3 and 255), subject text check (char_length(subject) <= 200), body text not null check (char_length(body) between 1 and 5000), is_read boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.media (id uuid primary key default gen_random_uuid(), bucket text not null, path text not null, file_name text not null, mime_type text, size_bytes bigint, alt text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(bucket,path));
create table public.site_settings (id uuid primary key default gen_random_uuid(), key text unique not null, value jsonb not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.social_links (id uuid primary key default gen_random_uuid(), platform text not null, url text not null, sort_order int not null default 0, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create index on public.skills(category_id); create index on public.projects(status); create index on public.projects(category_id);
create index on public.project_images(project_id); create index on public.blog_posts(status, published_at desc); create index on public.blog_posts(category_id);
create index on public.blog_post_tags(tag_id); create index on public.messages(is_read, created_at desc);

do $$ declare t text; begin
foreach t in array array['profiles','skill_categories','skills','project_categories','projects','project_images','services','certifications','experience','education','blog_categories','blog_tags','blog_posts','blog_post_tags','messages','media','site_settings','social_links'] loop
  execute format('grant select, insert, update, delete on public.%I to authenticated; grant all on public.%I to service_role; alter table public.%I enable row level security;', t,t,t);
  execute format('create policy "admin all" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin());', t);
  if t <> 'blog_post_tags' then execute format('create trigger touch before update on public.%I for each row execute function public.touch_updated_at();', t); end if;
end loop; end $$;

grant select on public.profiles, public.skill_categories, public.skills, public.project_categories, public.projects, public.project_images, public.services, public.certifications, public.experience, public.education, public.blog_categories, public.blog_tags, public.blog_posts, public.blog_post_tags, public.site_settings, public.social_links to anon;
create policy "public read" on public.profiles for select to anon, authenticated using (true);
create policy "public read" on public.project_categories for select to anon, authenticated using (true);
create policy "public read" on public.blog_categories for select to anon, authenticated using (true);
create policy "public read" on public.blog_tags for select to anon, authenticated using (true);
create policy "public read" on public.site_settings for select to anon, authenticated using (true);
create policy "public read" on public.skill_categories for select to anon, authenticated using (published);
create policy "public read" on public.skills for select to anon, authenticated using (published);
create policy "public read" on public.services for select to anon, authenticated using (published);
create policy "public read" on public.certifications for select to anon, authenticated using (published);
create policy "public read" on public.experience for select to anon, authenticated using (published);
create policy "public read" on public.education for select to anon, authenticated using (published);
create policy "public read" on public.social_links for select to anon, authenticated using (published);
create policy "public read" on public.projects for select to anon, authenticated using (status='published');
create policy "public read" on public.blog_posts for select to anon, authenticated using (status='published');
create policy "public read" on public.project_images for select to anon, authenticated using (exists(select 1 from public.projects p where p.id=project_id and p.status='published'));
create policy "public read" on public.blog_post_tags for select to anon, authenticated using (exists(select 1 from public.blog_posts p where p.id=post_id and p.status='published'));
grant insert on public.messages to anon;
create policy "anyone can send" on public.messages for insert to anon, authenticated with check (is_read = false);

insert into public.site_settings(key,value) values
('general', '{"site_title":"AI-Powered Networking & Automation","site_description":"Portfolio of Alfaz Ahmed — Network Engineer & Automation Specialist.","hero_title":"Building Smarter Networks. Automating Infrastructure.","hero_subtitle":"","email":"alfazahmedsajol@gmail.com","phone":"+8801324844564","footer_text":"© 2026 Alfaz Ahmed. All rights reserved.","profile_image":""}'),
('seo', '{"default_title":"Alfaz Ahmed — AI-Powered Networking & Automation","default_description":"","og_image":""}');