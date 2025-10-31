import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NGOLogin from "./pages/ngo/Login";
import NGOProjects from "./pages/ngo/Projects";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminNGOs from "./pages/admin/NGOs";
import AdminProjects from "./pages/admin/Projects";
import UsersIndex from "./pages/users/Index";

import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

          <Route path="/ngo/login" element={<NGOLogin />} />
          <Route path="/ngo/projects" element={<NGOProjects />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/ngos" element={<AdminNGOs />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/users" element={<UsersIndex />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
   
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
