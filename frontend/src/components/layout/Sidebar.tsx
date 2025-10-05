import { NavLink } from "react-router-dom";
import { BarChart3, Building2, FolderOpen, Users, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  role: "ngo" | "admin";
}

const Sidebar = ({ role }: SidebarProps) => {
  const ngoLinks = [
    { to: "/ngo/projects", label: "Proyectos", icon: FolderOpen },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
    { to: "/admin/ngos", label: "ONGs", icon: Building2 },
    { to: "/admin/projects", label: "Proyectos", icon: FolderOpen },
    { to: "/users", label: "Usuarios", icon: Users },
  ];

  const links = role === "ngo" ? ngoLinks : adminLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            {role === "ngo" ? "Portal ONG" : "Portal Administrador"}
          </h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )
                  }
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="text-xs text-sidebar-foreground/60 text-center mb-2">
            Modo de desarrollo
          </div>
          <NavLink to={role === "admin" ? "/ngo/projects" : "/admin/dashboard"} className="block">
            <Button
              variant="outline"
              className="w-full gap-2 border-sidebar-border hover:bg-sidebar-accent"
            >
              <UserCog className="w-4 h-4" />
              {role === "admin" ? "Cambiar a ONG" : "Cambiar a Admin"}
            </Button>
          </NavLink>
          <div className="text-[10px] text-sidebar-foreground/40 text-center">
            Usuario actual: {role === "admin" ? "Administrador" : "BAA Cuenca"}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
