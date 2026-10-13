import api from './api';

export const studentService = {
  async getStudents(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.skill) query.append('skill', params.skill);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await api.get(`/students${queryString}`);
  },

  async getProfile(userId = 'me') {
    return await api.get(`/students/profile/${userId}`);
  },

  async updateProfile(profileData) {
    return await api.put('/students/profile', profileData);
  },

  async getSkillsCatalog() {
    return await api.get('/skills');
  },

  // AI Teammate Matching & Explainability
  async findTeammateMatches(targetProjectId = null) {
    const query = targetProjectId ? `?project_id=${targetProjectId}` : '';
    return await api.get(`/ai/match-teammates${query}`);
  },

  async getSkillGapSuggestions(projectId) {
    return await api.get(`/ai/skill-gaps/${projectId}`);
  }
};

export default studentService;
