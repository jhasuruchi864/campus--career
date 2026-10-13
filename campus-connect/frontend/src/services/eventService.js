import api from './api';

export const eventService = {
  async getEvents(params = {}) {
    const query = new URLSearchParams();
    if (params.type && params.type !== 'All') query.append('type', params.type);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await api.get(`/events${queryString}`);
  },

  async getEventById(id) {
    return await api.get(`/events/${id}`);
  },

  async createEvent(eventData) {
    return await api.post('/events', eventData);
  }
};

export default eventService;
