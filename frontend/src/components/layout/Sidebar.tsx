import { NavLink } from "react-router-dom";
import { LayoutDashboard, Building2, FolderOpen, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "ngo" | "admin";
}

const Sidebar = ({ role }: SidebarProps) => {
  const ngoLinks = [
    { to: "/ngo/login", label: "Inicio de Sesión", icon: LogIn },
    { to: "/ngo/projects", label: "Proyectos", icon: FolderOpen },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Panel de Control", icon: LayoutDashboard },
    { to: "/admin/ngos", label: "ONGs", icon: Building2 },
    { to: "/admin/projects", label: "Proyectos", icon: FolderOpen },
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

        <div className="p-4 border-t border-sidebar-border">
          <NavLink
            to="/"
            className="flex items-center justify-center px-4 py-2 text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
          >
            Cambiar Rol
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
