from typing import List, Dict, Any


def analyze_skill_gaps(
    required_skills: List[str],
    current_team_skills: List[str],
    category: str = ""
) -> Dict[str, Any]:
    """
    Computes missing competencies in a project roster and provides actionable suggestions.
    """
    team_set = {s.lower() for s in current_team_skills}
    missing = [req for req in required_skills if req.lower() not in team_set]

    recommendations = []
    if missing:
        recommendations.append(f"Actively prioritize recruiting candidates skilled in: {', '.join(missing[:3])}.")
    else:
        recommendations.append("All baseline required skills are currently covered by active team members.")

    if category == "AI & Machine Learning" and not any("cloud" in s or "docker" in s for s in team_set):
        recommendations.append("Consider onboarding a Cloud/DevOps specialist to assist with model deployment and serving.")

    if category == "Web Development" and not any("design" in s or "figma" in s or "ui" in s for s in team_set):
        recommendations.append("Consider recruiting a UI/UX designer to lead interface design and user testing.")

    return {
        "missing_skills": missing,
        "recommendations": recommendations
    }
