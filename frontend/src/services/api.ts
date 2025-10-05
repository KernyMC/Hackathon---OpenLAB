const API_BASE_URL = "http://localhost:5000/api";

export const apiService = {
  // Get all ONGs
  async getONGs() {
    try {
      const response = await fetch(`${API_BASE_URL}/ong`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching ONGs:", error);
      throw error;
    }
  },

  // Get projects by ONG
  async getProjectsByONG(idOng: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyecto/ong/${idOng}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  // Get items with optional filters
  async getItems(filters: {
    idProyecto?: string;
    mes?: string;
    year?: string;
  }) {
    try {
      const params = new URLSearchParams();
      if (filters.idProyecto) params.append("idProyecto", filters.idProyecto);
      if (filters.mes) params.append("mes", filters.mes);
      if (filters.year) params.append("year", filters.year);

      const response = await fetch(
        `${API_BASE_URL}/item?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  },

  // Get KPIs
  async getKPIs(idProyecto?: string) {
    try {
      const url = idProyecto
        ? `${API_BASE_URL}/kpi?idProyecto=${idProyecto}`
        : `${API_BASE_URL}/kpi`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching KPIs:", error);
      throw error;
    }
  },

  // Get user statistics
  async getUserStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/estadisticas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  },

  // Get ejes by project
  async getEjesByProject(idProyecto: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/eje?idProyecto=${idProyecto}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching ejes:", error);
      throw error;
    }
  },
};
