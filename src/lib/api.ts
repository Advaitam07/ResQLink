const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('resqlink_token') : null;

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message: string; data: T }> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Request failed');
  return json;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  googleLogin:  (token: string) =>
    request('/auth/google', { method: 'POST', body: JSON.stringify({ token }) }),
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string; role?: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me:     () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile:   () => request('/users/profile'),
  updateProfile: (data: object) =>
    request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getAllUsers:  () => request('/users'),
  getUserById: (id: string) => request(`/users/${id}`),
};

// ─── Cases ───────────────────────────────────────────────────────────────────
export const caseAPI = {
  getAll: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/cases${q}`);
  },
  getStats:   () => request('/cases/stats/summary'),
  getById:    (id: string) => request(`/cases/${id}`),
  create:     (data: object) =>
    request('/cases', { method: 'POST', body: JSON.stringify(data) }),
  update:     (id: string, data: object) =>
    request(`/cases/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete:     (id: string) =>
    request(`/cases/${id}`, { method: 'DELETE' }),
  assign:     (id: string, volunteerId: string) =>
    request(`/cases/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ volunteerId }) }),
  sendReport: (id: string) =>
    request(`/cases/${id}/send-report`, { method: 'PATCH' }),
};

// ─── Volunteers ──────────────────────────────────────────────────────────────
export const volunteerAPI = {
  getAll:      (search?: string) =>
    request(`/volunteers${search ? `?search=${search}` : ''}`),
  getDeployed: () => request('/volunteers/deployed'),
  getById:     (id: string) => request(`/volunteers/${id}`),
  add:         (data: object) =>
    request('/volunteers', { method: 'POST', body: JSON.stringify(data) }),
  update:      (id: string, data: object) =>
    request(`/volunteers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete:      (id: string) =>
    request(`/volunteers/${id}`, { method: 'DELETE' }),
  authorize:   (id: string) =>
    request(`/volunteers/${id}/authorize`, { method: 'PATCH' }),
  toggleAvailability: (id: string) =>
    request(`/volunteers/${id}/availability`, { method: 'PATCH' }),
};

// ─── Reports ─────────────────────────────────────────────────────────────────
export const reportAPI = {
  getSummary:          () => request('/reports/summary'),
  getStatusBreakdown:  () => request('/reports/status'),
  getCategoryBreakdown:() => request('/reports/category'),
  generate:            () => request('/reports/generate', { method: 'POST' }),
  export: async () => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/reports/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'resqlink-report.csv'; a.click();
    URL.revokeObjectURL(url);
  },
};

// ─── Notifications ───────────────────────────────────────────────────────────
export const notificationAPI = {
  getAll:      () => request('/notifications'),
  create:      (data: object) =>
    request('/notifications', { method: 'POST', body: JSON.stringify(data) }),
  markRead:    (id: string) =>
    request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),
};

// ─── Settings ────────────────────────────────────────────────────────────────
export const settingsAPI = {
  get:                  () => request('/settings'),
  update:               (data: object) =>
    request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  updateNotifications:  (data: object) =>
    request('/settings/notifications', { method: 'PATCH', body: JSON.stringify(data) }),
  updatePreferences:    (data: object) =>
    request('/settings/preferences', { method: 'PATCH', body: JSON.stringify(data) }),
};

// ─── Map ─────────────────────────────────────────────────────────────────────
export const mapAPI = {
  getCases:      () => request('/map/cases'),
  getVolunteers: () => request('/map/volunteers'),
  getDeployed:   () => request('/map/deployed'),
  getUrgent:     () => request('/map/urgent'),
  search:        (location: string) => request(`/map/search?location=${encodeURIComponent(location)}`),
  getSummary:    () => request('/map/summary'),
};

// ─── Translate ───────────────────────────────────────────────────────────────
export const translateAPI = {
  translate:     (text: string, target: string) =>
    request('/translate', { method: 'POST', body: JSON.stringify({ text, target }) }),
  translateCase: (id: string, target: string) =>
    request(`/translate/case/${id}`, { method: 'POST', body: JSON.stringify({ target }) }),
};

// ─── AI ──────────────────────────────────────────────────────────────────────
export const aiAPI = {
  getSummary:    () => request('/ai/summary'),
  getCaseInsights: (id: string) => request(`/ai/cases/${id}`),
  getMapInsights:  () => request('/ai/map'),
};
