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
