from typing import List, Set


def normalize_skill(skill: str) -> str:
    """Normalizes skill strings for NLP and vectorization."""
    return skill.strip().lower()


def build_student_feature_text(skills: List[str], preferred_role: str = "", interests: str = "") -> str:
    """Concatenates student skills, role, and interests into a clean text document for TF-IDF."""
    tokens = [normalize_skill(s) for s in skills]
    if preferred_role:
        tokens.append(preferred_role.strip().lower())
    if interests:
        tokens.append(interests.strip().lower())
    return " ".join(tokens)


def build_project_feature_text(required_skills: List[str], category: str = "", description: str = "") -> str:
    """Constructs a search vector text document representing project needs."""
    tokens = [normalize_skill(s) for s in required_skills]
    if category:
        tokens.append(category.strip().lower())
    return " ".join(tokens)
