-- up.sql  ────────────────
-- Creates payment_orders table if it doesn’t exist

create table if not exists public.payment_orders (
  id            uuid                    default gen_random_uuid() primary key,
  order_id      text        not null unique,   -- Razorpay order_
  payment_id    text        unique,            -- Razorpay pay_
  user_id       uuid        not null references auth.users(id) on delete cascade,
  course_id     uuid        not null references public.courses(id) on delete cascade,
  amount        numeric(10,2) not null,        -- INR in rupees
  status        text        not null default 'created', -- created | success | failed
  meta          jsonb,                         -- optional extra info
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- keep updated_at in sync
create or replace function public.payment_orders_set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_payment_orders_set_updated_at
  on public.payment_orders;

create trigger trg_payment_orders_set_updated_at
  before update on public.payment_orders
  for each row execute procedure public.payment_orders_set_updated_at();

-- index to quickly find pending orders older than X minutes
create index if not exists payment_orders_status_created_idx
  on public.payment_orders (status, created_at);

--------------------------------------------------------------------
-- down.sql  (optional rollback)
-- drop table public.payment_orders;