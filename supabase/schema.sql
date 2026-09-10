-- Activity attribution for status/owner changes is handled in the app layer
-- (lib/leads.ts). Only the 'created' event is logged via a DB trigger.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  source text,
  owner_id uuid references public.profiles (id) on delete set null,
  status text not null default 'New'
    check (status in ('New', 'Contacted', 'Qualified', 'Won', 'Lost')),
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_activity (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  changed_by uuid references public.profiles (id) on delete set null,
  field_changed text not null,
  old_value text,
  new_value text,
  created_at timestamptz not null default now()
);

create or replace function public.set_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
before update on public.leads
for each row
execute function public.set_leads_updated_at();

create or replace function public.log_lead_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.lead_activity (
    lead_id,
    changed_by,
    field_changed,
    old_value,
    new_value
  )
  values (
    new.id,
    new.created_by,
    'created',
    null,
    null
  );
  return new;
end;
$$;

create trigger leads_log_created
after insert on public.leads
for each row
execute function public.log_lead_created();

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activity enable row level security;

create policy "Authenticated users can select profiles"
  on public.profiles for select
  to authenticated
  using (auth.uid() is not null);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Authenticated users can select leads"
  on public.leads for select
  to authenticated
  using (auth.uid() is not null);

create policy "Authenticated users can insert leads"
  on public.leads for insert
  to authenticated
  with check (auth.uid() is not null);

create policy "Authenticated users can update leads"
  on public.leads for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Authenticated users can delete leads"
  on public.leads for delete
  to authenticated
  using (auth.uid() is not null);

create policy "Authenticated users can select lead_activity"
  on public.lead_activity for select
  to authenticated
  using (auth.uid() is not null);

create policy "Authenticated users can insert lead_activity"
  on public.lead_activity for insert
  to authenticated
  with check (auth.uid() is not null);

create policy "Authenticated users can update lead_activity"
  on public.lead_activity for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Authenticated users can delete lead_activity"
  on public.lead_activity for delete
  to authenticated
  using (auth.uid() is not null);
