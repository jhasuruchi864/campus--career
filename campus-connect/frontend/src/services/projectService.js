import api from './api';

export const projectService = {
  async getProjects(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await api.get(`/projects${queryString}`);
  },

  async getProjectById(id) {
    return await api.get(`/projects/${id}`);
  },

  async createProject(projectData) {
    return await api.post('/projects', projectData);
  },

  async submitJoinRequest(projectId, pitchData) {
    return await api.post(`/projects/${projectId}/join`, pitchData);
  },

  async getJoinRequests(projectId) {
    return await api.get(`/projects/${projectId}/requests`);
  },

  async updateJoinRequestStatus(projectId, requestId, status) {
    return await api.put(`/projects/${projectId}/requests/${requestId}`, { status });
  }
};

export default projectService;
