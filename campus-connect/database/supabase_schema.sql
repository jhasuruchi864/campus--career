-- ==============================================================================
-- Campus Connect - Supabase PostgreSQL Database Setup Script
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your Project -> Click on "SQL Editor" in the left sidebar.
-- 3. Click "New Query", paste the entire contents of this file, and click "Run".
-- ==============================================================================

-- 0. Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. Tables Creation
-- ==============================================================================

-- 1.1 Users (Core Authentication & Credentials)
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_superuser BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 1.2 Student Profiles (Extended student metadata, portfolio, college)
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    university VARCHAR(255) NOT NULL,
    major VARCHAR(150) NOT NULL,
    graduation_year INTEGER NOT NULL,
    bio TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    preferred_role VARCHAR(100),
    interests TEXT,
    availability_hours_per_week INTEGER DEFAULT 10 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 1.3 Skills Master Catalog
CREATE TABLE IF NOT EXISTS public.skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL -- Frontend, Backend, AI/ML, Design, Database, DevOps, Cloud, Tools
);

-- 1.4 Student Skills (Student-Skill association with proficiency)
CREATE TABLE IF NOT EXISTS public.student_skills (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50) DEFAULT 'Intermediate' NOT NULL, -- Beginner, Intermediate, Advanced, Expert
    years_experience NUMERIC(3, 1) DEFAULT 1.0 NOT NULL,
    CONSTRAINT uq_profile_skill UNIQUE (profile_id, skill_id)
);

-- 1.5 Projects (Student-initiated startup, research & hackathon projects)
CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    tagline VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- AI & Machine Learning, Web Development, Mobile Apps, Open Source, Hardware
    status VARCHAR(50) DEFAULT 'Recruiting' NOT NULL, -- Recruiting, In Progress, Completed
    max_team_size INTEGER DEFAULT 4 NOT NULL,
    github_repo VARCHAR(255),
    demo_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 1.6 Project Required Skills
CREATE TABLE IF NOT EXISTS public.project_skills (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    required_level VARCHAR(50) DEFAULT 'Intermediate' NOT NULL,
    CONSTRAINT uq_project_skill UNIQUE (project_id, skill_id)
);

-- 1.7 Project Team Members
CREATE TABLE IF NOT EXISTS public.team_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_team_project_user UNIQUE (project_id, user_id)
);

-- 1.8 Project Join Requests (Applications to join a team)
CREATE TABLE IF NOT EXISTS public.join_requests (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    applicant_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    pitch_message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' NOT NULL, -- Pending, Accepted, Rejected
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_join_project_applicant UNIQUE (project_id, applicant_id)
);

-- 1.9 Campus Events (Hackathons, Workshops, Tech Talks)
CREATE TABLE IF NOT EXISTS public.events (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- Hackathon, Workshop, Pitch Night, Seminar
    location VARCHAR(255) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    registration_url VARCHAR(500),
    banner_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 1.10 Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' NOT NULL, -- info, team_invite, request_accepted, request_received
    link_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ==============================================================================
-- 2. Indexes for Query Performance
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON public.student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_name ON public.skills(name);
CREATE INDEX IF NOT EXISTS idx_student_skills_profile ON public.student_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_skill ON public.student_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_project_skills_project ON public.project_skills(project_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_skill ON public.project_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_team_members_project ON public.team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_project ON public.join_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_applicant ON public.join_requests(applicant_id);
CREATE INDEX IF NOT EXISTS idx_events_creator ON public.events(creator_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- ==============================================================================
-- 3. Automatic updated_at Trigger Function
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_student_profiles_updated_at ON public.student_profiles;
CREATE TRIGGER set_student_profiles_updated_at
BEFORE UPDATE ON public.student_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_join_requests_updated_at ON public.join_requests;
CREATE TRIGGER set_join_requests_updated_at
BEFORE UPDATE ON public.join_requests
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 4. Supabase Row Level Security (RLS) Configuration
-- ==============================================================================
-- Note: FastAPI accesses Supabase via the postgres connection string (which bypasses RLS).
-- If you access tables via Supabase REST API or Supabase client in the frontend,
-- enabling RLS with these permissive policies ensures data accessibility:

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow full access for service_role and backend connection (and read access for public)
DO $$
BEGIN
    -- users policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow backend full access') THEN
        CREATE POLICY "Allow backend full access" ON public.users FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- student_profiles policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'student_profiles' AND policyname = 'Allow backend full access') THEN
        CREATE POLICY "Allow backend full access" ON public.student_profiles FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- skills policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'skills' AND policyname = 'Allow public read and backend full access') THEN
        CREATE POLICY "Allow public read and backend full access" ON public.skills FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- student_skills policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'student_skills' AND policyname = 'Allow backend full access') THEN
        CREATE POLICY "Allow backend full access" ON public.student_skills FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- projects policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Allow backend full access') THEN
        CREATE POLICY "Allow backend full access" ON public.projects FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- project_skills policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_skills' AND policyname = 'Allow backend full access') THEN
        CREATE POLICY "Allow backend full access" ON public.project_skills FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- team_members policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Allow backend full access') THEN
        CREATE POLICY "Allow backend full access" ON public.team_members FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- join_requests policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'join_requests' AND policyname = 'Allow backend full access') THEN
        CREATE POLICY "Allow backend full access" ON public.join_requests FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- events policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Allow backend full access') THEN
        CREATE POLICY "Allow backend full access" ON public.events FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- notifications policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Allow backend full access') THEN
        CREATE POLICY "Allow backend full access" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ==============================================================================
