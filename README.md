# React Realm API Demo

A focused demonstration of a **RESTful API designed to support interaction with a relational database (PostgreSQL)**.

This repository supports the live demo page at:
https://reactrealm.org/api-demo/

The demo shows a JavaScript frontend retrieving data from a Node.js / Express API hosted at:
https://api.reactrealm.org

Course and lesson data are stored in PostgreSQL and retrieved dynamically at runtime.

## Goals of this repository

This repository exists to demonstrate, in a small but complete way, the following capabilities:

- Designing and implementing a **RESTful API** using versioned, resource-based endpoints
- Supporting **interaction with a relational database (PostgreSQL)**
- Modeling a simple one-to-many relationship (`courses -> lessons`)
- Structuring an Express application using **resource-based routing modules**
- Running a Node.js API as a managed **systemd service**
- Serving an API securely over HTTPS using **Apache + Let's Encrypt**
- Consuming live API data from a browser-based frontend
- Preserving frontend demo snippets used in a real deployed system

This project intentionally demonstrates a complete, end-to-end path:

database → API → browser

## Live demo

- Public page: https://reactrealm.org/api-demo/
- API base URL: https://api.reactrealm.org

Example endpoints:

- GET /health
- GET /api/v1/courses
- GET /api/v1/courses/:id
- GET /api/v1/courses/:id/lessons
- GET /api/v1/lessons/:id

## Architecture

### Frontend

The public-facing page is served from WordPress using Divi.

- Layout: WordPress + Divi modules
- Interactive content: Fluent Snippets
- Behavior: JavaScript calls the API and dynamically renders results

Each demo block:
- starts with a known course ID
- retrieves all data from the API on user interaction
- avoids hardcoding course content

### API layer

The API is implemented using:

- Node.js
- Express
- PostgreSQL client (`pg`)

Structure:

- `server.js` handles app initialization and route registration
- `routes/` contains resource-based route modules:
  - `health.js`
  - `courses.js`
  - `lessons.js`
- `db.js` provides a shared PostgreSQL connection pool

### Database layer

PostgreSQL stores relational data:

- `courses`
- `lessons`

Relationship:

- One course → many lessons
- Enforced via foreign key

### Service management

The API runs as a persistent systemd service:

- Service name: `reactrealm-api`
- Runs as unprivileged user
- Restart policy enabled
- Logs captured via journald

### Networking and TLS

- Apache handles HTTPS termination
- Certbot provides automatic certificate management
- Apache reverse proxies requests to:
  - `127.0.0.1:3000` (Node.js API)

## Repository layout

```text
.
├── database
│   ├── schema.sql
│   ├── seed.sql
│   └── setup.sql
├── LICENSE
├── package.json
├── package-lock.json
├── snippets
│   ├── api-demo.css
│   ├── course-1-demo.html
│   ├── course-2-demo.html
│   ├── course-3-demo.html
│   └── right-column-content.html
└── src
    ├── db.js
    ├── routes
    │   ├── courses.js
    │   ├── health.js
    │   └── lessons.js
    └── server.js
```

## Environment configuration

Database credentials and runtime configuration are provided via environment variables.

Example:

```bash
PGHOST=127.0.0.1
PGPORT=5432
PGDATABASE=reactrealm
PGUSER=reactrealm_user
PGPASSWORD=your_password_here
PORT=3000
NODE_ENV=production
```

In production, these are stored in:

```text
/etc/reactrealm-api.env
```

Referenced by systemd:

```ini
EnvironmentFile=/etc/reactrealm-api.env
```

## Prerequisite steps (fresh VM)

### Install Node.js dependencies

```bash
cd /opt/react-realm-platform/api
npm install
```

### Install PostgreSQL

```bash
sudo dnf install -y postgresql-server postgresql
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql
```

### Configure authentication

Edit:

```text
/var/lib/pgsql/data/pg_hba.conf
```

Change localhost entries from:

```
ident
```

to:

```
scram-sha-256
```

Restart:

```bash
sudo systemctl restart postgresql
```

### Create database and user

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE reactrealm;
CREATE USER reactrealm_user WITH PASSWORD 'CHANGE_ME';
GRANT ALL PRIVILEGES ON DATABASE reactrealm TO reactrealm_user;
\q
```

### Apply schema and seed

```bash
PGPASSWORD='CHANGE_ME' psql -h 127.0.0.1 -U reactrealm_user -d reactrealm -f database/schema.sql
PGPASSWORD='CHANGE_ME' psql -h 127.0.0.1 -U reactrealm_user -d reactrealm -f database/seed.sql
```

## Running the API

### Local development

```bash
node src/server.js
```

### systemd service

```bash
sudo systemctl daemon-reload
sudo systemctl restart reactrealm-api
sudo systemctl status reactrealm-api
```

## Verification

```bash
curl https://api.reactrealm.org/health
curl https://api.reactrealm.org/api/v1/courses
curl https://api.reactrealm.org/api/v1/courses/1
curl https://api.reactrealm.org/api/v1/courses/1/lessons
curl https://api.reactrealm.org/api/v1/lessons/1
```

The frontend page should also render data correctly.

## Data model notes

This API demonstrates two REST patterns:

- Nested resource:
  - `/api/v1/courses/:id/lessons`
- Direct lookup:
  - `/api/v1/lessons/:id`

These represent different access patterns based on client needs.

## Security note

- Credentials are NOT stored in source code
- Environment variables are used instead
- System-level config (`/etc/reactrealm-api.env`) is excluded from version control

## Future enhancements

- Add authentication layer
- Add POST/PUT endpoints
- Add rate limiting and security middleware
- Containerize with Docker
- Deploy using Kubernetes
- Expand schema (users, progress tracking)

## Why this repository matters

This repository demonstrates a complete system:

- relational database design
- RESTful API implementation
- modular Express architecture
- secure deployment with TLS
- live frontend integration

It provides a concrete example of how backend services interact with relational databases and deliver data to real user interfaces.
