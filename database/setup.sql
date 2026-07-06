-- KNOT - Database Setup Script
-- This is OPTIONAL: Spring Boot (spring.jpa.hibernate.ddl-auto=update) will
-- auto-create the database and all tables the first time you run the backend.
-- Use this script only if you prefer to create the database manually first,
-- or want to seed an admin user.

CREATE DATABASE IF NOT EXISTS knot_database;
USE knot_db;

-- Tables below are created automatically by Hibernate on first run.
-- They are shown here for reference only:

-- users(id, full_name, email, password, role, created_at)
-- events(id, title, description, category, location, event_date, capacity, organizer_id, created_at)
-- registrations(id, event_id, user_id, registered_at)
-- talent_profiles(id, user_id, skills, bio, portfolio_link)

-- To seed an ADMIN user manually (after Hibernate has created the `users` table),
-- generate a BCrypt hash for your chosen password (e.g. using https://bcrypt-generator.com
-- or any BCrypt utility) and run:
--
-- INSERT INTO users (full_name, email, password, role, created_at)
-- VALUES ('Admin User', 'admin@knot.com', '$2a$10$REPLACE_WITH_BCRYPT_HASH', 'ADMIN', NOW());
