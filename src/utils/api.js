const API_BASE_URL = 'http://localhost:5000/api';

const DEFAULT_TIMEOUT = 10000; // ms
const DEFAULT_RETRIES = 2;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchWithTimeout(url, fetchOptions = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal, ...fetchOptions });
    clearTimeout(id);
    // Don't log 409 Conflict responses - they're expected and handled by the app
    if (response.status === 409) {
      return response;
    }
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const retries = options._retries ?? DEFAULT_RETRIES;
  const timeout = options._timeout ?? DEFAULT_TIMEOUT;

  // Normalize headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Build fetch options without internal keys
  const fetchOptions = {
    method: options.method || 'GET',
    headers,
    credentials: options.credentials ?? 'include',
    body: options.body,
  };

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions, timeout);

      // If response is not ok, return response so callers can parse body and status
      return response;
    } catch (error) {
      // AbortError or network issues
      const isLast = attempt >= retries;
      console.error(`API network error on ${endpoint} (attempt ${attempt + 1}):`, error.message || error);
      if (isLast) {
        const err = new Error('Network error. Please try again.');
        err.original = error;
        throw err;
      }
      // Backoff before retrying
      await sleep(250 * Math.pow(2, attempt));
      attempt += 1;
    }
  }
};

export const authAPI = {
  register: (formData) => 
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),
  
  verifyOTP: (email, otp) =>
    apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),
  
  resendOTP: (email) =>
    apiCall('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  logout: (headers) =>
    apiCall('/auth/logout', {
      method: 'POST',
      headers,
    }),

  getProfile: (headers) =>
    apiCall('/auth/profile', {
      method: 'GET',
      headers,
    }),

  forgotPassword: (email) =>
    apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email, otp, newPassword) =>
    apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    }),
};

export const jobsAPI = {
  getAll: (params) =>
    apiCall(`/jobs?${params}`, { method: 'GET' }),
  
  getSaved: (headers) =>
    apiCall('/jobs/saved', { method: 'GET', headers }),
  
  saveJob: (jobId, headers) =>
    apiCall(`/jobs/${jobId}/save`, { method: 'POST', headers }),
  
  unsave: (jobId, headers) =>
    apiCall(`/jobs/${jobId}/save`, { method: 'DELETE', headers }),
};

export const usersAPI = {
  getUser: (userId) =>
    apiCall(`/users/${userId}`, { method: 'GET' }),
  
  updateUser: (userId, userData, headers) =>
    apiCall(`/users/${userId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(userData),
    }),
  
  getAllUsers: (params) =>
    apiCall(`/users?${params}`, { method: 'GET' }),

  followUser: (userId, headers) =>
    apiCall(`/users/${userId}/follow`, {
      method: 'POST',
      headers,
    }),

  unfollowUser: (userId, headers) =>
    apiCall(`/users/${userId}/unfollow`, {
      method: 'POST',
      headers,
    }),

  getFollowers: (userId) =>
    apiCall(`/users/${userId}/followers`, { method: 'GET' }),

  getFollowing: (userId) =>
    apiCall(`/users/${userId}/following`, { method: 'GET' }),
};

export const applicationsAPI = {
  getAll: (headers) =>
    apiCall('/applications', { method: 'GET', headers }),

  create: (applicationData, headers) => {
    const jobId = applicationData?.jobId;
    const endpoint = jobId ? `/applications/${jobId}/apply` : '/applications';
    return apiCall(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(applicationData),
    });
  },

  withdraw: (applicationId, headers) =>
    apiCall(`/applications/${applicationId}/withdraw`, {
      method: 'PUT',
      headers,
    }),
};

export const connectionsAPI = {
  getAll: (headers) =>
    apiCall('/connections', { method: 'GET', headers }),
  
  getPending: (headers) =>
    apiCall('/connections/requests/pending', { method: 'GET', headers }),
  
  request: (targetId, headers) =>
    apiCall('/connections/request', {
      method: 'POST',
      headers,
      body: JSON.stringify({ targetId }),
    }),
  
  accept: (requestId, headers) =>
    apiCall(`/connections/${requestId}/accept`, {
      method: 'PUT',
      headers,
    }),
  
  reject: (requestId, headers) =>
    apiCall(`/connections/${requestId}/reject`, {
      method: 'PUT',
      headers,
    }),
};

export const messagesAPI = {
  getConversations: (headers) =>
    apiCall('/messages/conversations', { method: 'GET', headers }),
  
  getMessages: (conversationId, headers) =>
    apiCall(`/messages/${conversationId}`, { method: 'GET', headers }),
  
  sendMessage: (messageData, headers) =>
    apiCall('/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(messageData),
    }),
};

export const notificationsAPI = {
  getAll: (headers) =>
    apiCall('/notifications', { method: 'GET', headers }),
  
  markAsRead: (notificationId, headers) =>
    apiCall(`/notifications/${notificationId}/read`, {
      method: 'POST',
      headers,
    }),
};

export const postsAPI = {
  getAll: (params) =>
    apiCall(`/posts?${params}`, { method: 'GET' }),
  
  create: (postData, headers) =>
    apiCall('/posts', {
      method: 'POST',
      headers,
      body: JSON.stringify(postData),
    }),
  
  likePost: (postId, headers) =>
    apiCall(`/posts/${postId}/like`, {
      method: 'POST',
      headers,
    }),
};

export default API_BASE_URL;
