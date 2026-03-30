-- React Realm API Demo
-- PostgreSQL role/database setup
--
-- Run this as a PostgreSQL superuser, for example:
--   sudo -u postgres psql -f database/setup.sql
--
-- If the role or database already exists, adjust as needed.

-- Create application role
CREATE USER reactrealm_user WITH PASSWORD 'CHANGE_ME';

-- Create application database
CREATE DATABASE reactrealm OWNER reactrealm_user;

-- Connect to the new database
\connect reactrealm

-- Ensure the public schema is owned by the application role
ALTER SCHEMA public OWNER TO reactrealm_user;

-- Grant database-level privileges
GRANT ALL PRIVILEGES ON DATABASE reactrealm TO reactrealm_user;

-- Grant schema usage / creation
GRANT ALL ON SCHEMA public TO reactrealm_user;

-- Ensure future objects created in public are accessible to the app role
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON TABLES TO reactrealm_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON SEQUENCES TO reactrealm_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON FUNCTIONS TO reactrealm_user;
