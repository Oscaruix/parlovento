create extension if not exists pgcrypto;

create type public.inquiry_status as enum ('new','contacted','visit_scheduled','quoted','won','lost');
create type public.event_status as enum ('hold','visit','confirmed','blocked');
create type public.quote_status as enum ('draft','sent','accepted','expired','cancelled');
create type public.payment_status as enum ('pending','paid','failed','refunded');
create type public.conversation_kind as enum ('public','internal');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'owner' check (role in ('owner','staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.packages (
  id uuid primary key default gen_random_uuid(), name text not null, description text not null,
  price_cents integer not null default 0 check (price_cents >= 0), featured boolean not null default false,
  active boolean not null default true, inclusions text[] not null default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.services (
  id uuid primary key default gen_random_uuid(), name text not null, description text not null default '',
  price_cents integer not null default 0 check (price_cents >= 0), unit text not null default 'servicio', active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.faqs (
  id uuid primary key default gen_random_uuid(), question text not null, answer text not null,
  sort_order integer not null default 0, active boolean not null default true, updated_at timestamptz not null default now()
);
create table public.customers (
  id uuid primary key default gen_random_uuid(), name text not null, email text, phone text not null, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.inquiries (
  id uuid primary key default gen_random_uuid(), customer_id uuid references public.customers(id) on delete set null,
  status public.inquiry_status not null default 'new', event_type text not null, event_date date,
  guest_count integer check (guest_count is null or guest_count between 1 and 450),
  budget_cents integer check (budget_cents is null or budget_cents >= 0), requested_services text[] not null default '{}',
  special_requests text, source text not null default 'web', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.venue_events (
  id uuid primary key default gen_random_uuid(), inquiry_id uuid references public.inquiries(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null, title text not null, event_date date not null,
  start_time time, end_time time, status public.event_status not null default 'hold', notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index venue_events_confirmed_date on public.venue_events(event_date) where status in ('confirmed','blocked');
create index venue_events_date_idx on public.venue_events(event_date);
create table public.quotes (
  id uuid primary key default gen_random_uuid(), inquiry_id uuid references public.inquiries(id) on delete set null,
  customer_id uuid not null references public.customers(id) on delete restrict, folio text not null unique,
  status public.quote_status not null default 'draft', event_date date, subtotal_cents integer not null default 0,
  discount_cents integer not null default 0, total_cents integer not null default 0, deposit_cents integer not null default 0,
  notes text, valid_until date, pdf_path text, version integer not null default 1,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.quote_items (
  id uuid primary key default gen_random_uuid(), quote_id uuid not null references public.quotes(id) on delete cascade,
  package_id uuid references public.packages(id) on delete set null, service_id uuid references public.services(id) on delete set null,
  description text not null, quantity integer not null check (quantity between 1 and 450),
  unit_price_cents integer not null check (unit_price_cents >= 0), total_cents integer generated always as (quantity * unit_price_cents) stored,
  created_at timestamptz not null default now()
);
create table public.payments (
  id uuid primary key default gen_random_uuid(), quote_id uuid not null references public.quotes(id) on delete restrict,
  amount_cents integer not null check (amount_cents > 0), status public.payment_status not null default 'pending', method text,
  due_date date, paid_at timestamptz, reference text, created_at timestamptz not null default now()
);
create table public.conversations (
  id uuid primary key default gen_random_uuid(), kind public.conversation_kind not null default 'public',
  customer_id uuid references public.customers(id) on delete set null, inquiry_id uuid references public.inquiries(id) on delete set null,
  visitor_token_hash text, title text, created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.messages (
  id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')), content text not null check (char_length(content) <= 5000),
  created_at timestamptz not null default now()
);
create table public.activities (
  id uuid primary key default gen_random_uuid(), inquiry_id uuid references public.inquiries(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade, actor_id uuid references auth.users(id) on delete set null,
  type text not null, description text not null, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  title text not null, body text not null, read_at timestamptz, href text, created_at timestamptz not null default now()
);
create table public.settings (
  id uuid primary key default gen_random_uuid(), key text not null unique, value jsonb not null default '{}', updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, full_name) values(new.id, coalesce(new.raw_user_meta_data->>'full_name','Propietario')) on conflict(id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger packages_updated before update on public.packages for each row execute function public.set_updated_at();
create trigger services_updated before update on public.services for each row execute function public.set_updated_at();
create trigger customers_updated before update on public.customers for each row execute function public.set_updated_at();
create trigger inquiries_updated before update on public.inquiries for each row execute function public.set_updated_at();
create trigger events_updated before update on public.venue_events for each row execute function public.set_updated_at();
create trigger quotes_updated before update on public.quotes for each row execute function public.set_updated_at();
create trigger conversations_updated before update on public.conversations for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.packages enable row level security;
alter table public.services enable row level security;
alter table public.faqs enable row level security;
alter table public.customers enable row level security;
alter table public.inquiries enable row level security;
alter table public.venue_events enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.payments enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.activities enable row level security;
alter table public.notifications enable row level security;
alter table public.settings enable row level security;

create policy profiles_own_select on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy profiles_own_update on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy packages_public_read on public.packages for select to anon, authenticated using (active or (select auth.uid()) is not null);
create policy services_public_read on public.services for select to anon, authenticated using (active or (select auth.uid()) is not null);
create policy faqs_public_read on public.faqs for select to anon, authenticated using (active or (select auth.uid()) is not null);
create policy events_public_availability on public.venue_events for select to anon using (status in ('confirmed','blocked'));
create policy packages_staff_all on public.packages for all to authenticated using (true) with check (true);
create policy services_staff_all on public.services for all to authenticated using (true) with check (true);
create policy faqs_staff_all on public.faqs for all to authenticated using (true) with check (true);
create policy customers_staff_all on public.customers for all to authenticated using (true) with check (true);
create policy inquiries_staff_all on public.inquiries for all to authenticated using (true) with check (true);
create policy events_staff_all on public.venue_events for all to authenticated using (true) with check (true);
create policy quotes_staff_all on public.quotes for all to authenticated using (true) with check (true);
create policy quote_items_staff_all on public.quote_items for all to authenticated using (true) with check (true);
create policy payments_staff_all on public.payments for all to authenticated using (true) with check (true);
create policy conversations_staff_all on public.conversations for all to authenticated using (true) with check (true);
create policy messages_staff_all on public.messages for all to authenticated using (true) with check (true);
create policy activities_staff_all on public.activities for all to authenticated using (true) with check (true);
create policy notifications_own_all on public.notifications for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy settings_staff_all on public.settings for all to authenticated using (true) with check (true);

grant select on public.packages, public.services, public.faqs, public.venue_events to anon;
grant all on all tables in schema public to authenticated;

insert into public.packages(name, description, price_cents, featured, inclusions) values
('Esencial Jardín','Una base flexible para celebraciones íntimas y eventos de día.',0,false,array['Uso del jardín','Mobiliario base','Coordinación de acceso']),
('Noche Parlovento','La experiencia completa de jardín y palapa iluminada.',0,true,array['Jardín y palapa','Iluminación ambiental','Mobiliario base','Coordinación del recinto']),
('Gran Celebración','Espacios completos para eventos de mayor formato.',0,false,array['Exclusividad del recinto','Montaje extendido','Área de ceremonia','Coordinación del recinto']);
insert into public.services(name, description, price_cents, unit) values
('Iluminación especial','Diseño adicional de luz ambiental.',0,'evento'),
('Hora adicional','Extensión sujeta a disponibilidad.',0,'hora'),
('Coordinación del día','Acompañamiento operativo durante el evento.',0,'evento');
insert into public.faqs(question, answer, sort_order) values
('¿Cuál es la capacidad del salón?','Parlovento recibe eventos de hasta 450 personas, según el tipo de montaje.',1),
('¿Puedo agendar una visita?','Sí. Comparte tu fecha preferida en el chat y el equipo te contactará para coordinarla.',2),
('¿Los precios publicados son definitivos?','No. Los paquetes iniciales son demostrativos y cada cotización se personaliza según fecha, invitados y servicios.',3),
('¿Cómo aparto una fecha?','La fecha se confirma una vez aceptada la cotización y registrado el anticipo acordado.',4);
insert into public.settings(key,value) values
('business', '{"name":"Parlovento","capacity":450,"phone":"","address":"México","email":"","demoPricing":true}'::jsonb),
('assistant', '{"tone":"cercano y profesional","language":"es-MX"}'::jsonb);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('quote-pdfs','quote-pdfs',false,10485760,array['application/pdf']) on conflict(id) do nothing;
create policy quote_pdfs_staff_select on storage.objects for select to authenticated using (bucket_id = 'quote-pdfs');
create policy quote_pdfs_staff_insert on storage.objects for insert to authenticated with check (bucket_id = 'quote-pdfs');
create policy quote_pdfs_staff_update on storage.objects for update to authenticated using (bucket_id = 'quote-pdfs') with check (bucket_id = 'quote-pdfs');
