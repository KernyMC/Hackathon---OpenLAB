import axios from 'axios'

// Configurar axios con la URL base del backend
const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar el token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Servicios de autenticación
export const authService = {
  // Login
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })
      
      const { token, user } = response.data
      
      // Guardar token en localStorage
      localStorage.setItem('token', token)
      
      return { token, user }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el login')
    }
  },

  // Registro
  async register(name, email, password) {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      })
      
      const { token, user } = response.data
      
      // Guardar token en localStorage
      localStorage.setItem('token', token)
      
      return { token, user }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el registro')
    }
  },

  // Verificar autenticación
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify')
      return response.data.user
    } catch (error) {
      throw new Error('Token inválido')
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token')
  }
}

// Función para verificar si el usuario está autenticado
export const checkAuth = async () => {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    return await authService.verifyToken()
  } catch (error) {
    return null
  }
}

export default api
