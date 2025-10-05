import { useMemo, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  ngoId: string;
}

interface NGO {
  id: string;
  name: string;
}

const UsersIndex = () => {
  // Mock ONGs (en una integración real vendría de API o contexto)
  const ngos: NGO[] = [
    { id: "1", name: "BAQ" },
    { id: "2", name: "BAA Cuenca" },
    { id: "3", name: "BA Esmeraldas" },
  ];

  const [users, setUsers] = useState<UserRep[]>([
    { id: "u1", name: "María García", email: "maria@baq.org", phone: "+593 99 111 2222", ngoId: "1" },
    { id: "u2", name: "Juan Pérez", email: "juan@baacuenca.org", phone: "+593 98 333 4444", ngoId: "2" },
  ]);

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", ngoId: "" });

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const ngoMap = useMemo(() => Object.fromEntries(ngos.map(n => [n.id, n.name])), [ngos]);

  const save = () => {
    if (!form.name || !form.email || !form.ngoId) return;
    const newU: UserRep = { id: Date.now().toString(), ...form } as UserRep;
    setUsers(prev => [...prev, newU]);
    setIsOpen(false);
    setForm({ name: "", email: "", phone: "", ngoId: "" });
  };

  const remove = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));

  return (
    <PageLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Usuarios</h1>
            <p className="text-muted-foreground mt-1">Representantes de ONGs y asignación de organización.</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" /> Añadir Usuario</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nuevo Representante</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label>Nombre</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nombre completo" />
                </div>
                <div>
                  <Label>Correo</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+593 99 000 0000" />
                </div>
                <div>
                  <Label>Selecciona tu ONG</Label>
                  <Select value={form.ngoId} onValueChange={(v) => setForm({ ...form, ngoId: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccione ONG" />
                    </SelectTrigger>
                    <SelectContent>
                      {ngos.map(n => (
                        <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button className="flex-1" onClick={save}>Guardar</Button>
                  <Button className="flex-1 border" onClick={() => setIsOpen(false)}>Cancelar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuarios..." className="pl-10" />
        </div>

        {/* Tabla */}
        <div className="border rounded-xl bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>ONG</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>{ngoMap[u.ngoId] || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button className="p-2"><Pencil className="w-4 h-4" /></Button>
                      <Button className="p-2" onClick={() => remove(u.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  );
};

export default UsersIndex;
