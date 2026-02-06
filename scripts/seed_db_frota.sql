-- Seed script for db_frota (PostgreSQL)
-- Usage: psql -d db_frota -f scripts/seed_db_frota.sql

BEGIN;

-- Optional: ensure bcrypt hashing is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_clients_type') THEN
    CREATE TYPE enum_clients_type AS ENUM ('fisica', 'juridica');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_deliveries_status') THEN
    CREATE TYPE enum_deliveries_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_licenses_category') THEN
    CREATE TYPE enum_licenses_category AS ENUM ('ACC', 'A', 'B', 'C', 'D', 'E');
  END IF;
END$$;

-- Tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  birth DATE NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  cod_client VARCHAR(12) NOT NULL UNIQUE,
  type enum_clients_type NOT NULL DEFAULT 'fisica',
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(255) UNIQUE,
  company_name VARCHAR(255),
  cnpj VARCHAR(255) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  sender_name VARCHAR(255) NOT NULL,
  sender_phone VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  recipient_phone VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  zip_code VARCHAR(255) NOT NULL,
  package_description VARCHAR(255) NOT NULL,
  origin_address VARCHAR(255) NOT NULL,
  destination_address VARCHAR(255) NOT NULL,
  origin_latitude DECIMAL(10,8) NOT NULL,
  origin_longitude DECIMAL(11,8) NOT NULL,
  destination_latitude DECIMAL(10,8) NOT NULL,
  destination_longitude DECIMAL(11,8) NOT NULL,
  status enum_deliveries_status NOT NULL DEFAULT 'pending',
  assigned_driver_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_by_controller_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  client_id INTEGER REFERENCES clients(id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS licenses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(255) NOT NULL,
  category enum_licenses_category NOT NULL,
  expiry_date DATE NOT NULL,
  primary_date DATE NOT NULL,
  mirror VARCHAR(255) NOT NULL,
  number_register VARCHAR(255) NOT NULL,
  ear BOOLEAN DEFAULT false,
  courses VARCHAR(255),
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  license_url VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_cod_client ON clients (cod_client);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients (email);
CREATE INDEX IF NOT EXISTS idx_clients_cpf ON clients (cpf);
CREATE INDEX IF NOT EXISTS idx_clients_cnpj ON clients (cnpj);
CREATE INDEX IF NOT EXISTS idx_deliveries_client_id ON deliveries (client_id);

-- Cleanup
TRUNCATE TABLE
  licenses,
  deliveries,
  clients,
  users
RESTART IDENTITY CASCADE;

-- Users
INSERT INTO users (
  first_name,
  last_name,
  phone,
  birth,
  email,
  password,
  role,
  active,
  created_at,
  updated_at
) VALUES
  ('Administrador', 'do Sistema', '0000-0000', '1990-01-01', 'admin@email.com', '$2b$10$sgBNlGD6bfh8i7P6.FXGKORFqYAfXGlU387xoFzpZvU/6KVM9GKyu', 'admin', true, NOW(), NOW()),
  ('Controlador', 'do Sistema', '1111-1111', '1995-05-15', 'controller@email.com', '$2b$10$y8ABTjAx/7dZ3TmQ/iZBLu/aNubUsCaVpLrLc.oOyYJPTC1.TCkxa', 'controller', true, NOW(), NOW()),
  ('Motorista', 'do Sistema', '2222-2222', '1998-08-20', 'driver@email.com', '$2b$10$w30/3nTxpSoXL3zNF.3HEec3vxnvaU01A3Ut..naXQBh1qba7K4Xm', 'driver', true, NOW(), NOW()),
  ('Fabio', 'Venceslau de Souza', '3333-3333', '1998-08-20', 'fabio.venceslau@email.com', '$2b$10$HTgIEjH3dHjB8MeLKHDZEuMt289QsqSMN/lKKSe.97bkwLh/GClni', 'driver', true, NOW(), NOW()),
  ('Ayla', 'Nunes Venceslau', '4444-4444', '1998-08-20', 'ayla.venceslau@email.com', '$2b$10$HTgIEjH3dHjB8MeLKHDZEuMt289QsqSMN/lKKSe.97bkwLh/GClni', 'controller', true, NOW(), NOW()),
  ('Daniel', 'Moura', '5555-5555', '1998-08-20', 'daniel.moura@email.com', '$2b$10$HTgIEjH3dHjB8MeLKHDZEuMt289QsqSMN/lKKSe.97bkwLh/GClni', 'admin', true, NOW(), NOW()),
  ('Camila', 'Silva', '6666-6666', '1992-04-12', 'camila.silva@email.com', '$2b$10$HTgIEjH3dHjB8MeLKHDZEuMt289QsqSMN/lKKSe.97bkwLh/GClni', 'driver', true, NOW(), NOW()),
  ('Gustavo', 'Pereira', '7777-7777', '1989-10-03', 'gustavo.pereira@email.com', '$2b$10$HTgIEjH3dHjB8MeLKHDZEuMt289QsqSMN/lKKSe.97bkwLh/GClni', 'controller', true, NOW(), NOW());

-- Clients
INSERT INTO clients (
  cod_client,
  type,
  name,
  cpf,
  company_name,
  cnpj,
  email,
  phone,
  address,
  city,
  state,
  zip_code,
  active,
  created_at,
  updated_at
) VALUES
  ('CLI000001', 'fisica', 'Ana Souza', '12345678901', NULL, NULL, 'ana.souza@example.com', '62999990001', 'Rua 1, 100', 'Goiania', 'GO', '74000000', true, NOW(), NOW()),
  ('CLI000002', 'fisica', 'Bruno Lima', '12345678902', NULL, NULL, 'bruno.lima@example.com', '62999990002', 'Av. Central, 200', 'Goiania', 'GO', '74001000', true, NOW(), NOW()),
  ('CLI000003', 'fisica', 'Carla Mendes', '12345678903', NULL, NULL, 'carla.mendes@example.com', '62999990003', 'Rua 3, 300', 'Goiania', 'GO', '74002000', true, NOW(), NOW()),
  ('CLI000004', 'juridica', 'Comercial XP', NULL, 'XP Comercio LTDA', '12345678000190', 'contato@xpcomercio.com', '6233330001', 'Av. Goias, 500', 'Goiania', 'GO', '74003000', true, NOW(), NOW()),
  ('CLI000005', 'juridica', 'Logistica Norte', NULL, 'Logistica Norte SA', '12345678000191', 'contato@logisticanorte.com', '6233330002', 'Rua 44, 900', 'Goiania', 'GO', '74004000', true, NOW(), NOW()),
  ('CLI000006', 'juridica', 'Industria Alto', NULL, 'Industria Alto LTDA', '12345678000192', 'contato@industriaalto.com', '6233330003', 'Av. Anhanguera, 1200', 'Goiania', 'GO', '74005000', true, NOW(), NOW()),
  ('CLI000007', 'fisica', 'Diego Rocha', '12345678904', NULL, NULL, 'diego.rocha@example.com', '62999990004', 'Rua 7, 700', 'Goiania', 'GO', '74006000', true, NOW(), NOW()),
  ('CLI000008', 'juridica', 'Tech One', NULL, 'Tech One SA', '12345678000193', 'contato@techone.com', '6233330004', 'Av. T1, 1300', 'Goiania', 'GO', '74007000', true, NOW(), NOW());

-- Licenses (one per user)
WITH u AS (
  SELECT id, email FROM users WHERE email IN (
    'driver@email.com',
    'fabio.venceslau@email.com',
    'admin@email.com',
    'controller@email.com',
    'ayla.venceslau@email.com',
    'daniel.moura@email.com',
    'camila.silva@email.com',
    'gustavo.pereira@email.com'
  )
)
INSERT INTO licenses (
  user_id,
  name,
  cpf,
  category,
  expiry_date,
  primary_date,
  mirror,
  number_register,
  ear,
  courses,
  license_url,
  created_at,
  updated_at
)
SELECT u.id, 'MOTORISTA DO SISTEMA', '12345678909', 'C'::enum_licenses_category, '2027-12-31'::date, '2018-03-15'::date, 'ESP001', '12345678901', false, 'Direcao Defensiva', NULL, NOW(), NOW()
FROM u WHERE u.email = 'driver@email.com'
UNION ALL
SELECT u.id, 'FABIO VENCESLAU DE SOUZA', '98765432100', 'D'::enum_licenses_category, '2028-06-30'::date, '2015-08-20'::date, 'ESP002', '98765432100', false, 'Transporte de Passageiros', NULL, NOW(), NOW()
FROM u WHERE u.email = 'fabio.venceslau@email.com'
UNION ALL
SELECT u.id, 'ADMINISTRADOR DO SISTEMA', '11122233344', 'B'::enum_licenses_category, '2026-09-15'::date, '2010-05-10'::date, 'ESP003', '11122233344', false, 'Direcao Defensiva', NULL, NOW(), NOW()
FROM u WHERE u.email = 'admin@email.com'
UNION ALL
SELECT u.id, 'CONTROLADOR DO SISTEMA', '55566677788', 'B'::enum_licenses_category, '2027-03-20'::date, '2016-11-25'::date, 'ESP004', '55566677788', true, 'Direcao Defensiva', NULL, NOW(), NOW()
FROM u WHERE u.email = 'controller@email.com'
UNION ALL
SELECT u.id, 'AYLA NUNES VENCESLAU', '22233344455', 'B'::enum_licenses_category, '2029-01-10'::date, '2020-02-14'::date, 'ESP005', '22233344455', false, 'Direcao Defensiva', NULL, NOW(), NOW()
FROM u WHERE u.email = 'ayla.venceslau@email.com'
UNION ALL
SELECT u.id, 'DANIEL MOURA', '44455566677', 'E'::enum_licenses_category, '2026-11-30'::date, '2012-07-08'::date, 'ESP006', '44455566677', false, 'Transporte de Cargas', NULL, NOW(), NOW()
FROM u WHERE u.email = 'daniel.moura@email.com'
UNION ALL
SELECT u.id, 'CAMILA SILVA', '55544433322', 'B'::enum_licenses_category, '2028-11-30'::date, '2016-07-08'::date, 'ESP007', '55544433322', false, 'Direcao Defensiva', NULL, NOW(), NOW()
FROM u WHERE u.email = 'camila.silva@email.com'
UNION ALL
SELECT u.id, 'GUSTAVO PEREIRA', '66655544433', 'B'::enum_licenses_category, '2029-05-10'::date, '2017-02-14'::date, 'ESP008', '66655544433', false, 'Direcao Defensiva', NULL, NOW(), NOW()
FROM u WHERE u.email = 'gustavo.pereira@email.com';

-- Deliveries (base set)
WITH
  controller AS (
    SELECT id FROM users WHERE role = 'controller' ORDER BY id LIMIT 1
  ),
  driver1 AS (
    SELECT id FROM users WHERE email = 'driver@email.com' LIMIT 1
  ),
  driver2 AS (
    SELECT id FROM users WHERE email = 'fabio.venceslau@email.com' LIMIT 1
  ),
  c1 AS (SELECT id FROM clients WHERE cod_client = 'CLI000001' LIMIT 1),
  c2 AS (SELECT id FROM clients WHERE cod_client = 'CLI000002' LIMIT 1),
  c3 AS (SELECT id FROM clients WHERE cod_client = 'CLI000003' LIMIT 1),
  c4 AS (SELECT id FROM clients WHERE cod_client = 'CLI000004' LIMIT 1)
INSERT INTO deliveries (
  sender_name,
  sender_phone,
  recipient_name,
  recipient_phone,
  address,
  city,
  zip_code,
  package_description,
  origin_address,
  destination_address,
  origin_latitude,
  origin_longitude,
  destination_latitude,
  destination_longitude,
  status,
  assigned_driver_id,
  created_by_controller_id,
  client_id,
  created_at,
  updated_at
) VALUES
  ('Joao Silva', '62999990001', 'Maria Souza', '62988880001', 'Av. Goias, 100', 'Goiania', '74000000', 'Documentos', 'Setor Central, Goiania - GO', 'Jardim Guanabara, Goiania - GO', -16.6799, -49.2550, -16.6395, -49.2352, 'pending', NULL, (SELECT id FROM controller), (SELECT id FROM c1), NOW(), NOW()),
  ('Carlos Pereira', '62999990002', 'Ana Lima', '62988880002', 'Rua 44, 200', 'Goiania', '74003000', 'Roupas', 'Setor Central, Goiania - GO', 'Santa Genoveva, Goiania - GO', -16.6799, -49.2550, -16.5964, -49.2221, 'in_progress', (SELECT id FROM driver1), (SELECT id FROM controller), (SELECT id FROM c2), NOW(), NOW()),
  ('Empresa XP', '6233330001', 'Lucas Rocha', '62988880003', 'Av. Anhanguera, 500', 'Goiania', '74110010', 'Eletronicos', 'Shopping Flamboyant, Goiania - GO', 'Setor Bueno, Goiania - GO', -16.7027, -49.2304, -16.7082, -49.2663, 'completed', (SELECT id FROM driver2), (SELECT id FROM controller), (SELECT id FROM c3), NOW(), NOW()),
  ('Marcos Lima', '62999990004', 'Fernanda Alves', '62988880004', 'Av. Perimetral Norte', 'Goiania', '74640000', 'Eletrodomestico', 'Vale dos Sonhos, Goiania - GO', 'Shopping Passeio das Aguas, Goiania - GO', -16.5960, -49.2980, -16.6289, -49.3164, 'cancelled', NULL, (SELECT id FROM controller), (SELECT id FROM c4), NOW(), NOW());

-- Deliveries (bulk mock)
WITH
  controller AS (
    SELECT id FROM users WHERE role = 'controller' ORDER BY id LIMIT 1
  ),
  drivers AS (
    SELECT id FROM users WHERE role = 'driver' ORDER BY id
  ),
  clients AS (
    SELECT id FROM clients ORDER BY id
  ),
  series AS (
    SELECT
      gs,
      (SELECT id FROM controller) AS controller_id,
      (SELECT id FROM drivers ORDER BY id OFFSET ((gs - 1) % (SELECT COUNT(*) FROM drivers)) LIMIT 1) AS driver_id,
      (SELECT id FROM clients ORDER BY id OFFSET ((gs - 1) % (SELECT COUNT(*) FROM clients)) LIMIT 1) AS client_id
    FROM generate_series(1, 30) AS gs
  )
INSERT INTO deliveries (
  sender_name,
  sender_phone,
  recipient_name,
  recipient_phone,
  address,
  city,
  zip_code,
  package_description,
  origin_address,
  destination_address,
  origin_latitude,
  origin_longitude,
  destination_latitude,
  destination_longitude,
  status,
  assigned_driver_id,
  created_by_controller_id,
  client_id,
  created_at,
  updated_at
)
SELECT
  'Remetente ' || gs,
  '6299' || LPAD(gs::text, 7, '0'),
  'Destinatario ' || gs,
  '6288' || LPAD(gs::text, 7, '0'),
  'Rua ' || gs || ', ' || (100 + gs),
  'Goiania',
  '7400' || LPAD((gs % 100)::text, 4, '0'),
  'Pacote ' || gs,
  'Origem ' || gs || ', Goiania - GO',
  'Destino ' || gs || ', Goiania - GO',
  (-16.70 + (gs * 0.001))::numeric(10, 8),
  (-49.30 + (gs * 0.001))::numeric(11, 8),
  (-16.65 + (gs * 0.001))::numeric(10, 8),
  (-49.25 + (gs * 0.001))::numeric(11, 8),
  (CASE
    WHEN gs % 4 = 0 THEN 'pending'
    WHEN gs % 4 = 1 THEN 'in_progress'
    WHEN gs % 4 = 2 THEN 'completed'
    ELSE 'cancelled'
  END)::enum_deliveries_status,
  CASE
    WHEN gs % 4 IN (1, 2) THEN driver_id
    ELSE NULL
  END,
  controller_id,
  client_id,
  NOW(),
  NOW()
FROM series;

COMMIT;
