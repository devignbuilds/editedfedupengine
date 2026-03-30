const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const getHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const engineApi = {
  // --- Projects ---
  projects: {
    getAll: async (token: string) => {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        headers: getHeaders(token),
      });
      return res.json();
    },
    getById: async (id: string, token: string) => {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        headers: getHeaders(token),
      });
      return res.json();
    },
    update: async (id: string, data: any, token: string) => {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      return res.json();
    },
    delete: async (id: string, token: string) => {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: getHeaders(token),
      });
      return res.json();
    },
  },

  // --- Tasks ---
  tasks: {
    getAll: async (token: string) => {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        headers: getHeaders(token),
      });
      return res.json();
    },
    getByProject: async (projectId: string, token: string) => {
      const res = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`, {
        headers: getHeaders(token),
      });
      return res.json();
    },
    create: async (data: any, token: string) => {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      return res.json();
    },
    update: async (id: string, data: any, token: string) => {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      return res.json();
    },
    delete: async (id: string, token: string) => {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getHeaders(token),
      });
      return res.json();
    },
  },

  // --- Users ---
  users: {
    getAll: async (token: string) => {
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: getHeaders(token),
      });
      return res.json();
    },
    update: async (id: string, data: any, token: string) => {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      return res.json();
    },
  },
};
