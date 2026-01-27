-- Tabela para mensagens do formulário "Fale Conosco"
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new',
  user_id uuid null
);

create index if not exists idx_contact_messages_created_at on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- Segurança (PII): negar leitura direta para qualquer role via PostgREST
create policy "No direct select on contact_messages"
on public.contact_messages
for select
using (false);

-- (Opcional) permitir que usuário autenticado veja apenas suas próprias mensagens (se user_id estiver preenchido)
create policy "Authenticated can select their own contact_messages"
on public.contact_messages
for select
to authenticated
using (auth.uid() = user_id);

-- Não criamos políticas de INSERT/UPDATE/DELETE: somente Edge Function (service role) poderá inserir/alterar.
