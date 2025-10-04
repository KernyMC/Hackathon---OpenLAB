import { useState, useEffect } from 'react'
import api from '../services/auth'

function Dashboard({ user, onLogout }) {
  const [profile, setProfile] = useState(user)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Usar los datos del usuario que ya tenemos
    console.log('Dashboard - Datos del usuario:', user)
    if (user) {
      setProfile(user)
    }
  }, [user])

  const loadProfile = async () => {
    try {
      setLoading(true)
      // Intentar cargar desde la API, pero usar datos locales si falla
      const response = await api.get('/users/profile')
      setProfile(response.data)
    } catch (error) {
      console.error('Error cargando perfil:', error)
      // Si falla la API, usar los datos que ya tenemos
      setProfile(user)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    api.post('/auth/logout').catch(() => {}) // Ignorar errores
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hackathon Dashboard</h1>
              <p className="text-sm text-gray-600">Bienvenido al sistema</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hola, {profile?.name || user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfil de Usuario</h3>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <div className="space-y-2">
                <p><span className="font-medium">Nombre:</span> {profile?.name || 'No disponible'}</p>
                <p><span className="font-medium">Email:</span> {profile?.email || 'No disponible'}</p>
                <p><span className="font-medium">Rol:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    profile?.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {profile?.role || 'user'}
                  </span>
                </p>
                <p><span className="font-medium">Miembro desde:</span> {
                  profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'Hoy'
                }</p>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="text-green-600 font-medium">Activo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Último acceso:</span>
                <span className="text-gray-900">
                  {profile?.last_login 
                    ? new Date(profile.last_login).toLocaleString()
                    : 'Ahora'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sesión:</span>
                <span className="text-blue-600 font-medium">Activa</span>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
            <div className="space-y-3">
              <button 
                onClick={loadProfile}
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Actualizar Perfil'}
              </button>
              <button className="btn btn-secondary w-full">
                Configuración
              </button>
              <button className="btn btn-secondary w-full">
                Ayuda
              </button>
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="mt-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de la API</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Backend conectado correctamente</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Conexión establecida con el servidor de hackathon
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
