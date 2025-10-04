import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Plataforma de Gestión de ONGs
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Optimice el seguimiento de proyectos, monitoree el impacto y gestione las operaciones
            de ONGs con nuestra solución integral de panel de control.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Portal ONG</CardTitle>
              <CardDescription>
                Acceda a los proyectos de su organización, realice seguimiento de indicadores y envíe informes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/ngo/projects">
                <Button className="w-full">
                  Ingresar al Portal ONG
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Portal de Administrador</CardTitle>
              <CardDescription>
                Gestione ONGs, supervise todos los proyectos y vea análisis completos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/dashboard">
                <Button className="w-full">
                  Ingresar al Portal de Administrador
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Confiado por ONGs en todo Ecuador para rastrear y gestionar sus proyectos de impacto social
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
