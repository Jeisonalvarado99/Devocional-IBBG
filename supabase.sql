-- Pega esto completo en Supabase → SQL Editor → Run.
-- Se puede ejecutar varias veces sin error.

create table if not exists public.devocionales (
  inicio date primary key,
  titulo text not null,
  fecha  text not null,
  anio   int  not null,
  img    text not null,
  pdf    text not null
);

alter table public.devocionales enable row level security;

drop policy if exists "ver"     on public.devocionales;
drop policy if exists "agregar" on public.devocionales;
drop policy if exists "borrar"  on public.devocionales;
create policy "ver"     on public.devocionales for select to anon using (true);
create policy "agregar" on public.devocionales for insert to anon with check (true);
create policy "borrar"  on public.devocionales for delete to anon using (true);

-- Carpeta pública para los PDF
insert into storage.buckets (id, name, public) values ('pdf', 'pdf', true)
on conflict (id) do update set public = true;

drop policy if exists "pdf ver"     on storage.objects;
drop policy if exists "pdf subir"   on storage.objects;
drop policy if exists "pdf cambiar" on storage.objects;
drop policy if exists "pdf borrar"  on storage.objects;
create policy "pdf ver"     on storage.objects for select to anon using (bucket_id = 'pdf');
create policy "pdf subir"   on storage.objects for insert to anon with check (bucket_id = 'pdf');
create policy "pdf cambiar" on storage.objects for update to anon using (bucket_id = 'pdf') with check (bucket_id = 'pdf');
create policy "pdf borrar"  on storage.objects for delete to anon using (bucket_id = 'pdf');
