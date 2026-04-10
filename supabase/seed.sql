-- Seed data for Zylane Coiffeur Barbier
-- Run after schema.sql

-- Workers
insert into workers (name, skills, email) values
  ('Gülsen', ARRAY['femmes','hommes','enfants'], 'owner@zylane.ch'),
  ('Employé 2', ARRAY['hommes','enfants'], null);

-- Services
insert into services (name, category, duration_minutes, price_display) values
  ('Coupe Femme', 'femmes', 45, 'Dès CHF 45'),
  ('Brushing', 'femmes', 30, 'Dès CHF 35'),
  ('Coloration', 'femmes', 60, 'Dès CHF 65'),
  ('Mèches / Balayage', 'femmes', 90, 'Dès CHF 80'),
  ('Coupe + Brushing', 'femmes', 60, 'Dès CHF 70'),
  ('Coupe Homme', 'hommes', 30, 'Dès CHF 30'),
  ('Coupe + Barbe', 'hommes', 45, 'Dès CHF 40'),
  ('Rasage classique', 'hommes', 30, 'Dès CHF 25'),
  ('Coupe Enfant (0-12 ans)', 'enfants', 20, 'Dès CHF 20'),
  ('Taille de barbe', 'barbe', 15, 'Dès CHF 15'),
  ('Rasage traditionnel', 'barbe', 25, 'Dès CHF 25'),
  ('Soin barbe complet', 'barbe', 35, 'Dès CHF 35');

-- Schedules (Tue-Sat for worker 1, Tue/Thu/Fri/Sat for worker 2)
-- Worker 1: Gülsen
insert into schedules (worker_id, day_of_week, start_time, end_time)
select w.id, s.dow, s.st, s.et
from workers w,
  (values (2, '08:30', '18:30'), (3, '08:30', '12:00'), (4, '08:30', '18:30'),
          (5, '08:30', '18:30'), (6, '08:30', '14:00')) as s(dow, st, et)
where w.name = 'Gülsen';

-- Worker 2
insert into schedules (worker_id, day_of_week, start_time, end_time)
select w.id, s.dow, s.st, s.et
from workers w,
  (values (2, '08:30', '18:30'), (4, '08:30', '18:30'),
          (5, '08:30', '18:30'), (6, '08:30', '14:00')) as s(dow, st, et)
where w.name = 'Employé 2';