-- 5. Seed Data: Master Technical Skills Catalog
-- ==============================================================================
INSERT INTO public.skills (name, category) VALUES
    ('React', 'Frontend'),
    ('JavaScript', 'Frontend'),
    ('TypeScript', 'Frontend'),
    ('Vue.js', 'Frontend'),
    ('Next.js', 'Frontend'),
    ('HTML/CSS', 'Frontend'),
    ('Tailwind CSS', 'Frontend'),
    ('Python', 'Backend'),
    ('FastAPI', 'Backend'),
    ('Django', 'Backend'),
    ('Node.js', 'Backend'),
    ('Express.js', 'Backend'),
    ('Go', 'Backend'),
    ('Rust', 'Backend'),
    ('PostgreSQL', 'Database'),
    ('Supabase', 'Database'),
    ('MongoDB', 'Database'),
    ('Redis', 'Database'),
    ('Machine Learning', 'AI/ML'),
    ('Deep Learning', 'AI/ML'),
    ('PyTorch', 'AI/ML'),
    ('TensorFlow', 'AI/ML'),
    ('Natural Language Processing', 'AI/ML'),
    ('Computer Vision', 'AI/ML'),
    ('Large Language Models', 'AI/ML'),
    ('UI/UX Design', 'Design'),
    ('Figma', 'Design'),
    ('Docker', 'DevOps'),
    ('Kubernetes', 'DevOps'),
    ('AWS', 'Cloud'),
    ('GCP', 'Cloud'),
    ('Git', 'Tools'),
    ('GraphQL', 'Backend')
ON CONFLICT (name) DO NOTHING;

-- ==============================================================================
-- 6. Seed Demo University User & Sample Records (Optional demo data)
-- Default Login: alex.rivera@stanford.edu / Campus@2026!
-- ==============================================================================
INSERT INTO public.users (id, email, hashed_password, full_name, avatar_url, is_active, is_superuser)
VALUES (
    1,
    'alex.rivera@stanford.edu',
    -- Bcrypt hash for password: 'Campus@2026!'
    '$2b$12$N9qo8uLOickgx2ZMRZoMye.Iu7z0/0V.M4X63l6V6o0zfvLd3n442',
    'Alex Rivera',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    TRUE,
    FALSE
)
ON CONFLICT (email) DO NOTHING;

-- Ensure SERIAL sequence is aligned
SELECT setval(pg_get_serial_sequence('public.users', 'id'), COALESCE(MAX(id), 1)) FROM public.users;

-- Demo Profile
INSERT INTO public.student_profiles (
    user_id,
    university,
    major,
    graduation_year,
    preferred_role,
    bio,
    github_url,
    linkedin_url,
    availability_hours_per_week
)
VALUES (
    1,
    'Stanford University',
    'Computer Science & AI',
    2026,
    'Full Stack / ML Engineer',
    'Junior CS major passionate about autonomous systems, full-stack architectures, and ML teammate pairing.',
    'https://github.com/alexrivera-ai',
    'https://linkedin.com/in/alexrivera-ai',
    15
)
ON CONFLICT (user_id) DO NOTHING;

-- Demo Project
INSERT INTO public.projects (
    id,
    owner_id,
    title,
    tagline,
    description,
    category,
    status,
    max_team_size,
    github_repo
)
VALUES (
    1,
    1,
    'MediVision: Real-Time Diagnostic Assistance',
    'Edge AI inference for pathology image segmentation and physician triage in clinical settings.',
    'We are engineering an offline-first computer vision pipeline that runs on lightweight edge devices to analyze microscopy slides. Seeking backend and ML students.',
    'AI & Machine Learning',
    'Recruiting',
    4,
    'https://github.com/campus-connect/medivision'
)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.projects', 'id'), COALESCE(MAX(id), 1)) FROM public.projects;

-- Demo Team Member
INSERT INTO public.team_members (project_id, user_id, role)
VALUES (1, 1, 'Project Lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- Demo Campus Event
INSERT INTO public.events (
    creator_id,
    title,
    description,
    event_type,
    location,
    start_time,
    end_time,
    registration_url,
    banner_url
)
VALUES (
    1,
    'Stanford TreeHacks 2026: AI & Spatial Computing',
    'Northern California''s premier collegiate hackathon with over $75,000 in sponsor prizes.',
    'Hackathon',
    'Arrillaga Alumni Center, Stanford Campus',
    CURRENT_TIMESTAMP + INTERVAL '20 days',
    CURRENT_TIMESTAMP + INTERVAL '22 days',
    'https://treehacks.com',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80'
)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- End of Supabase Schema Script
-- ==============================================================================
