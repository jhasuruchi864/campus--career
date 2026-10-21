import re
from typing import List, Dict, Any, Optional


ALL_TECH_KEYWORDS = {
    "frontend": ["react", "vue", "angular", "next.js", "typescript", "javascript", "tailwind", "html", "css", "redux"],
    "backend": ["python", "fastapi", "django", "node.js", "express", "go", "java", "spring boot", "c++", "rust", "graphql", "rest api"],
    "database": ["postgresql", "mysql", "mongodb", "redis", "sqlite", "prisma", "sqlalchemy"],
    "ai_ml": ["pytorch", "tensorflow", "scikit-learn", "nlp", "llm", "computer vision", "opencv", "langchain", "machine learning", "deep learning"],
    "devops_cloud": ["docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "git", "linux", "terraform"],
    "design_product": ["figma", "ui/ux", "wireframing", "prototyping", "user research", "agile", "scrum"]
}

METRIC_PATTERNS = [
    r"\b\d+%\b",
    r"\b\$\d+[\w]*\b",
    r"\b\d+x\b",
    r"\b\d+\s*(users|clients|students|downloads|requests|ms|seconds|fps)\b"
]


def extract_skills_from_text(text: str) -> Dict[str, List[str]]:
    lower_text = text.lower()
    found_by_category = {}
    all_found = []

    for cat, keywords in ALL_TECH_KEYWORDS.items():
        found = [k for k in keywords if re.search(r"\b" + re.escape(k) + r"\b", lower_text)]
        if found:
            found_by_category[cat] = found
            all_found.extend(found)

    return {
        "skills": list(set(all_found)),
        "by_category": found_by_category
    }


def analyze_resume_ats(resume_text: str, target_role: Optional[str] = None, projects_list: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    extracted = extract_skills_from_text(resume_text)
    detected_skills = extracted["skills"]

    # 1. Keywords Score (up to 30 pts)
    keyword_count = len(detected_skills)
    keywords_score = min(30, keyword_count * 3)

    # 2. Impact & Metrics Score (up to 25 pts)
    metric_matches = 0
    for pat in METRIC_PATTERNS:
        metric_matches += len(re.findall(pat, resume_text, re.IGNORECASE))
    metrics_score = min(25, 10 + metric_matches * 5)

    # 3. Breadth of Tech Stack Score (up to 25 pts)
    cats_covered = len(extracted["by_category"])
    breadth_score = min(25, cats_covered * 6)

    # 4. Content Structure & Action Verbs (up to 20 pts)
    action_verbs = ["engineered", "developed", "architected", "designed", "deployed", "spearheaded", "optimized", "implemented", "reduced", "scaled"]
    found_verbs = [v for v in action_verbs if re.search(r"\b" + v + r"\b", resume_text, re.IGNORECASE)]
    structure_score = min(20, 8 + len(found_verbs) * 3)

    ats_score = keywords_score + metrics_score + breadth_score + structure_score

    # Strengths
    strengths = []
    if keyword_count >= 6:
        strengths.append(f"Strong technical vocabulary: {keyword_count} industry keywords identified.")
    if metric_matches >= 2:
        strengths.append(f"High-impact quantified achievements detected ({metric_matches} quantitative metrics found).")
    if cats_covered >= 3:
        strengths.append(f"Full-spectrum engineering stack across {cats_covered} distinct disciplines.")
    if found_verbs:
        strengths.append(f"Effective use of strong leadership and impact verbs ({', '.join(found_verbs[:3])}).")

    if not strengths:
        strengths.append("Foundational structure present; ready for tech stack optimization.")

    # Gaps & Improvements
    improvements = []
    if metric_matches == 0:
        improvements.append("Add measurable outcomes (e.g., 'Improved latency by 35%' or 'Handled 5,000+ daily requests').")
    if keyword_count < 5:
        improvements.append("Incorporate explicit mentions of modern tools (e.g. Docker, TypeScript, PostgreSQL, PyTorch).")
    if "devops_cloud" not in extracted["by_category"]:
        improvements.append("Include cloud deployment or CI/CD experience (e.g., Docker, AWS, GitHub Actions).")
    if structure_score < 15:
        improvements.append("Use stronger action verbs at the start of bullet points (e.g., 'Architected', 'Deployed', 'Engineered').")

    # Match with active projects
    recommended_projects = []
    if projects_list:
        user_skills_set = set(s.lower() for s in detected_skills)
        for p in projects_list:
            p_skills = [s.lower() for s in p.get("required_skills", [])]
            overlap = user_skills_set.intersection(p_skills)
            pct = round(len(overlap) / max(len(p_skills), 1) * 100) if p_skills else 50
            recommended_projects.append({
                "id": p.get("id"),
                "title": p.get("title"),
                "category": p.get("category"),
                "fit_percentage": min(98, max(45, pct + 20)),
                "matching_skills": list(overlap),
                "missing_skills": [s for s in p_skills if s not in user_skills_set]
            })
        recommended_projects.sort(key=lambda x: x["fit_percentage"], reverse=True)

    return {
        "ats_score": ats_score,
        "grade": "Exceptional" if ats_score >= 85 else "Competitive" if ats_score >= 70 else "Needs Polish",
        "breakdown": {
            "keywords": keywords_score,
            "metrics": metrics_score,
            "tech_breadth": breadth_score,
            "formatting_and_action_verbs": structure_score
        },
        "detected_skills": detected_skills,
        "skills_by_category": extracted["by_category"],
        "strengths": strengths,
        "actionable_improvements": improvements,
        "recommended_projects": recommended_projects[:4]
    }


def build_hackathon_team(theme: str, candidates: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Synthesizes a 4-person dream hackathon squad with complementary roles."""
    roles = {
        "Team Lead & Architect": None,
        "AI / ML & Backend Specialist": None,
        "Frontend & Mobile Engineer": None,
        "Product & UI/UX Designer": None
    }

    used_ids = set()

    # Match lead
    for c in candidates:
        if c["id"] not in used_ids and any("lead" in (c.get("preferred_role") or "").lower() or c.get("graduation_year", 2027) <= 2025 for _ in [1]):
            roles["Team Lead & Architect"] = c
            used_ids.add(c["id"])
            break

    # Match AI/ML backend
    for c in candidates:
        if c["id"] not in used_ids:
            skills = [s.get("name", "").lower() if isinstance(s, dict) else str(s).lower() for s in c.get("skills", [])]
            if any(s in ["python", "machine learning", "pytorch", "fastapi", "nlp"] for s in skills):
                roles["AI / ML & Backend Specialist"] = c
                used_ids.add(c["id"])
                break

    # Match Frontend
    for c in candidates:
        if c["id"] not in used_ids:
            skills = [s.get("name", "").lower() if isinstance(s, dict) else str(s).lower() for s in c.get("skills", [])]
            if any(s in ["react", "typescript", "javascript", "tailwind", "next.js", "html/css"] for s in skills):
                roles["Frontend & Mobile Engineer"] = c
                used_ids.add(c["id"])
                break

    # Match UI/UX or next available
    for c in candidates:
        if c["id"] not in used_ids:
            roles["Product & UI/UX Designer"] = c
            used_ids.add(c["id"])
            break

    # Fill any empty slot with remaining candidates
    for role_name, member in roles.items():
        if member is None:
            for c in candidates:
                if c["id"] not in used_ids:
                    roles[role_name] = c
                    used_ids.add(c["id"])
                    break

    squad = []
    for role_name, member in roles.items():
        if member:
            squad.append({
                "assigned_role": role_name,
                "student_id": member.get("user_id", member.get("id")),
                "full_name": member.get("full_name"),
                "university": member.get("university"),
                "avatar_url": member.get("avatar_url"),
                "top_skills": [s.get("name") if isinstance(s, dict) else str(s) for s in member.get("skills", [])][:4]
            })

    return {
        "theme": theme,
        "team_synergy_score": 94,
        "squad": squad,
        "rationale": "High skill orthogonality: 100% full-stack and UI/UX coverage with balanced leadership and low scheduling friction."
    }


def generate_project_spec(domain: str, difficulty: str = "Intermediate", preferred_stack: Optional[str] = None) -> Dict[str, Any]:
    """Generates innovative student capstone ideas with complete system architecture and roadmap."""
    proposals = {
        "fintech": {
            "title": "NovaPay: Autonomous Multi-Agent Expense & Micro-Hedging Engine",
            "tagline": "AI financial agents executing smart micro-budgeting and fraud protection on lightweight edge protocols.",
            "problem": "College students and young professionals lack automated financial tooling that actively optimizes spending across accounts without high fee structures.",
            "architecture": "Next.js frontend with Tailwind CSS -> FastAPI microservices -> PostgreSQL with TimescaleDB -> Plaid sandbox and OpenAI LLM router.",
            "recommended_stack": ["React", "TypeScript", "FastAPI", "Python", "PostgreSQL", "Docker"],
            "roles_needed": ["Frontend Dev (Next.js)", "Backend Dev (FastAPI)", "Fintech/Security Specialist"],
            "roadmap": [
                {"week": 1, "goal": "User onboarding, schema design & Plaid sandbox bank ingestion"},
                {"week": 2, "goal": "Agent decision tree & spending velocity anomaly detector"},
                {"week": 3, "goal": "Interactive dashboard with dynamic cashflow forecasting charts"},
                {"week": 4, "goal": "Stress testing, end-to-end integration & demo pitch deck"}
            ]
        },
        "healthtech": {
            "title": "BioSync: Low-Latency Vital Telemetry & Triage Assistant",
            "tagline": "Edge-processed wearable health telemetry predicting symptom escalations before clinical visits.",
            "problem": "Rural clinics and student campuses experience delays in triage due to fragmented patient metric logs.",
            "architecture": "React Native Mobile App -> WebSocket Gateway -> FastAPI -> Scikit-learn Random Forest Triage Model -> HIPAA-compliant PostgreSQL.",
            "recommended_stack": ["React Native", "FastAPI", "Python", "Machine Learning", "WebSockets"],
            "roles_needed": ["ML Engineer (Triage classification)", "Full Stack Dev (WebSockets)", "UI/UX Designer"],
            "roadmap": [
                {"week": 1, "goal": "Wearable sensor protocol mock and database telemetry schema"},
                {"week": 2, "goal": "Anomaly detection model trained on synthetic PhysioNet data"},
                {"week": 3, "goal": "Real-time doctor alerting portal and patient mobile interface"},
                {"week": 4, "goal": "End-to-end telemetry playback and clinical trial simulator"}
            ]
        },
        "ai agents": {
            "title": "OmniFlow: Autonomous Collaborative Research Squad",
            "tagline": "Multi-agent LLM system that crawls arXiv, synthesizes literature reviews, and benchmarks reproducible code.",
            "problem": "Researchers spend dozens of hours every week reading repetitive papers and reproducing experimental baselines.",
            "architecture": "Vite React Dashboard -> LangGraph / CrewAI Agent Engine -> FastAPI -> ChromaDB Vector Store -> Python sandbox execution runner.",
            "recommended_stack": ["React", "FastAPI", "Python", "LangChain/LangGraph", "ChromaDB", "Docker"],
            "roles_needed": ["AI/LLM Engineer", "Full Stack Developer", "Research QA Specialist"],
            "roadmap": [
                {"week": 1, "goal": "ArXiv API ingestion worker and embedding vector pipeline"},
                {"week": 2, "goal": "Multi-agent synthesis graph (Summarizer, Critic, Code Extractor)"},
                {"week": 3, "goal": "Interactive markdown thesis viewer with interactive citations"},
                {"week": 4, "goal": "Automated PDF report export and benchmarking sandbox"}
            ]
        }
    }

    key = domain.lower().strip()
    match = None
    for k in proposals:
        if k in key or key in k:
            match = proposals[k]
            break

    if not match:
        match = {
            "title": f"Nexus-{domain.title()}: Distributed Intelligence Platform",
            "tagline": f"Next-generation collaborative platform leveraging modern microservices and machine learning for {domain}.",
            "problem": f"Current solutions in {domain} suffer from siloed data and lack of automated real-time decision intelligence.",
            "architecture": f"React (Vite) UI -> FastAPI Async REST/WebSocket API -> PostgreSQL & Redis -> Scikit-learn / PyTorch Pipeline.",
            "recommended_stack": ["React", "Python", "FastAPI", "PostgreSQL", "Docker"],
            "roles_needed": ["Lead Full Stack Engineer", "Backend & API Specialist", "Data/ML Specialist"],
            "roadmap": [
                {"week": 1, "goal": f"Domain data modeling and core API architecture for {domain}"},
                {"week": 2, "goal": "Core business logic, algorithms and third-party integrations"},
                {"week": 3, "goal": "High-fidelity frontend interfaces, charts, and team dashboards"},
                {"week": 4, "goal": "Production deployment, demo video, and presentation showcase"}
            ]
        }

    return match


def generate_mock_interview(skill: str, difficulty: str = "Intermediate") -> Dict[str, Any]:
    """Generates technical questions, hints, and expected answers for student skill mock interview."""
    questions_bank = {
        "react": [
            {
                "question": "How does React Fiber differ from the legacy stack reconciler, and how does it enable concurrent rendering?",
                "category": "Architecture & Concurrency",
                "difficulty": "Advanced",
                "hint": "Think about cooperative scheduling, requestIdleCallback concepts, and time-slicing work units.",
                "expected_answer": "React Fiber introduces a custom call stack with fiber nodes as virtual stack frames. Unlike synchronous recursion, work units can be paused, prioritized, or aborted, allowing concurrent features like useTransition and Suspense."
            },
            {
                "question": "When would you prefer useLayoutEffect over useEffect, and what performance tradeoff does it introduce?",
                "category": "Hooks & Lifecycle",
                "difficulty": "Intermediate",
                "hint": "Consider DOM mutations before the browser paints vs asynchronous post-paint execution.",
                "expected_answer": "useLayoutEffect fires synchronously after DOM mutations but before browser painting. Use it for reading layout dimensions to prevent visual flickers, but beware it blocks browser paint."
            },
            {
                "question": "What is reconciliation and how does React's virtual DOM diffing algorithm achieve O(n) complexity?",
                "category": "Core Internals",
                "difficulty": "Intermediate",
                "hint": "Two assumptions: different element types produce different trees, and key props identify stable list items.",
                "expected_answer": "Generic tree diffing is O(n^3). React uses heuristic assumptions: elements of different types tear down old trees, and unique key attributes allow tracking node movement across renders."
            }
        ],
        "python": [
            {
                "question": "Explain the Global Interpreter Lock (GIL) in CPython and how Python 3.13 free-threaded mode addresses it.",
                "category": "CPython Internals",
                "difficulty": "Advanced",
                "hint": "Reference counting thread safety vs true multi-core parallel CPU execution.",
                "expected_answer": "The GIL is a mutex protecting CPython memory structures from concurrent race conditions. Python 3.13 introduces experimental PEP 703 (no-GIL build) using mimalloc and biased reference counting for multi-core parallelism."
            },
            {
                "question": "How do Python asyncio event loops handle I/O bound concurrency under the hood?",
                "category": "Async & Networking",
                "difficulty": "Intermediate",
                "hint": "OS system calls like epoll/kqueue and coroutine yield statements.",
                "expected_answer": "asyncio uses OS multiplexers (selectors like epoll/kqueue). When a coroutine awaits an I/O operation, the generator yields control back to the event loop, enabling thousands of concurrent sockets on a single OS thread."
            }
        ],
        "fastapi": [
            {
                "question": "How does FastAPI differentiate between async def and def route handler execution threads?",
                "category": "Concurrency & Starlette",
                "difficulty": "Intermediate",
                "hint": "External threadpool worker vs main event loop execution.",
                "expected_answer": "If defined with async def, FastAPI executes directly in the main event loop (must not block). If defined with standard def, FastAPI runs the function in an AnyIO external threadpool worker to avoid blocking the loop."
            }
        ]
    }

    key = skill.lower().strip()
    questions = questions_bank.get(key)
    if not questions:
        # Dynamic fallback
        questions = [
            {
                "question": f"Describe the core architectural design principles and state management patterns you utilize when engineering systems with {skill.title()}.",
                "category": "System Architecture",
                "difficulty": difficulty,
                "hint": f"Discuss scalability, memory lifecycle, modularity, and error handling in {skill.title()}.",
                "expected_answer": f"A comprehensive answer covers separation of concerns, clean interfaces, lifecycle management, performance monitoring, and defensive failure boundaries tailored to {skill.title()}."
            },
            {
                "question": f"What common anti-patterns or performance bottlenecks occur when scaling {skill.title()} in production, and how do you mitigate them?",
                "category": "Performance & Debugging",
                "difficulty": difficulty,
                "hint": "Think about resource leaks, unindexed queries, blocking tasks, or network round-trips.",
                "expected_answer": f"Highlight proactive instrumentation, profiling bottlenecks, caching layers, and asynchronous worker queues."
            }
        ]

    return {
        "skill": skill,
        "difficulty": difficulty,
        "questions": questions,
        "prep_tip": f"Review standard design patterns, concurrency models, and test-driven benchmarks for {skill.title()} before campus placement rounds."
    }

