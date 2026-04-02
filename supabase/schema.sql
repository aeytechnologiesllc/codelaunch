create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  company_name text,
  phone text,
  role text not null default 'client',
  preferred_contact_method text not null default 'portal',
  email_notifications boolean not null default true,
  message_notifications boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique,
  client_profile_id uuid references public.profiles(id) on delete set null,
  client_name text not null,
  client_email text not null,
  client_phone text,
  company_name text,
  project_type text not null,
  selected_features jsonb not null default '[]'::jsonb,
  selected_automations jsonb not null default '[]'::jsonb,
  additional_notes text,
  custom_feature_description text,
  custom_feature_price integer not null default 0,
  design_level text not null default 'standard',
  selected_template text,
  revision_rounds text not null default '2',
  rush_delivery boolean not null default false,
  maintenance_plan text not null default 'none',
  payment_plan text not null default 'full',
  total_price integer not null,
  monthly_price integer not null default 0,
  estimated_weeks integer,
  status text not null default 'saved',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.intake_requests (
  id uuid primary key default gen_random_uuid(),
  intake_number text not null unique,
  client_profile_id uuid references public.profiles(id) on delete set null,
  quote_id uuid references public.quotes(id) on delete set null,
  client_name text not null,
  client_email text not null,
  company_name text,
  project_type text not null,
  description text not null,
  preferred_contact_method text not null default 'portal',
  status text not null default 'received',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  project_number text not null unique,
  quote_id uuid references public.quotes(id) on delete set null,
  intake_id uuid references public.intake_requests(id) on delete set null,
  client_profile_id uuid references public.profiles(id) on delete set null,
  client_email text,
  client_name text,
  company_name text,
  name text not null,
  project_type text not null,
  status text not null default 'planning',
  phase text,
  progress_percentage integer default 0,
  start_date timestamptz,
  estimated_completion timestamptz,
  total_cost integer default 0,
  paid_amount integer default 0,
  remaining_amount integer default 0,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_profile_id uuid references public.profiles(id) on delete set null,
  sender_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  uploaded_by_profile_id uuid references public.profiles(id) on delete set null,
  uploaded_by_label text,
  name text not null,
  file_url text,
  file_type text,
  file_size bigint,
  category text,
  storage_path text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.project_invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  invoice_number text not null unique,
  description text not null,
  amount_due integer not null,
  status text not null default 'pending',
  due_date timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  session_id text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists email text,
  add column if not exists full_name text,
  add column if not exists company_name text,
  add column if not exists phone text,
  add column if not exists role text not null default 'client',
  add column if not exists preferred_contact_method text not null default 'portal',
  add column if not exists email_notifications boolean not null default true,
  add column if not exists message_notifications boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.quotes
  add column if not exists client_profile_id uuid references public.profiles(id) on delete set null,
  add column if not exists additional_notes text;

alter table public.quotes
  alter column quote_number type text using quote_number::text;

alter table public.projects
  add column if not exists project_number text,
  add column if not exists intake_id uuid references public.intake_requests(id) on delete set null,
  add column if not exists client_profile_id uuid references public.profiles(id) on delete set null,
  add column if not exists client_email text,
  add column if not exists client_name text,
  add column if not exists company_name text,
  add column if not exists project_type text,
  add column if not exists phase text,
  add column if not exists progress_percentage integer default 0,
  add column if not exists total_cost integer default 0,
  add column if not exists paid_amount integer default 0,
  add column if not exists remaining_amount integer default 0,
  add column if not exists summary text;

alter table public.project_files
  add column if not exists uploaded_by uuid references public.profiles(id) on delete set null,
  add column if not exists uploaded_by_profile_id uuid references public.profiles(id) on delete set null,
  add column if not exists uploaded_by_label text,
  add column if not exists file_url text,
  add column if not exists file_type text,
  add column if not exists file_size bigint,
  add column if not exists category text,
  add column if not exists storage_path text,
  add column if not exists size_bytes bigint;

alter table public.project_files
  alter column file_url drop not null,
  alter column file_type drop not null,
  alter column file_size drop not null,
  alter column uploaded_by drop not null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'user_id'
  ) then
    execute $sql$
      update public.projects
      set client_profile_id = coalesce(client_profile_id, user_id)
      where client_profile_id is null
    $sql$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'progress'
  ) then
    execute $sql$
      update public.projects
      set progress_percentage = coalesce(progress_percentage, progress, 0)
      where progress_percentage is null
    $sql$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'description'
  ) then
    execute $sql$
      update public.projects
      set summary = coalesce(summary, description)
      where summary is null
    $sql$;
  end if;
end
$$;

update public.projects
set
  project_number = coalesce(project_number, 'PRJ-' || upper(substr(replace(id::text, '-', ''), 1, 8))),
  project_type = coalesce(project_type, 'custom_app'),
  progress_percentage = coalesce(progress_percentage, 0),
  total_cost = coalesce(total_cost, 0),
  paid_amount = coalesce(paid_amount, 0),
  remaining_amount = coalesce(remaining_amount, 0)
