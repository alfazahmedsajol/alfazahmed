<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules

- Site content (skills, services, projects, blog posts, certifications, resume) lives in typed modules under `src/data/` — a single swap point when Phase 2 makes it database-driven.
- Shared site chrome and presentational primitives live in `src/components/site/`; the navbar/footer shell is mounted once in `src/routes/__root.tsx` so every route inherits it.
- Admin access: roles in user_roles + is_admin(); owner email self-claims admin via claim_owner_admin() RPC — no client-side role checks.
- Uploaded files live in the private "media" storage bucket (admin-only write via is_admin(), anon read policy) and are served through /api/public/media/$path because the workspace blocks public buckets.
