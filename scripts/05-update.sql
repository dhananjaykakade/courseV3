-- payment metadata for paid courses
alter table public.user_enrollments
  add column if not exists order_id        text,
  add column if not exists payment_id      text,
  add column if not exists payment_verified boolean default false,
  add column if not exists amount          numeric,
  add column if not exists currency        text;

  -- prevent duplicates per user/course
alter table public.user_enrollments
  add constraint user_course_unique unique (user_id, course_id);

-- quick look-ups by Razorpay order
create index if not exists user_enrollments_order_id_idx on public.user_enrollments(order_id);