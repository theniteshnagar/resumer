const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const tokenKey = "resumer_token";

localStorage.removeItem("resumer_local");

export const getToken = () => localStorage.getItem(tokenKey);
export const setSession = (token, user) => {
  localStorage.setItem(tokenKey, token);
  localStorage.setItem("resumer_user", JSON.stringify(user));
};
export const clearSession = () => {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem("resumer_user");
};
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem("resumer_user") || "null"); } catch { return null; }
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}), ...options.headers },
    ...options,
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(body?.message || "Request failed");
  return body;
};

export const authApi = {
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
};

export const resumeApi = {
  list: () => request("/resumes").then(({ resumes }) => resumes),
  get: (id) => request(`/resumes/${id}`).then(({ resume }) => resume),
  create: (payload) => request("/resumes", { method: "POST", body: JSON.stringify(payload) }).then(({ resume }) => resume),
  update: (id, payload) => request(`/resumes/${id}`, { method: "PATCH", body: JSON.stringify(payload) }).then(({ resume }) => resume),
  remove: (id) => request(`/resumes/${id}`, { method: "DELETE" }),
};
