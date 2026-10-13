-- Seed initial skills
INSERT INTO skills (name, category) VALUES
('React', 'Frontend'),
('JavaScript', 'Frontend'),
('TypeScript', 'Frontend'),
('HTML/CSS', 'Frontend'),
('Python', 'Backend'),
('FastAPI', 'Backend'),
('Node.js', 'Backend'),
('PostgreSQL', 'Database'),
('MongoDB', 'Database'),
('Machine Learning', 'AI/ML'),
('Deep Learning', 'AI/ML'),
('Natural Language Processing', 'AI/ML'),
('Computer Vision', 'AI/ML'),
('UI/UX Design', 'Design'),
('Figma', 'Design'),
('Docker', 'DevOps'),
('AWS', 'Cloud'),
('Git', 'Tools')
ON CONFLICT (name) DO NOTHING;
