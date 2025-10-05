import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Datos quemados permitidos — redirigir siempre
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-100 ring-1 ring-red-50">
        {/* Izquierda: imagen grande */}
        <div className="hidden md:block">
          <div className="h-full w-full relative">
            <img
              src="/fotos/Aliar-sc.png"
              alt="Aliar logo"
              className="object-cover h-full w-full"
            />
          </div>
        </div>

        {/* Derecha: formulario */}
        <div className="p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-red-700">Iniciar Sesión</h1>
              <p className="text-sm text-muted-foreground mt-2">Accede a tu cuenta</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  placeholder="usuario@ejemplo.com"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800">
                  Iniciar sesión
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;