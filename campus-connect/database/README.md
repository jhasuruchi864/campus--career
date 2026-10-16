# Campus Connect Database Documentation

## 🗄️ Relational Model Architecture

The database architecture is designed with 3rd normal form (3NF) relational integrity, covering all collaboration, team formation, skill catalogs, and matching features.

### Entity Relationship Overview

```
                      +-------------------+
                      |       Users       |
                      +---------+---------+
                                |
             +------------------+------------------+
             | 1:1              | 1:N              | 1:N
             v                  v                  v
+--------------------+   +-------------+   +----------------+
|  Student Profiles  |   |  Projects   |   | Notifications  |
+---------+----------+   +------+------+   +----------------+
          |                     |
          | 1:N                 | 1:N
          v                     +-------------------+
+--------------------+          |                   |
|   Student Skills   |          v                   v
+---------+----------+   +--------------+   +---------------+
          |              | Project Skills|   | Team Members  |
          | N:1          +-------+------+   +-------+-------+
          v                      | N:1              |
+--------------------+           |                  |
|       Skills       |<----------+                  |
+--------------------+                              |
          ^                                         |
          |            +---------------+            |
          +------------+ Join Requests |<-----------+
                       +---------------+
```

### Table Dictionary

1. `users`: Stores login credentials (hashed passwords), full names, avatar URLs, and active states.
2. `student_profiles`: Detailed university metadata (major, graduation year, bio, portfolio links, availability).
3. `skills`: Master catalog of technical and soft skills (React, Python, Machine Learning, UI/UX, etc.).
4. `student_skills`: Association table linking students with their validated skills and self-reported proficiencies.
5. `projects`: Student-created capstone projects, hackathon initiatives, and research endeavors.
6. `project_skills`: Defines exact skills a project is actively seeking in new teammates.
7. `team_members`: Association table of accepted team members and assigned roles within a project.
8. `join_requests`: Applications submitted by students to join open projects with a personalized pitch.
9. `events`: College campus hackathons, technical workshops, and networking sessions.
10. `notifications`: Real-time user notification feed for join status updates and invitations.

---

## ⚡ Supabase Setup Quickstart

To run the database on **Supabase**:

1. **Create/Open your Supabase Project** at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** in the left sidebar.
3. Open [`database/supabase_schema.sql`](file:///d:/careercampus/campus-connect/database/supabase_schema.sql) from this project, copy all its contents, paste them into the SQL Editor, and click **Run**.
4. In Supabase, go to **Project Settings** -> **Database** -> **Connection string** (URI).
5. Choose **URI** under Connection pooling (Port 6543 or 5432) and copy the connection string.
6. In `campus-connect/backend/.env`, set:
   ```env
   DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require"
   ```
7. Start your backend:
   ```bash
   uvicorn app.main:app --reload
   ```
