import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NGOLogin = () => {
  return (
    <PageLayout role="ngo">
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Inicio de Sesión ONG</CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al portal de la ONG
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" placeholder="nombre@organizacion.org" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full" type="submit">
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default NGOLogin;
