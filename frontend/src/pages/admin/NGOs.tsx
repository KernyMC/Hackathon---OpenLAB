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
  manager: string; // representante
  email: string;
  phone: string;
  ruc?: string;
  website?: string;
  address?: string;
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
      website: "https://baq.org",
      ruc: "1790012345001",
      address: "Quito"
    },
    {
      id: "2",
      name: "BAA Cuenca",
      manager: "Ana Martínez",
      email: "ana@baacuenca.org",
      phone: "+593-7-234-5678",
      website: "https://baacuenca.org",
      ruc: "0190023456001",
      address: "Cuenca"
    },
    {
      id: "3",
      name: "BA Esmeraldas",
      manager: "Luis Torres",
      email: "luis@baesmeraldas.org",
      phone: "+593-6-234-5678",
      website: "https://baesmeraldas.org",
      ruc: "0890034567001",
      address: "Esmeraldas"
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
    ruc: "",
    website: "",
    address: "",
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
    setFormData({ name: "", manager: "", email: "", phone: "", ruc: "", website: "", address: "" });
    
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
                Añadir ONG
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva ONG</DialogTitle>
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
                    Representante <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    placeholder="Nombre del representante"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="ruc">RUC</Label>
                    <Input id="ruc" value={formData.ruc} onChange={(e) => setFormData({ ...formData, ruc: e.target.value })} placeholder="1790012345001" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input id="website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://sitio.org" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Ciudad, Calle y número" />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreate} className="flex-1">
                    Guardar ONG
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreateOpen(false);
                      setFormData({ name: "", manager: "", email: "", phone: "", ruc: "", website: "", address: "" });
                    }}
                    className="flex-1 border"
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

        <div className="border rounded-lg bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ONG</TableHead>
                <TableHead>Representante</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>RUC</TableHead>
                <TableHead>Sitio Web</TableHead>
                <TableHead>Dirección</TableHead>
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
                  <TableCell>{ngo.ruc || '-'}</TableCell>
                  <TableCell>
                    {ngo.website ? (
                      <a href={ngo.website} target="_blank" rel="noreferrer" className="text-sidebar-primary hover:underline">
                        {ngo.website}
                      </a>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{ngo.address || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button className="p-2"><Eye className="w-4 h-4" /></Button>
                      <Button className="p-2"><Pencil className="w-4 h-4" /></Button>
                      <Button
                        className="p-2"
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