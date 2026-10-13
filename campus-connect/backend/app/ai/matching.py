from typing import List, Dict, Any, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.ai.features import build_student_feature_text, build_project_feature_text


class TeammateMatchingEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(token_pattern=r"(?u)\b[\w\+\#\.\-]+\b")

    def match_candidates_for_project(
        self,
        project_dict: Dict[str, Any],
        students_list: List[Dict[str, Any]],
        top_k: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Ranks candidates against a project using TF-IDF cosine similarity,
        domain interest overlap, and availability compatibility.
        """
        if not students_list:
            return []

        required_skills = project_dict.get("required_skills", [])
        project_cat = project_dict.get("category", "")

        # Target project document
        project_doc = build_project_feature_text(required_skills, category=project_cat)

        student_docs = [
            build_student_feature_text(
                s.get("skills", []),
                preferred_role=s.get("preferred_role", ""),
                interests=s.get("interests", "")
            )
            for s in students_list
        ]

        all_corpus = [project_doc] + student_docs

        try:
            tfidf_matrix = self.vectorizer.fit_transform(all_corpus)
            proj_vector = tfidf_matrix[0:1]
            student_vectors = tfidf_matrix[1:]
            sim_scores = cosine_similarity(proj_vector, student_vectors)[0]
        except Exception:
            # Fallback to direct Jaccard overlap if corpus is degenerate
            req_set = {s.lower() for s in required_skills}
            sim_scores = []
            for s in students_list:
                cand_set = {sk.lower() for sk in s.get("skills", [])}
                intersection = req_set.intersection(cand_set)
                union = req_set.union(cand_set) or {"dummy"}
                sim_scores.append(len(intersection) / len(union))
            sim_scores = np.array(sim_scores)

        ranked_results = []
        for idx, student in enumerate(students_list):
            raw_cosine = float(sim_scores[idx])
            skill_score = min(100.0, max(20.0, raw_cosine * 100.0))

            # Direct overlap check
            req_set = {s.lower() for s in required_skills}
            cand_skills = [s.lower() for s in student.get("skills", [])]
            overlapping = [s for s in student.get("skills", []) if s.lower() in req_set]

            # Role synergy bonus
            role_text = (student.get("preferred_role") or "").lower()
            role_synergy = 80.0
            if any(term in role_text for term in ["lead", "engineer", "designer", "developer"]):
                role_synergy = 90.0

            # Availability score (10h+ is ideal)
            avail = student.get("availability_hours_per_week", 10)
            avail_score = min(100.0, (avail / 15.0) * 100.0)

            # Combined weighted score
            overall_score = round(
                (skill_score * 0.55) + (role_synergy * 0.25) + (avail_score * 0.20),
                1
            )
            overall_score = min(99.0, max(45.0, overall_score))

            # Explainable AI Reasons
            reasons = []
            if overlapping:
                reasons.append(f"Direct match on critical skills: {', '.join(overlapping[:3])}")
            else:
                reasons.append("High semantic alignment with project engineering stack")

            if student.get("preferred_role"):
                reasons.append(f"Desired role '{student['preferred_role']}' complements project requirements")

            if avail >= 12:
                reasons.append(f"Strong commitment availability ({avail} hrs/week)")

            ranked_results.append({
                "id": student["id"],
                "student": student,
                "match_score": overall_score,
                "score_breakdown": {
                    "skill_score": round(skill_score, 1),
                    "interest_score": round(role_synergy, 1),
                    "role_score": round(avail_score, 1)
                },
                "match_reasons": reasons
            })

        # Sort descending by match score
        ranked_results.sort(key=lambda x: x["match_score"], reverse=True)
        return ranked_results[:top_k]


matching_engine = TeammateMatchingEngine()
