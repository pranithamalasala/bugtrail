import api from './axiosInstance'

export const fetchIssues = () => api.get('/issues')

export const createIssue = (data) => api.post('/issues', data)

export const updateIssue = (id, data) => api.put(`/issues/${id}`, data)

export const deleteIssue = (id) => api.delete(`/issues/${id}`)
