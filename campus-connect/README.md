# Campus Connect 🎓🤝🤖

> **An AI-Powered University Student Collaboration & Teammate Discovery Platform**

Campus Connect bridges the gap between ambitious college students seeking collaborators, multidisciplinary projects, and campus hackathons/events. Powered by intelligent skill-overlap matching, role compatibility, and transparent match scoring, it empowers students to build winning teams.

---

## 🏛️ Project Architecture

```
campus-connect/
├── frontend/                # React (Vite) + Vanilla CSS Design System
│   ├── public/              # Static assets & public media
│   └── src/
│       ├── components/      # Common, layout, project, student, and event widgets
│       ├── pages/           # High-level route pages (Home, Dashboard, Projects, etc.)
│       ├── css/             # Scoped modern design system (variables, components, layout)
│       ├── js/utils/        # Client-side helper functions & constants
│       ├── services/        # Axios/Fetch API gateway adapters
│       ├── context/         # Auth and Toast global state providers
│       ├── hooks/           # Reusable custom React hooks
│       └── assets/          # SVG icons & UI illustrations
├── backend/                 # Python 3 + FastAPI + SQLAlchemy ORM
│   ├── app/
│   │   ├── core/            # Configuration, JWT authentication & security
│   │   ├── db/              # Database engine, session maker & declarative base
│   │   ├── models/          # SQLAlchemy relational models
│   │   ├── schemas/         # Pydantic request/response validation schemas
│   │   ├── repositories/    # Clean DB query abstractions
│   │   ├── services/        # Business logic operations
│   │   ├── api/v1/          # RESTful route controllers
│   │   └── ai/              # TF-IDF, Cosine Similarity & Match Explainer engine
│   ├── tests/               # Pytest unit & integration test suites
│   ├── alembic/             # Database schema migrations
│   └── requirements.txt     # Python production dependencies
└── database/                # Relational DDL definitions & sample seed data
    ├── schema.sql           # Pure PostgreSQL DDL schema definition
    ├── seeds.sql            # Demo university profiles, skills, and projects
    └── README.md            # Database architecture & ER diagram documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (v24+ recommended)
- **Python**: v3.10+ (v3.13 recommended)
- **PostgreSQL**: (or SQLite fallback for zero-setup local execution)

### 1. Frontend Setup
```bash
cd campus-connect/frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`

### 2. Backend Setup
```bash
cd campus-connect/backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation available at: `http://localhost:8000/docs`

---

## 🧠 AI Teammate Matching Engine
The matching engine leverages:
1. **Skill Vectorization (TF-IDF & Jaccard Overlap)**: Evaluates requested vs candidate skillsets.
2. **Role & Domain Alignment**: Matches candidate interests with project category goals.
3. **Transparent Explainability**: Computes breakdown percentages (e.g., 85% Match: 60% Skill Match, 25% Experience/Role Match) with actionable skill-gap recommendations.
