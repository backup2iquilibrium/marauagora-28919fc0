create table if not exists public.quotes (
    id bigint primary key generated always as identity,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    soja text not null,
    milho text not null,
    source text not null
);

-- Enable RLS
alter table public.quotes enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access"
    on public.quotes
    for select
    to public
    using (true);

-- Create policy to allow public insert access (for the API to write)
-- Ideally this would be restricted to service role, but for this project structure
-- where the API might run as anon/authenticated, we'll allow insert for now.
-- A better approach in production would be to use a signed function or service role key.
create policy "Allow insert access"
    on public.quotes
    for insert
    to public
    with check (true);