where true;

alter table public.projects
  drop constraint if exists projects_status_check;

alter table public.projects
  add constraint projects_status_check
  check (
    status = any (
      array[
        'planning',
        'in_review',
        'active',
        'on_hold',
        'completed',
        'cancelled',
        'discovery',
        'design',
        'development',
        'testing',
        'launched'
      ]
    )
  );

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'project_files'
      and column_name = 'uploaded_by'
  ) then
    execute $sql$
      update public.project_files
      set uploaded_by_label = coalesce(uploaded_by_label, uploaded_by::text)
      where uploaded_by_label is null
    $sql$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'project_files'
      and column_name = 'file_type'
  ) then
    execute $sql$
      update public.project_files
      set category = coalesce(category, file_type)
      where category is null
    $sql$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'project_files'
      and column_name = 'file_url'
  ) then
    execute $sql$
      update public.project_files
      set storage_path = coalesce(storage_path, file_url)
      where storage_path is null
    $sql$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'project_files'
      and column_name = 'file_size'
  ) then
    execute $sql$
      update public.project_files
      set size_bytes = coalesce(size_bytes, file_size)
      where size_bytes is null
    $sql$;
  end if;
end
$$;

create index if not exists quotes_client_profile_idx on public.quotes (client_profile_id, created_at desc);
create index if not exists intake_requests_client_profile_idx on public.intake_requests (client_profile_id, created_at desc);
create index if not exists projects_client_profile_idx on public.projects (client_profile_id, created_at desc);
create index if not exists project_messages_project_idx on public.project_messages (project_id, created_at desc);
create index if not exists project_files_project_idx on public.project_files (project_id, created_at desc);
create index if not exists project_invoices_project_idx on public.project_invoices (project_id, created_at desc);
create index if not exists page_views_path_idx on public.page_views (path, created_at desc);
create unique index if not exists quotes_quote_number_uidx on public.quotes (quote_number);
create unique index if not exists intake_requests_intake_number_uidx on public.intake_requests (intake_number);
create unique index if not exists projects_project_number_uidx on public.projects (project_number);
create unique index if not exists project_invoices_invoice_number_uidx on public.project_invoices (invoice_number);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.can_access_project(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.projects
    where id = target_project_id
      and (
        client_profile_id = auth.uid()
        or public.is_admin()
      )
  );
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_quotes_updated_at on public.quotes;
create trigger set_quotes_updated_at
before update on public.quotes
for each row
execute function public.set_updated_at();

drop trigger if exists set_intake_requests_updated_at on public.intake_requests;
create trigger set_intake_requests_updated_at
before update on public.intake_requests
for each row
execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.quotes enable row level security;
alter table public.intake_requests enable row level security;
alter table public.projects enable row level security;
alter table public.project_messages enable row level security;
alter table public.project_files enable row level security;
alter table public.project_invoices enable row level security;
alter table public.page_views enable row level security;

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
);

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
)
with check (
  id = auth.uid()
  or public.is_admin()
);

drop policy if exists "quotes_select_owner_or_admin" on public.quotes;
drop policy if exists "Allow anonymous inserts" on public.quotes;
drop policy if exists "Allow select for all" on public.quotes;
drop policy if exists "Admins can read all quotes" on public.quotes;
create policy "quotes_select_owner_or_admin"
on public.quotes
for select
to authenticated
using (
  client_profile_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "intake_requests_select_owner_or_admin" on public.intake_requests;
create policy "intake_requests_select_owner_or_admin"
on public.intake_requests
for select
to authenticated
using (
  client_profile_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "projects_select_owner_or_admin" on public.projects;
drop policy if exists "Admins can insert projects" on public.projects;
drop policy if exists "Admins can read all projects" on public.projects;
drop policy if exists "Admins can update projects" on public.projects;
drop policy if exists "Users can view own projects" on public.projects;
create policy "projects_select_owner_or_admin"
on public.projects
for select
to authenticated
using (
  client_profile_id = auth.uid()
  or public.is_admin()
);

drop policy if exists "project_messages_select_owner_or_admin" on public.project_messages;
create policy "project_messages_select_owner_or_admin"
on public.project_messages
for select
to authenticated
using (public.can_access_project(project_id));

drop policy if exists "project_files_select_owner_or_admin" on public.project_files;
drop policy if exists "Admins can read all files" on public.project_files;
drop policy if exists "Users can view own files" on public.project_files;
create policy "project_files_select_owner_or_admin"
on public.project_files
for select
to authenticated
using (public.can_access_project(project_id));

drop policy if exists "project_invoices_select_owner_or_admin" on public.project_invoices;
create policy "project_invoices_select_owner_or_admin"
on public.project_invoices
for select
to authenticated
using (public.can_access_project(project_id));

drop policy if exists "page_views_select_admin_only" on public.page_views;
create policy "page_views_select_admin_only"
on public.page_views
for select
to authenticated
using (public.is_admin());
