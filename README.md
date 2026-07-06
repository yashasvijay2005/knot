# KNOT — Knitting the Network of Talent
Full-stack event management system: **Spring Boot + MySQL** backend, **React** frontend.

## What's included
- JWT authentication (register/login) with roles: `ADMIN`, `ORGANIZER`, `ATTENDEE`
- Event CRUD (organizers create/edit/delete; anyone can browse/search)
- Event registration (attendees register/cancel; organizers view registrants)
- Talent profiles (any user can showcase skills, bio, portfolio; browsable directory)

```
knot-project/
├── backend/     Spring Boot (Java 17, Maven)
├── frontend/    React (Vite)
└── database/    setup.sql (reference only — Hibernate auto-creates tables)
```

---

## 1. Prerequisites

- **JDK 17+**
- **IntelliJ IDEA** (Community or Ultimate)
- **MySQL 8.x** installed and running
- **Node.js 18+** and npm (for the React frontend)
- Maven (IntelliJ has it bundled — no separate install needed)

---

## 2. MySQL Setup

You do **not** need to manually create tables — Hibernate does it automatically.
You only need MySQL running and a root password you know.

1. Start MySQL locally.
2. Confirm you can log in: `mysql -u root -p`
3. That's it. The app will auto-create the `knot_db` database on first run
   (via `createDatabaseIfNotExist=true` in the JDBC URL).

If your MySQL username/password isn't `root`/`root`, update these lines in
`backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=root
```

---

## 3. Backend Setup (IntelliJ)

1. Open IntelliJ → **File → Open** → select the `backend` folder.
2. IntelliJ will detect it's a Maven project and auto-import dependencies
   (watch the bottom-right progress bar; first import takes a minute or two
   since it downloads Spring Boot, Security, JPA, JWT, MySQL driver, Lombok).
3. **Enable annotation processing for Lombok** (required, since we use `@Builder`, `@Data`, etc.):
   - `Settings → Build, Execution, Deployment → Compiler → Annotation Processors`
   - Check **"Enable annotation processing"**
4. Install the **Lombok plugin** if not already installed:
   - `Settings → Plugins → Marketplace → search "Lombok" → Install → Restart IDE`
5. Open `src/main/java/com/knot/KnotApplication.java` and click the green ▶ Run button.
   - On first run, Hibernate will create the `knot_db` database and all tables automatically.
6. Backend runs on **http://localhost:8080**

### Quick test
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test Organizer","email":"organizer@test.com","password":"pass123","role":"ORGANIZER"}'
```
You should get back a JSON response with a `token`.

---

## 4. Frontend Setup

You can run this from IntelliJ's built-in terminal, or any terminal.

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173** and is pre-configured (in `src/api/axios.js`)
to call the backend at `http://localhost:8080/api`.

> IntelliJ Ultimate has JS/React support built in. IntelliJ Community works fine too —
> just use the integrated terminal to run the npm commands above.

---

## 5. Using the App

1. Go to `http://localhost:5173`
2. Register as an **Organizer** → create an event
3. Register as a separate **Attendee** (different email/browser or incognito tab) →
   browse events → register for the one the organizer created
4. Log back in as the organizer → open the event → see the registrant list
5. Either role can go to **Talent** → fill in skills/bio/portfolio to appear in the
   talent directory

To create an **ADMIN** user, either:
- Insert one directly into the `users` table with a BCrypt-hashed password (see
  `database/setup.sql` for the exact query), or
- Temporarily allow `ADMIN` in `RegisterRequest`/`AuthService` validation, register,
  then revert the change.

---

## 6. API Reference (quick)

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | none | `role`: `ORGANIZER` or `ATTENDEE` |
| POST | `/api/auth/login` | none | returns JWT |
| GET | `/api/events?keyword=&category=` | none | search/filter |
| GET | `/api/events/{id}` | none | |
| GET | `/api/events/my` | ORGANIZER | own events |
| POST | `/api/events` | ORGANIZER | create |
| PUT | `/api/events/{id}` | owner/ADMIN | update |
| DELETE | `/api/events/{id}` | owner/ADMIN | delete |
| POST | `/api/registrations/{eventId}` | ATTENDEE | register |
| DELETE | `/api/registrations/{id}` | owner/organizer/ADMIN | cancel |
| GET | `/api/registrations/my` | any | own registrations |
| GET | `/api/registrations/event/{eventId}` | owner/ADMIN | registrant list |
| GET | `/api/talent-profiles` | none | browse all |
| GET | `/api/talent-profiles/me` | any | own profile |
| PUT | `/api/talent-profiles/me` | any | create/update |
| GET | `/api/talent-profiles/user/{userId}` | none | view one |

All authenticated requests need header: `Authorization: Bearer <token>`

---

## 7. Troubleshooting

- **"Communications link failure" / can't connect to MySQL** → confirm MySQL is running
  on port 3306 and the credentials in `application.properties` are correct.
- **CORS errors in browser console** → confirm frontend runs on port 5173 (matches
  `app.cors.allowed-origins` in `application.properties`). If you change the frontend
  port, update that property too.
- **401 Unauthorized on protected routes** → token missing/expired; log out and log
  in again.
- **Lombok errors ("cannot find symbol" for getters/setters)** → make sure annotation
  processing is enabled (step 3 above) and the Lombok plugin is installed.

---

## 8. Suggested Next Features
- Admin dashboard to approve organizers/events
- Certificate generation (PDF) for attendees
- Email notifications on registration
- QR-code based event check-in
- Payment integration for paid events
