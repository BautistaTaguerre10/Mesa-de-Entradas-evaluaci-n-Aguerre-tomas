// Define las rutas de navegacion del frontend y que pagina se muestra en cada URL.
import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { ExpedientesPage } from "../pages/ExpedientesPage";
import { OrganismosPage } from "../pages/OrganismosPage";
import { PersonasPage } from "../pages/PersonasPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/personas" element={<PersonasPage />} />
        <Route path="/organismos" element={<OrganismosPage />} />
        <Route path="/expedientes" element={<ExpedientesPage />} />
      </Route>
    </Routes>
  );
}
