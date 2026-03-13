import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor: inject auth token ────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor: handle 401/422 globally ─────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    // 401 — try token refresh once, then force logout
    if (status === 401 && !error.config._retried) {
      error.config._retried = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token: refreshToken });
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh_token);
          error.config.headers.Authorization = `Bearer ${res.data.access_token}`;
          return api(error.config);
        } catch {
          // Refresh failed — clear session
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth:logout'));
        }
      }
    }

    // 422 — Validation error: normalise detail into a readable message
    if (status === 422) {
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        const messages = detail.map(
          (e) => `${e.loc?.slice(-1)?.[0] || 'field'}: ${e.msg}`
        );
        error.validationErrors = messages;
        error.message = messages.join('; ');
      }
    }

    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (data) => api.post('/auth/google', data),
  refreshToken: (data) => api.post('/auth/refresh', data),
};

// ── Applications ─────────────────────────────────────────────────────
export const applicationsAPI = {
  create: (grantType, formData) =>
    api.post('/applications', { grantType, formData }),
  list: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  assign: (id) => api.post(`/applications/${id}/assign`),
  approve: (id, reason) =>
    api.post(`/applications/${id}/approve`, { status: 'approved', reason }),
  reject: (id, reason) =>
    api.post(`/applications/${id}/reject`, { status: 'rejected', reason }),
  waitlist: (id) =>
    api.post(`/applications/${id}/waitlist`, { status: 'waitlisted' }),
  screeningOverride: (id, data) =>
    api.post(`/applications/${id}/screening-override`, data),
  getMessages: (id) => api.get(`/applications/${id}/messages`),
  sendMessage: (id, content, isInternal = false) =>
    api.post(`/applications/${id}/messages`, {
      application_id: id,
      content,
      is_internal_note: isInternal,
    }),
};

// ── Reviews (AI Scrutiny) ────────────────────────────────────────────
export const reviewsAPI = {
  getReviewPackage: (appId) =>
    api.get(`/applications/${appId}/review-package`),
  assignReviewer: (appId, reviewerId) =>
    api.post(`/applications/${appId}/assign-reviewer`, { reviewer_id: reviewerId }),
  submit: (data) => api.post('/reviews', data),
  list: (applicationId) =>
    api.get('/reviews', { params: applicationId ? { application_id: applicationId } : {} }),
  listReviewers: () => api.get('/reviewers'),
};

// ── Compliance & Finance ─────────────────────────────────────────────
export const complianceAPI = {
  submitReport: (applicationId, reportType, reportData) =>
    api.post('/compliance-reports', {
      application_id: applicationId,
      report_type: reportType,
      report_data: reportData,
    }),
  listReports: (applicationId) =>
    api.get('/compliance-reports', {
      params: applicationId ? { application_id: applicationId } : {},
    }),
  getReport: (reportId) => api.get(`/compliance-reports/${reportId}`),
  reviewReport: (reportId, action, comments, severity) =>
    api.post(`/compliance-reports/${reportId}/review`, {
      action,
      comments,
      severity,
    }),
};

export const disbursementsAPI = {
  create: (data) => api.post('/disbursements', data),
  list: (applicationId) =>
    api.get('/disbursements', {
      params: applicationId ? { application_id: applicationId } : {},
    }),
  release: (id) => api.post(`/disbursements/${id}/release`),
};

// ── Notifications ────────────────────────────────────────────────────
export const notificationsAPI = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.post(`/notifications/${id}/read`),
};

// ── Chat (Intake Assistant) ──────────────────────────────────────────
export const chatAPI = {
  send: (grantType, message, collectedData = {}, conversationHistory = []) =>
    api.post('/chat', {
      grant_type: grantType,
      message,
      collected_data: collectedData,
      conversation_history: conversationHistory,
    }),
};

// ── Admin / RBAC ────────────────────────────────────────────────────
export const adminAPI = {
  listUsers: (role) => api.get('/admin/users', { params: role ? { role } : {} }),
  updateRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
  listStaff: (role) => api.get('/admin/staff', { params: role ? { role } : {} }),
  assignToStaff: (appId, staffId, force = false) =>
    api.post(`/admin/applications/${appId}/assign`, { staff_id: staffId, force }),
  getWorkflowTransitions: () => api.get('/workflow/transitions'),
};

// ── Public Endpoints (no auth) ───────────────────────────────────────
export const publicAPI = {
  healthCheck: () => api.get('/health'),
  grantProgrammes: () => api.get('/grant-programmes'),
  eligibilityCheck: (orgType, district, amount) =>
    api.post('/eligibility-check', {
      organisation_type: orgType,
      project_district: district,
      funding_amount: amount,
    }),
};

// ── Dashboard ────────────────────────────────────────────────────────
export const dashboardAPI = {
  fundUtilisation: () => api.get('/dashboard/fund-utilisation'),
};

export default api;
