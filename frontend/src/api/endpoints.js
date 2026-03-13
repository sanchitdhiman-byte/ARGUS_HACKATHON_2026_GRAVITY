import api from './axios';

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const programmeAPI = {
  getAll: () => api.get('/programmes'),
  getById: (id) => api.get(`/programmes/${id}`),
  getByCode: (code) => api.get(`/programmes/code/${code}`),
};

export const applicationAPI = {
  create: (data) => api.post('/applications', data),
  getById: (id) => api.get(`/applications/${id}`),
  getMy: () => api.get('/applications/my'),
  getAll: (params) => api.get('/applications', { params }),
  getByProgramme: (programmeId) => api.get(`/applications/programme/${programmeId}`),
  getByStatus: (status) => api.get(`/applications/status/${status}`),
  submit: (id) => api.post(`/applications/${id}/submit`),
  updateFormData: (id, data) => api.put(`/applications/${id}/form-data`, data),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
};

export const documentAPI = {
  uploadAppDoc: (applicationId, formData) =>
    api.post(`/documents/application/${applicationId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAppDocs: (applicationId) => api.get(`/documents/application/${applicationId}`),
  uploadVaultDoc: (organisationId, formData) =>
    api.post(`/documents/vault/${organisationId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getVaultDocs: (organisationId) => api.get(`/documents/vault/${organisationId}`),
};

export const organisationAPI = {
  create: (data) => api.post('/organisations', data),
  getMy: () => api.get('/organisations/my'),
  getById: (id) => api.get(`/organisations/${id}`),
  update: (id, data) => api.put(`/organisations/${id}`, data),
};

export const screeningAPI = {
  getReport: (applicationId) => api.get(`/screening/application/${applicationId}`),
  review: (applicationId, data) => api.post(`/screening/application/${applicationId}/review`, data),
};

export const reviewAPI = {
  assign: (data) => api.post('/reviews/assign', data),
  getForApplication: (applicationId) => api.get(`/reviews/application/${applicationId}`),
  getMy: () => api.get('/reviews/my'),
  submitScore: (assignmentId, data) => api.post(`/reviews/${assignmentId}/score`, data),
  getScores: (assignmentId) => api.get(`/reviews/${assignmentId}/scores`),
  complete: (assignmentId) => api.post(`/reviews/${assignmentId}/complete`),
  getAnnotations: (assignmentId) => api.get(`/reviews/${assignmentId}/annotations`),
  addAnnotation: (assignmentId, data) => api.post(`/reviews/${assignmentId}/annotations`, data),
};

export const decisionAPI = {
  make: (data) => api.post('/decisions', data),
  get: (applicationId) => api.get(`/decisions/application/${applicationId}`),
  getByProgramme: (programmeId) => api.get(`/decisions/programme/${programmeId}`),
};

export const agreementAPI = {
  create: (data) => api.post('/agreements', data),
  get: (applicationId) => api.get(`/agreements/application/${applicationId}`),
  acknowledge: (agreementId) => api.post(`/agreements/${agreementId}/acknowledge`),
  saveBankDetails: (agreementId, data) => api.post(`/agreements/${agreementId}/bank-details`, data),
  getBankDetails: (agreementId) => api.get(`/agreements/${agreementId}/bank-details`),
};

export const disbursementAPI = {
  create: (data) => api.post('/disbursements', data),
  get: (agreementId) => api.get(`/disbursements/agreement/${agreementId}`),
  updateStatus: (id, data) => api.put(`/disbursements/${id}/status`, data),
};

export const complianceAPI = {
  getByAgreement: (agreementId) => api.get(`/compliance/agreement/${agreementId}`),
  getReport: (id) => api.get(`/compliance/${id}`),
  submitReport: (data) => api.post('/compliance', data),
  reviewReport: (id, data) => api.put(`/compliance/${id}/review`, data),
  getPending: () => api.get('/compliance/pending'),
  createReport: (data) => api.post('/compliance/create', data),
};

export const expenditureAPI = {
  add: (data) => api.post('/expenditures', data),
  get: (agreementId) => api.get(`/expenditures/agreement/${agreementId}`),
  verify: (id, data) => api.put(`/expenditures/${id}/verify`, data),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  unreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const messageAPI = {
  getForApp: (applicationId) => api.get(`/messages/application/${applicationId}`),
  send: (data) => api.post('/messages', data),
};

export const dashboardAPI = {
  admin: () => api.get('/dashboard/admin'),
  applicant: () => api.get('/dashboard/applicant'),
  reviewer: () => api.get('/dashboard/reviewer'),
  officer: () => api.get('/dashboard/officer'),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  getByRole: (role) => api.get(`/users/role/${role}`),
  updateStatus: (id, data) => api.put(`/users/${id}/status`, data),
  updateRole: (id, data) => api.put(`/users/${id}/role`, data),
};

export const auditAPI = {
  getAll: (params) => api.get('/audit', { params }),
  getByObject: (objectType, objectId) => api.get(`/audit/object/${objectType}/${objectId}`),
  getByActor: (actorId) => api.get(`/audit/actor/${actorId}`),
};
