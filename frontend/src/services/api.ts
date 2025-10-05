const API_BASE_URL = "http://localhost:5000/api";

export const apiService = {
  // Get all ONGs
  async getONGs() {
    const response = await fetch(`${API_BASE_URL}/ong`);
    return response.json();
  },

  // Get projects by ONG
  async getProjects() {
    const response = await fetch(`${API_BASE_URL}/proyecto`);
    return response.json();
  },

  // Get user statistics
  async getUserStats() {
    const response = await fetch(`${API_BASE_URL}/usuario/estadisticas`);
    return response.json();
  },

  // Get KPIs
  async getKPIs() {
    const response = await fetch(`${API_BASE_URL}/kpi`);
    return response.json();
  },
};
