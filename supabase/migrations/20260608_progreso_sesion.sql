-- Persist in-progress test state so the orientado can quit/return without losing
-- answers or progress (ticket: "Persist responses even if someone quits or goes back").
--
-- One row per sesión, kept up to date continuously (auto-saved from the client)
-- so the app can show the right screen/section/answers and % advance on return.
--
-- Run this once in the Supabase SQL editor (or via the CLI) against the project
-- referenced in .env.local. The existing tables (usuarios, sesiones, ...) are
-- untouched — this only adds a new table + trigger.

create table if not exists progreso_sesion (
  id serial primary key,
  sesion_id integer not null references sesiones(id) on delete cascade,
  pantalla_actual character varying not null default 'welcome',
  seccion_actual smallint not null default 1,
  porcentaje_avance smallint not null default 0,
  estado jsonb not null default '{}'::jsonb,
  iniciado_en timestamp with time zone not null default now(),
  actualizado_en timestamp with time zone not null default now(),
  constraint progreso_sesion_sesion_id_key unique (sesion_id)
);

create index if not exists idx_progreso_sesion_sesion_id on progreso_sesion (sesion_id);

comment on table progreso_sesion is
  'Snapshot of in-progress test state per sesión: current screen/section, JSON of answers and duel state, % advance, start/last-modified timestamps. Upserted by /api/progreso as the user moves through the test.';
comment on column progreso_sesion.estado is
  'JSON snapshot of section1/section2/section3 state (open answers, duel results, indices) needed to fully restore where the user left off.';
comment on column progreso_sesion.iniciado_en is 'When the orientado first started this test (set on row creation).';
comment on column progreso_sesion.actualizado_en is 'When this progress snapshot was last saved (auto-updated by trigger below).';

-- Keep actualizado_en current automatically on every update — belt-and-suspenders
-- in case a future write path forgets to set it explicitly.
create or replace function set_progreso_sesion_actualizado_en()
returns trigger as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_progreso_sesion_actualizado_en on progreso_sesion;
create trigger trg_progreso_sesion_actualizado_en
  before update on progreso_sesion
  for each row
  execute function set_progreso_sesion_actualizado_en();
