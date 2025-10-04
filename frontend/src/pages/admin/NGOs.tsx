import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Plus, Eye, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NGO {
  id: string;
  name: string;
  manager: string;
  email: string;
  phone: string;
}

const AdminNGOs = () => {
  const { toast } = useToast();
  const [ngos, setNgos] = useState<NGO[]>([
    {
      id: "1",
      name: "BAQ",
      manager: "Carlos Rodríguez",
      email: "carlos@baq.org",
      phone: "+593-2-234-5678",
    },
    {
      id: "2",
      name: "BAA Cuenca",
      manager: "Ana Martínez",
      email: "ana@baacuenca.org",
      phone: "+593-7-234-5678",
    },
    {
      id: "3",
      name: "BA Esmeraldas",
      manager: "Luis Torres",
      email: "luis@baesmeraldas.org",
      phone: "+593-6-234-5678",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    email: "",
    phone: "",
  });

  const filteredNGOs = ngos.filter(
    (ngo) =>
      ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setNgos(ngos.filter((n) => n.id !== id));
    setDeleteId(null);
    toast({
      title: "ONG eliminada",
      description: "La ONG ha sido eliminada exitosamente.",
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.manager || !formData.email || !formData.phone) {
      toast({
        title: "Campos faltantes",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Correo inválido",
        description: "Por favor ingrese una dirección de correo válida.",
        variant: "destructive",
      });
      return;
    }

    const newNGO: NGO = {
      id: Date.now().toString(),
      ...formData,
    };

    setNgos([...ngos, newNGO]);
    setIsCreateOpen(false);
    setFormData({ name: "", manager: "", email: "", phone: "" });
    
    toast({
      title: "ONG creada",
      description: "La ONG ha sido agregada exitosamente.",
    });
  };

  return (
    <PageLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ONGs</h1>
            <p className="text-muted-foreground mt-1">
              Gestione las organizaciones ONGs y su información
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Crear ONG
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva ONG</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="ngoName">
                    Nombre de la ONG <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ngoName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ingrese el nombre de la ONG"
                  />
                </div>

                <div>
                  <Label htmlFor="manager">
                    Nombre del Gerente <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    placeholder="Ingrese el nombre del gerente"
                  />
                </div>

                <div>
                  <Label htmlFor="email">
                    Correo Electrónico <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">
                    Teléfono <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+593-2-234-5678"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreate} className="flex-1">
                    Guardar ONG
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setFormData({ name: "", manager: "", email: "", phone: "" });
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar ONGs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre de la ONG</TableHead>
                <TableHead>Gerente</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNGOs.map((ngo) => (
                <TableRow key={ngo.id}>
                  <TableCell className="font-medium">{ngo.name}</TableCell>
                  <TableCell>{ngo.manager}</TableCell>
                  <TableCell>{ngo.email}</TableCell>
                  <TableCell>{ngo.phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(ngo.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de que desea eliminar esta ONG?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la ONG
              y todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default AdminNGOs;
